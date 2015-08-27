// import libs
import 'jquery';
import 'moment';
import 'angular';
import 'ui-router';
import 'semantic';
import 'fullcalendar';
import NProgress from 'nprogress';

import '../main.styl';

// import modules
import root from './modules/root';
import calendar from './modules/calendar';

let config = ($urlRouterProvider, $locationProvider) => {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);

  NProgress.configure({ easing: 'ease', speed: 500, trickleRate: 0.02, trickleSpeed: 800 });
};

let run = ($rootScope) => {
  $rootScope.$on('$stateChangeStart', () => NProgress.start());

  $rootScope.$on('$stateChangeSuccess', () => setTimeout(NProgress.done, 300));

  console.log('vmScheduler started');
};

const app = angular
  .module('vmScheduler', [
    'ui.router',

    root,
    calendar
  ]);

app.config(config);
app.run(run);
