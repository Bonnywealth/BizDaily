/**
 * Storage helper wrappers.
 * Next phase: add migration, versioning, and type-safe serialization.
 */

export function saveToLocal(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // handle quota errors
    console.warn("persist save failed", e);
  }
}

export function loadFromLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn("persist load failed", e);
    return null;
  }
}
