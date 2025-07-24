import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private initDB() {
    const request = indexedDB.open('NetworkSystemDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      if (!this.db.objectStoreNames.contains('icons')) {
        this.db.createObjectStore('icons', { keyPath: 'id' });
      }
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', request.error);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };
  }

  async storeIcon(id: string, data: string) {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('icons', 'readwrite');
      const store = transaction.objectStore('icons');
      const request = store.put({ id, data });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getIcon(id: string): Promise<string | undefined> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('icons', 'readonly');
      const store = transaction.objectStore('icons');
      const request = store.get(id);

      request.onsuccess = () =>
        resolve(request.result ? request.result.data : undefined);
      request.onerror = () => reject(request.error);
    });
  }
}
