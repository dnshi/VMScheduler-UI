let Container = () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./container.html'),
  scope: false
});

export default Container;
