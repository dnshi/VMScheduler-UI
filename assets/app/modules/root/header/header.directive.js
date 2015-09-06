let Header = () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./header.html'),
  scope: false
});

export default Header;
