export function getRiskTone(score: number) {
  if (score >= 75) {
    return {
      badge: "border-red-400/40 bg-red-500/10 text-red-200",
      card: "border-red-400/20"
    };
  }

  if (score >= 45) {
    return {
      badge: "border-amber-400/40 bg-amber-500/10 text-amber-200",
      card: "border-amber-400/20"
    };
  }

  return {
    badge: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
    card: "border-emerald-400/20"
  };
}

export function getPriorityTone(score: number) {
  if (score >= 75) {
    return {
      badge: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200",
      card: "border-fuchsia-400/20"
    };
  }

  if (score >= 45) {
    return {
      badge: "border-sky-400/40 bg-sky-500/10 text-sky-200",
      card: "border-sky-400/20"
    };
  }

  return {
    badge: "border-zinc-400/30 bg-zinc-500/10 text-zinc-200",
    card: "border-zinc-400/15"
  };
}

export function getImpactTone(relationship: string) {
  if (relationship === "downstream") {
    return "border-cyan-400/20 text-cyan-100";
  }

  return "border-emerald-400/20 text-emerald-100";
}
