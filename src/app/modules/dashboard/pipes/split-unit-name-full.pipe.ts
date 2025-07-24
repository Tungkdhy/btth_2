import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitUnitNameFull',
  standalone: true,
})
export class SplitUnitNameFullPipe implements PipeTransform {
  transform(value: string): string[] {
    if (!value) return [];
    return value.split('\n').filter((x) => x !== 'Bộ Quốc Phòng');
  }
}
