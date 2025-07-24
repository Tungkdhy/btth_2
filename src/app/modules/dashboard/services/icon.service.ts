import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private http: HttpClient) {}

  async fetchAndStoreIcon(url: string, id: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      localStorage.setItem(`icon-${id}`, base64data as string);
    };
  }

  getIcon(id: string): string | null {
    return localStorage.getItem(`icon-${id}`);
  }
}
