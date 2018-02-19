angular.module('ba').directive('loadmore', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var raw = element[0];
      var timeoutHandler = null;
      element.bind('scroll', function () {
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight - 10) {
          if(!timeoutHandler) {
            timeoutHandler = setTimeout(function(){
              timeoutHandler = null;
              scope.$apply(attrs.loadmore);
            }, 300);
          }
        }
      });
    }
  };
});