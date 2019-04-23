(function() {
  'use strict';
  theApp.controller('CommonController', CommonController);
  CommonController.$inject = ['$scope', '$rootScope', '$compile', '$cookies','NavigationService', '$location', 'UIVER', 'VER', 'LoginService', 'SpaceService', 'API_HOST'];

  function CommonController($scope, $rootScope, $compile, $cookies, NavigationService,$location, UIVER, VER, LoginService, SpaceService, API_HOST) {
    //console.log("CommonController")
    //console.log("$rootScope.curentuser.username", $rootScope.curentuser.username)
    $scope.userName = $rootScope.curentuser.username;
    $scope.userType = $rootScope.curentuser.type;
    $scope.userRule = $rootScope.userRule;
    $scope.account = $rootScope.account;
    $scope.uiver = UIVER;
    $scope.ver = VER;
    $scope.blogin = false;
    $scope.bloginpage = false;
    $scope.showManage = true;
    $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "")
    $rootScope.curentuser.key = ($cookies.get('key') != undefined ? $cookies.get('key') : "")
    $rootScope.curentuser.uuid = ($cookies.get('uuid') != undefined ? $cookies.get('uuid') : "")
    $scope.spaceName = $rootScope.curentuser.namespace
    $scope.APIHOST = API_HOST
    $scope.Auth = $rootScope.curentuser.uuid + ":" + $rootScope.curentuser.key
    $scope.copyText = function(area){
      if(area == 'host'){
        var thisCopy = document.getElementById("host");
      }
      else if(area == 'Auth'){
        $scope.copyStringToClipboard( $scope.Auth)
        return;
      }
      var range = document.createRange();
      window.getSelection().removeAllRanges();
      range.selectNode(thisCopy);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      showToast("Copied");
    };

    $scope.showKey = function(option){
      if(option == 'true'){
        $scope.showEye = true
        document.getElementById("AuthID").attributes["type"].value = "text";
      }else{
        $scope.showEye = false
        document.getElementById("AuthID").attributes["type"].value = "password";
      }
    };

    $scope.copyStringToClipboard = function  (str) {
      // Create new element
      var el = document.createElement('textarea');
      // Set value (string to be copied)
      el.value = str;
      // Set non-editable to avoid focus and move outside of view
      el.setAttribute('readonly', '');
      el.style = {position: 'absolute', left: '-9999px'};
      document.body.appendChild(el);
      // Select text inside element
      el.select();
      // Copy text to clipboard
      document.execCommand('copy');
      // Remove temporary element
      document.body.removeChild(el);
      showToast("Copied");
   }
  }


})();
