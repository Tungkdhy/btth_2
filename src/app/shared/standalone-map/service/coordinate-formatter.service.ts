import { Injectable } from '@angular/core';
import ControlMousePosition from 'ol/control/MousePosition';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class CoordinateFormatterService {
  control: ControlMousePosition;
  positionTemplate: string;

  constructor() {
    this.control = new ControlMousePosition({
      className: 'mouseposition-control',
      // coordinateFormat: (coordinates: number[] | undefined) =>
      //   this.numberCoordinates(toLonLat(coordinates!), 4),
      coordinateFormat: (coordinates: number[] | undefined) =>
        `Tọa độ: ${this.translateCoordinates(
          toStringHDMS(toLonLat(coordinates!)),
        )}`,
    });
  }

  setPositionTemplate(positionTemplate: string) {
    this.positionTemplate = positionTemplate;
  }

  // numberCoordinates(coordinates: number[], fractionDigits: number = 0) {
  //   const template = this.positionTemplate || '{x} {y}';
  //
  //   const x = coordinates[0];
  //   const y = coordinates[1];
  //   const sX = x.toFixed(fractionDigits);
  //   const sY = y.toFixed(fractionDigits);
  //   return template.replace('{x}', sX).replace('{y}', sY);
  // }

  translateCoordinates(input: string): string {
    // Replace 'N' with 'Bắc' and 'E' with 'Đông'
    input = input.replace(/N/g, 'Bắc').replace(/E/g, 'Đông');

    return input;
  }
}
