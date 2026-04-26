import { getSessionTokenFromCookie } from "@/lib/backend/proxy";

type CachedPayload = {
  body: string;
  contentType: string;
  expiresAt: number;
  status: number;
};

type RequestControlStore = {
  cache: Map<string, CachedPayload>;
  cooldowns: Map<string, number>;
};

declare global {
  // eslint-disable-next-line no-var
  var __pronuntRequestControl__: RequestControlStore | undefined;
}

function getStore(): RequestControlStore {
  if (!globalThis.__pronuntRequestControl__) {
    globalThis.__pronuntRequestControl__ = {
      cache: new Map(),
      cooldowns: new Map()
    };
  }

  return globalThis.__pronuntRequestControl__;
}

async function getSessionScope() {
  const sessionToken = await getSessionTokenFromCookie();
  return sessionToken ?? "anonymous";
}

function buildScopedKey(scope: string, key: string) {
  return `${scope}:${key}`;
}

export async function withSessionCache(
  key: string,
  ttlMs: number,
  producer: () => Promise<Response>
) {
  const store = getStore();
  const scope = await getSessionScope();
  const scopedKey = buildScopedKey(scope, key);
  const cached = store.cache.get(scopedKey);

  if (cached && cached.expiresAt > Date.now()) {
    return new Response(cached.body, {
      status: cached.status,
      headers: { "Content-Type": cached.contentType, "X-Pronunt-Cache": "HIT" }
    });
  }

  const response = await producer();
  const body = await response.text();
  const contentType = response.headers.get("Content-Type") ?? "application/json";

  if (response.ok) {
    store.cache.set(scopedKey, {
      body,
      contentType,
      expiresAt: Date.now() + ttlMs,
      status: response.status
    });
  }

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": contentType, "X-Pronunt-Cache": "MISS" }
  });
}

export async function enforceSessionCooldown(key: string, cooldownMs: number) {
  const store = getStore();
  const scope = await getSessionScope();
  const scopedKey = buildScopedKey(scope, key);
  const existingUntil = store.cooldowns.get(scopedKey);

  if (existingUntil && existingUntil > Date.now()) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existingUntil - Date.now()) / 1000));
    return new Response(
      JSON.stringify({
        code: "rate_limited",
        message: "That action is cooling down. Please wait a moment before trying again."
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSeconds)
        }
      }
    );
  }

  store.cooldowns.set(scopedKey, Date.now() + cooldownMs);
  return null;
}

export async function invalidateSessionCache(prefixes: string[] = []) {
  const store = getStore();
  const scope = await getSessionScope();
  const scopedPrefixSet = prefixes.map((prefix) => buildScopedKey(scope, prefix));

  for (const key of [...store.cache.keys()]) {
    if (
      scopedPrefixSet.length === 0 ||
      scopedPrefixSet.some((prefix) => key === prefix || key.startsWith(`${prefix}:`))
    ) {
      store.cache.delete(key);
    }
  }
}
