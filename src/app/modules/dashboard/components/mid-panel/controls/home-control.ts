import { Control } from 'ol/control';

export class HomeControl extends Control {
  constructor(optOptions: any) {
    const options = optOptions || {};

    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = 'bi bi-house-door';
    button.appendChild(icon);

    const element = document.createElement('div');
    element.className =
      'home-control custom-control ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener(
      'click',
      () => {
        options.onClick();
      },
      false,
    );
  }
}
