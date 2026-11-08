export type WeddingMedia = {
  id: string;
  table: number;
  name: string;
  type: "photo" | "video";
  blob: Blob;
  createdAt: number;
  challengeIndex?: number;
};

const DB_NAME = "riel-cara-wedding-preview";
const STORE = "media";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Browser storage is unavailable."));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open browser storage."));
  });
}

export async function saveWeddingMedia(item: WeddingMedia) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save the file."));
    tx.onabort = () => reject(tx.error ?? new Error("Could not save the file."));
  });
  db.close();
}

export async function getWeddingMedia(): Promise<WeddingMedia[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => {
      db.close();
      resolve((request.result as WeddingMedia[]).sort((a, b) => b.createdAt - a.createdAt));
    };
    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not load saved files."));
    };
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