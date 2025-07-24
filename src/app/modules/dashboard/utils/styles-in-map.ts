import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import {Feature} from "ol";

const redColor = '#B22222';
const greenColor = '#9ACD32';
const blackColor = '#000000';

const redStroke = new Stroke({ color: '#F08080', width: 3 }); // Đường viền màu sáng đỏ
const redFill = new Fill({ color: '#B22222' }); // Màu fill màu đỏ tối

const greenStroke = new Stroke({ color: '#9ACD32', width: 2 }); // Đường viền màu sáng đỏ
const greenFill = new Fill({ color: '#00FF00' }); // Màu fill màu đỏ tối

const blackStroke = new Stroke({ color: blackColor, width: 2 }); // Đường viền màu sáng đỏ
const grayFill = new Fill({ color: '#a6a6a6' }); // Màu fill màu đỏ tối

export const polygonStyle = (color: string = '#000000') =>
  new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0)',
    }),
    stroke: new Stroke({
      color: color,
      width: 2,
    }),
  });

export const squareStyle = (fill: Fill, stroke: Stroke) =>
  new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4, // Số điểm của hình vuông
      radius: 6, // Bán kính (tùy chỉnh kích thước)
      angle: Math.PI / 4, // Góc xoay (để đảm bảo hình vuông không bị nghiêng)
      scale: 2,
    }),
  });

export const createLineStyle = (
  strokeColor: string,
  strokeWidth: number = 2,
): Style => {
  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
  });
};

export const militaryPointStyle = squareStyle(grayFill, blackStroke);
export const militaryLineStyle = (width: number = 2) =>
  createLineStyle(blackColor, width);

export const internetPointStyle = squareStyle(greenFill, greenStroke);
export const internetLineStyle = (width: number = 2) =>
  createLineStyle(greenColor, width);

export const cableLineStyle = (color: string) => createLineStyle(color, 2);

export function seaCableLineStyle(feature: Feature) {
  const color = feature.get('color') || '#000000';
  return createLineStyle(color, 2);
}
