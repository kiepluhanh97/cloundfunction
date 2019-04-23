(function() {
  'use strict';
  theApp.controller('NavigationController', NavigationController);
  NavigationController.$inject = ['$scope', '$rootScope', '$compile', '$cookies','NavigationService', '$location', 'UIVER', 'VER', 'LoginService', 'SpaceService'];

  function NavigationController($scope, $rootScope, $compile, $cookies, NavigationService,$location, UIVER, VER, LoginService, SpaceService) {
    //console.log("NavigationController")
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

    if($scope.account.length >0){
      $scope.blogin = true;
    }
    if ($location.path() == "/login"){
      $scope.bloginpage = true;
    }
    if($scope.blogin === true){
      var arrNSInfo = ($cookies.get('arrNSInfo') != undefined ? $cookies.get('arrNSInfo') : "[]");
      var listNS = JSON.parse(arrNSInfo)
      $scope.listNS = []
      for(var i=0;i<listNS.length;i++){
        $scope.listNS.push(listNS[i])
      }
      $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "")
      $scope.namespace_selected = $rootScope.curentuser.namespace
      $rootScope.selectedNS = $cookies.get('selectedNS') != undefined ? $cookies.get('selectedNS') : ""
    }
    $scope.onChangeSubMenuSelected = function (item){
      $cookies.put('selectedNS', item);
      $cookies.put('namespace', item);
      $rootScope.selectedNS =  item
      $scope.namespace_selected = item
      $rootScope.curentuser.namespace = item
      //var tokenLogin = ($cookies.get('tokenLogin') != undefined ? $cookies.get('tokenLogin') : "")
      SpaceService.getSpaceDetail(item).then(function(response){
        console.log("SpaceService.getSpaceDetail", response);
          if (response.code == 0) {
              $rootScope.curentuser.key = response.data.key;
              $rootScope.curentuser.uuid = response.data.uuid;
              $cookies.put('key', $rootScope.curentuser.key);
              $cookies.put('uuid', $rootScope.curentuser.uuid);
              var tokenWSK = btoa( response.data.uuid + ":" + response.data.key )
              console.log("tokenWSK", tokenWSK)
              $rootScope.token = tokenWSK;
              $cookies.put('token', $rootScope.token);
              var url = "#spacedetail?id=" + item;
              window.location = encodeURI(url);
        }
      });

      // LoginService.login(item, tokenLogin).then(function (response) {
      //   console.log("Login result=========================================================", response);
      //   if (response.code == 0) {

      //     if (response.data.account == undefined || response.data.account.length === 0) {
      //       response.data.account = "Admin";
      //     }
        
      //     $rootScope.tokenLogin = tokenLogin;
      //     $rootScope.curentuser.username = response.data.account;
      //     $rootScope.curentuser.namespace = response.data.namespace;
      //     $rootScope.curentuser.key = response.data.key;
      //     $rootScope.curentuser.uuid = response.data.uuid;
      //     $rootScope.curentuser.token = response.data.token;
      //     $rootScope.curentuser.displayname = response.data.account;
      //     $rootScope.token = response.data.token
      //     $rootScope.account = response.data.account;
      //     $cookies.put('token', $rootScope.token);
      //     $cookies.put('tokenLogin', $rootScope.tokenLogin);
      //     $cookies.put('namespace', $rootScope.curentuser.namespace);
      //     $cookies.put('account', $rootScope.account);
      //     $cookies.put('displayname', $rootScope.curentuser.displayname);
      //     $cookies.put('key', $rootScope.curentuser.key);
      //     $cookies.put('uuid', $rootScope.curentuser.uuid);
      //     $cookies.put('displayname', $rootScope.curentuser.displayname);
      //     var url = "#spacedetail?id=" + item;
      //     window.location = encodeURI(url);
      //   }
      // });

    
    };
    
  //  bregisterpage
    if ($location.path() == "/statistic"){
        $scope.bloginpage = true;
    }


    $scope.loginpage = function(){
      $scope.bloginpage = true;
        $location.path('/statistic');
    }

    $scope.registerpage = function(){
      $scope.bloginpage = false;
        $location.path('/register');
    }

    //console.log("===========", $scope.bloginpage);

    var path = $location.path();
    var titlePage = "";

    switch (path) {

      case '/devicetype':
        titlePage = "Device type management";
        break;
      case '/user':
        titlePage = "Quản lý tài khoản";
        break;
      case '/device':
        titlePage = "Device management";
        break;
      case '/config':
        titlePage = "Quản lý cấu hình thiết bị";
        break;
        case '/application':
          titlePage = "Quản lý ứng dụng ";
          break;

    }

    $scope.titlePage = titlePage;


    $scope.logout = function() {
      //console.log("do log out..........")
      $scope.clearCookies();
      //NavigationService.logout();

      //$location.path('/device');
      window.location = "/logout";

    }
    $scope.clearCookies = function() {
      $cookies.remove('user');
      $cookies.remove('displayname');
      $cookies.remove('domain');
      $cookies.remove('email');
      $cookies.remove('type');
      $cookies.remove('deptid');
      $cookies.remove('account');
      $cookies.remove('token');
      $cookies.remove('tokenLogin');
      $cookies.remove('arrNSInfo');
      $cookies.remove('selectedNS');
      localStorage.removeItem("deviceNameEventSelected");
      $rootScope.curentuser.username = "";
      $rootScope.curentuser.displayname = "";
      $rootScope.curentuser.email = "";
      $rootScope.curentuser.type = -1;
      $rootScope.curentuser.deptId = -1;
      $rootScope.rights = [];
      $rootScope.account = "";
      $rootScope.token = "";
      $rootScope.tokenLogin = "";

    }

  }


  


})();
