import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-breadcrum-left-right',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './breadcrum-left-right.component.html',
    styleUrls: ['./breadcrum-left-right.component.scss'],
})
export class BreadcrumLeftRightComponent {
    @Input() titleLevel1: string = '';
    @Input() titleLevel2: string = '';
    @Input() titleLevel3: string = '';  
}
