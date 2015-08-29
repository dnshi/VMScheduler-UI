class Ctrl {
  static $inject = ['$element']

  constructor($element) {
    this.el = $element;
    this.init();

    this.value = new Date(1970, 0, 1, 14, 57, 0);
  }

  init() {
    this.el
      .sidebar({
        closable: false,
        context: angular.element('#page-container'),
        transition: 'scale down'
      })
      .sidebar('attach events', '#vms-create-new');
  }

  confirm() {
    this.el
      .sidebar('hide');
  }

  discard() {
    this.el
      .sidebar('hide');
  }
}

let Reservation = () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./reservation.html'),
  scope: false,
  controllerAs: 'reservation',
  controller: Ctrl
});

export default Reservation;
