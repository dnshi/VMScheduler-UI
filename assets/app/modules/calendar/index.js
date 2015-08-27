import reservation from './reservation';
import Calendar from './calendar.directive';

export default angular
  .module('app.calendar', [reservation])
  .directive('calendar', Calendar)
  .name;
