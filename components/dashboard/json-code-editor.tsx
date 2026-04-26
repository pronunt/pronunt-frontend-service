"use client";

import { useEffect, useMemo, useRef } from "react";

function syntaxHighlightJson(value: string) {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"\s*:?)|("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^".*":$/.test(match)) {
        return `<span class="text-emerald-300">${match}</span>`;
      }
      if (/^"/.test(match)) {
        return `<span class="text-zinc-100">${match}</span>`;
      }
      if (/true|false/.test(match)) {
        return `<span class="text-sky-200">${match}</span>`;
      }
      if (/null/.test(match)) {
        return `<span class="text-zinc-500">${match}</span>`;
      }
      return `<span class="text-white">${match}</span>`;
    }
  );
}

export function parseJsonDraft<T>(draft: string): {
  parsed: T | null;
  error: string | null;
  errorLine: number | null;
} {
  if (!draft.trim()) {
    return { parsed: null, error: null, errorLine: null };
  }

  try {
    return {
      parsed: JSON.parse(draft) as T,
      error: null,
      errorLine: null
    };
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : "JSON syntax is invalid.";
    const positionMatch = message.match(/position\s+(\d+)/i);
    const position = positionMatch ? Number(positionMatch[1]) : null;
    const errorLine =
      position !== null
        ? draft.slice(0, position).split("\n").length
        : null;

    return {
      parsed: null,
      error: "JSON syntax is invalid. Fix the document before saving.",
      errorLine
    };
  }
}

type JsonCodeEditorProps = {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
  errorLine?: number | null;
};

export function JsonCodeEditor({
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-[30rem]",
  errorLine
}: JsonCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLPreElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);

  const lines = useMemo(() => {
    const lineCount = Math.max(1, value.split("\n").length);
    return Array.from({ length: lineCount }, (_, index) => index + 1);
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !highlight || !lineNumbers) {
      return;
    }

    const syncScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    syncScroll();
    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, [value]);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/40 ${minHeightClassName}`}
    >
      <div className="flex h-full min-h-0">
        <div
          ref={lineNumbersRef}
          className="mono max-h-full w-14 shrink-0 overflow-hidden border-r border-white/8 bg-white/[0.02] px-3 py-5 text-right text-sm leading-7 text-zinc-500"
        >
          {lines.map((line) => (
            <div
              key={line}
              className={line === errorLine ? "text-red-300" : ""}
            >
              {line}
            </div>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <pre
            ref={highlightRef}
            aria-hidden="true"
            className="mono pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words px-5 py-5 text-sm leading-7"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlightJson(value || placeholder || "")
            }}
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Tab") {
                return;
              }

              event.preventDefault();
              const target = event.currentTarget;
              const selectionStart = target.selectionStart;
              const selectionEnd = target.selectionEnd;
              const nextValue =
                value.slice(0, selectionStart) + "  " + value.slice(selectionEnd);
              onChange(nextValue);

              requestAnimationFrame(() => {
                if (!textareaRef.current) {
                  return;
                }
                textareaRef.current.selectionStart = selectionStart + 2;
                textareaRef.current.selectionEnd = selectionStart + 2;
              });
            }}
            spellCheck={false}
            placeholder={placeholder}
            className="mono relative z-10 h-full min-h-0 w-full resize-none overflow-auto bg-transparent px-5 py-5 text-sm leading-7 text-transparent caret-white outline-none placeholder:text-zinc-600 selection:bg-cyan-200/20"
          />
        </div>
      </div>
    </div>
  );
}
