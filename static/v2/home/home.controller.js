(function() {
  'use strict';

  theApp.controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$rootScope', '$http', '$q', 'LoginService', '$uibModal', '$location', '$cookies', 'API_URL', 'VER', 'UIVER', 'REGISTER_PAGE'];

  function HomeController($scope, $rootScope, $http, $q, LoginService, $uibModal, $location, $cookies, API_URL, VER, UIVER, REGISTER_PAGE) {
    //$scope.updatettmplTime = Date.now(); // update template trong ng-include
    $scope.ver = VER;
    $scope.uiver = UIVER;
    var today = new Date();
    var d = today.getDate();
    var m = today.getMonth();
    var y = today.getFullYear();

    if ($rootScope.curentuser != null ){
      $scope.userName = $rootScope.curentuser.username;
      $scope.userType = $rootScope.curentuser.type;
    }


    if ($scope.userName != null && $scope.userName != undefined &&
      $scope.userType > 0 ){
          window.location = encodeURI("#device");
    }

  }

})();
