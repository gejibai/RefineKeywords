export const storageKeys = {
  image: "prompt-studio:image",
  reverse: "prompt-studio:reverse",
  video: "prompt-studio:video"
} as const;

export function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStored<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearStored(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}
