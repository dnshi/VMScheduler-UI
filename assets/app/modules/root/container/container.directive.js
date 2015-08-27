let Container = () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./container.html'),
  scope: false,

  controller: () => {}
});

export default Container;
