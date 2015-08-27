import Reservation from './reservation.directive';

export default angular
  .module('app.reservation', [])
  .directive('reservation', Reservation)
  .name;
