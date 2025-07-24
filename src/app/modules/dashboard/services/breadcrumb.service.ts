import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  id: string;
  label: string;
  data?: any;
}

export enum BreadcrumbIds {
  HOME = 'home',
  ALERT_DETAIL = 'alert-detail',
  INFRA_ALERT_LIST = 'infra-alert-list',
  INFO_SEC_ALERT_LIST = 'info-sec-alert-list',
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Initial breadcrumb
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([
    { id: BreadcrumbIds.HOME, label: 'Hình thái chung' },
  ]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  // Method to add a breadcrumb
  addBreadcrumb(breadcrumb: Breadcrumb) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    // Avoid duplicates
    const exists = currentBreadcrumbs.some((b) => b.id === breadcrumb.id);

    if (!exists) {
      this.breadcrumbsSubject.next([...currentBreadcrumbs, breadcrumb]);
    } else {
      // If breadcrumb exists, remove all breadcrumbs after it and add again to make it the last one
      const index = currentBreadcrumbs.findIndex((b) => b.id === breadcrumb.id);
      this.breadcrumbsSubject.next(currentBreadcrumbs.slice(0, index + 1));
    }
  }

  // Method to update the last breadcrumb (current/active)
  updateCurrentBreadcrumb(breadcrumb: Breadcrumb) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    if (currentBreadcrumbs.length > 0) {
      // Update the last breadcrumb in the array
      currentBreadcrumbs[currentBreadcrumbs.length - 1] = breadcrumb;
      this.breadcrumbsSubject.next([...currentBreadcrumbs]); // Trigger the update
    }
  }

  updateLastBreadcrumb(breadcrumb: Breadcrumb) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    if (currentBreadcrumbs.length === 1) {
      // If there is only one element (the first one), add a new breadcrumb
      this.breadcrumbsSubject.next([...currentBreadcrumbs, breadcrumb]);
    } else if (currentBreadcrumbs.length > 1) {
      // If there are more than one elements, update the last breadcrumb (excluding the first)
      currentBreadcrumbs[currentBreadcrumbs.length - 1] = breadcrumb;
      this.breadcrumbsSubject.next([...currentBreadcrumbs]);
    }
  }

  upsertBreadcrumb(breadcrumb: Breadcrumb) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    const index = currentBreadcrumbs.findIndex((b) => b.id === breadcrumb.id);

    if (index === -1) {
      // If the breadcrumb doesn't exist, add it
      this.breadcrumbsSubject.next([...currentBreadcrumbs, breadcrumb]);
    } else {
      // If it exists, update the breadcrumb
      currentBreadcrumbs[index] = breadcrumb;
      this.breadcrumbsSubject.next([...currentBreadcrumbs]);
    }
  }

  // Method to clear breadcrumbs after a specific breadcrumb
  clearBreadcrumbsAfter(id: string) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    const index = currentBreadcrumbs.findIndex((b) => b.id === id);

    if (index !== -1) {
      this.breadcrumbsSubject.next(currentBreadcrumbs.slice(0, index + 1));
    }
  }

  clearBreadcrumbs() {
    this.clearBreadcrumbsAfter(BreadcrumbIds.HOME);
  }

  // Method to get the current breadcrumbs without subscribing
  getCurrentBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.value;
  }

  // Method to get a specific breadcrumb by id
  getBreadcrumbById(id: string): Breadcrumb | undefined {
    return this.breadcrumbsSubject.value.find((b) => b.id === id);
  }

  // Method to check if a breadcrumb with the given id exists
  breadcrumbExists(id: string): boolean {
    return this.breadcrumbsSubject.value.some((b) => b.id === id);
  }

  removeBreadcrumbById(id: string) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    // Filter out the breadcrumb with the matching id
    const updatedBreadcrumbs = currentBreadcrumbs.filter(
      (breadcrumb) => breadcrumb.id !== id,
    );

    this.breadcrumbsSubject.next(updatedBreadcrumbs); // Update the breadcrumbs list
  }

  removeLastBreadcrumb() {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    if (currentBreadcrumbs.length > 1) {
      // Remove the last breadcrumb but keep the first one
      const updatedBreadcrumbs = currentBreadcrumbs.slice(
        0,
        currentBreadcrumbs.length - 1,
      );
      this.breadcrumbsSubject.next(updatedBreadcrumbs);
    }
  }
}
