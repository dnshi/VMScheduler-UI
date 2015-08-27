let Header = () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  template: require('./header.html'),
  scope: false,

  controller: () => {}
});

export default Header;
