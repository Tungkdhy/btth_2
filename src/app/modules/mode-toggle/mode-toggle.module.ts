import { NgModule } from "@angular/core";
import {
  ModeLocalStorageService,
  MODE_STORAGE_SERVICE,
} from "./mode-storage.service";
import { ModeToggleComponent } from "./mode-toggle.component";
import { ModeToggleService } from "./mode-toggle.service";
import {NgForOf} from "@angular/common";

/**
 * Angular module for mode toggling feature
 * Contains
 *  * ModeToggleComponent
 *  * ModeToggleService
 */
@NgModule({
    providers: [
        ModeToggleService,
        {
            provide: MODE_STORAGE_SERVICE,
            useClass: ModeLocalStorageService,
        },
    ],
    exports: [],
})
export class ModeToggleModule {}
