import Control from 'ol/control/Control';

export class AlertControl extends Control {
  constructor(optOptions: any) {
    const options = optOptions || {};

    // Call super first
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = 'bi bi-bell';
    button.appendChild(icon);

    const element = document.createElement('div');
    element.className =
      'alert-control custom-control ol-unselectable ol-control';
    element.appendChild(button);

    // element.innerHTML = `
    //   <i class="bi bi-bell"></i>
    //   <span class="alert-count" style="display: none;">0</span>
    // `;

    super({
      element: element,
      target: undefined,
    });

    // Event listener
    // element.addEventListener('click', this.toggleAlertList.bind(this));
    element.addEventListener(
      'click',
      () => {
        options.toggle();
      },
      false,
    );
  }
}
