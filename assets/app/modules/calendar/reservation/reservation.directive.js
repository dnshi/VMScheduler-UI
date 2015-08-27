class Ctrl {
  static $inject = ['$element']

  constructor($element) {
    this.el = $element;
    this.init();
  }

  init() {
    this.el
      .sidebar({
        // closable: false,
        context: $('#page-container'),
        transition: 'scale down'
      })
      .sidebar('attach events', '#vms-create-new');
  }
}

let Reservation = () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./reservation.html'),
  scope: false,
  controller: Ctrl
});

export default Reservation;
