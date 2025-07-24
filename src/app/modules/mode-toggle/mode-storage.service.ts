import { Injectable, InjectionToken } from "@angular/core";
import { Mode } from "./mode-toggle.model";
import {ModeType} from "./mode-toggle.service";

/**
 * Injection Token for ModeStorage
 */
export const MODE_STORAGE_SERVICE = new InjectionToken<ModeStorage>(
  "MODE_STORAGE"
);

/**
 * Interface that defines how the mode storage should happen
 */
export interface ModeStorage {
  /**
   * save function for the Mode
   * @todo best to have this as async functions
   * @param mode Mode
   */
  save(mode: ModeType): void;

  /**
   * get the Mode value from the storage
   * @todo best to have this as async functions
   */
  get(): ModeType;
}

/**
 * Browser Local Storage based implementation of ModeStorage
 */
@Injectable()
export class ModeLocalStorageService implements ModeStorage {
  /**
   * key for the Local Storage
   */
  LOCAL_STORAGE_KEY = "mode";

  save(mode: ModeType): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, mode.toString());
  }
  get(): ModeType {
    return <ModeType>localStorage.getItem(this.LOCAL_STORAGE_KEY) || undefined;
  }
}
