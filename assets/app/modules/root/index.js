import container from './container';
import header from './header';

let config = ($stateProvider) => $stateProvider.state('root', {
  url: '/',
  template: require('./root.html')
});

export default angular
  .module('vms.root', [container, header])
  .config(config)
  .name;
