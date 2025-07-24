import Control from 'ol/control/Control';

export class InfoControl extends Control {
  constructor(optOptions: any) {
    const options = optOptions || {};

    const button = document.createElement('button');
    button.title = 'Click to activate info tool';
    const icon = document.createElement('i');
    icon.className = 'bi bi-info';
    button.appendChild(icon);

    const element = document.createElement('div');
    element.className =
      'info-control custom-control  ol-unselectable ol-control';

    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', () => {
      // Toggle the mode or activate the info mode
      options.toggleInfoMode();
    });
  }
}
