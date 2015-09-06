class ReservationCtrl {
  static $inject = ['$scope', '$element', '$q']
  event = {}

  constructor(...args) {
    [this.scope, this.el, this.$q] = args;

    this.el
      .sidebar({
        closable: false,
        context: angular.element('#page-container'),
        transition: 'scale down'
      });
  }

  trigger(event) {
    if (event) {
      angular.extend(this.event, event);
      this.scope.$digest();
    }
    this.el
      .sidebar('toggle');

    return (this.deferred = this.$q.defer()).promise;
  }

  confirm() {
    let {el, event} = this;

    el.sidebar('hide');
    this.deferred.resolve(event);
  }

  discard() {
    this.el
      .sidebar('hide');

    this.deferred.reject();
  }
}

export default () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./reservation.html'),
  scope: false,
  controllerAs: 'reservation',
  controller: ReservationCtrl,
  bindToController: true,
});
