export type WeddingMedia = {
  id: string;
  table: number;
  name: string;
  type: "photo" | "video";
  blob: Blob;
  createdAt: number;
};

const DB_NAME = "riel-cara-wedding-preview";
const STORE = "media";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveWeddingMedia(item: WeddingMedia) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getWeddingMedia(): Promise<WeddingMedia[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as WeddingMedia[]).sort((a, b) => b.createdAt - a.createdAt));
    request.onerror = () => reject(request.error);
  });
}

export async function clearWeddingMedia() {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function mediaUrl(blob: Blob) {
  return URL.createObjectURL(blob);
}

export function saveGame(table: number, completed: number[]) {
  localStorage.setItem(`riel-cara-game-table-${table}`, JSON.stringify(completed));
}

export function loadGame(table: number): number[] {
  try {
    return JSON.parse(localStorage.getItem(`riel-cara-game-table-${table}`) ?? "[]");
  } catch {
    return [];
  }
}
