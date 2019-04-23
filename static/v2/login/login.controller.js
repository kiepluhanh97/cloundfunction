(function () {
  'use strict';

  theApp.controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$rootScope', 'LoginService', '$uibModal', '$location', '$cookies', 'VER', 'UIVER', 'REGISTER_PAGE', 'LOGIN_URL', 'REDIRECT_TO_PORTAL_URL'];
  function LoginController($scope, $rootScope, LoginService, $uibModal, $location, $cookies, VER, UIVER, REGISTER_PAGE, LOGIN_URL, REDIRECT_TO_PORTAL_URL) {
    console.log("LoginController==========================================================================")
    //$scope.updatettmplTime = Date.now(); // update template trong ng-include
    $scope.ver = VER;
    $scope.uiver = UIVER;

    $scope.username = "";
    $scope.userLogin = { account: "", password: "" };
    $scope.lstNSName = []

    $scope.clearCookies = function () {
      $cookies.remove('user');
      $cookies.remove('email');
      $cookies.remove('type');
      $cookies.remove('token');
      $cookies.remove('tokenLogin');
      $cookies.remove('account');
      $cookies.remove('arrNSInfo')
      $rootScope.curentuser.username = "";
      $rootScope.curentuser.displayname = "";
      $rootScope.curentuser.email = "";
      $rootScope.curentuser.type = "";
    }

    $scope.clearCookies();

    $scope.alert = function (data, size) {
      //console.log(data);
      //var data = {title: "Thêm yêu cầu phòng họp", content: "Thêm yêu cầu phòng họp không thành công \n" + data.msg}
      var modalSize = 'sm';
      if (size != undefined) {
        modalSize = size;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/static/' + UIVER + '/popups/popupalert.view.html?v=' + VER,
        controller: 'PopupAlertController',
        //size: 'lg',
        size: modalSize,
        backdrop: 'static',
        keyboard: false,
        resolve: {
          param: function () {
            return data;
          }
        }
      });
      return modalInstance.result.then(function (data) {
        modalInstance.close(data);
        return data.result;
      });
    }

    $scope.getTokenPortal = function () {
      console.log("$scope.getTokenPortal...");
      LoginService.getTokenPortal().then(function (response) {
        console.log("Login :getTokenPortal:", response);

        if (response.code == 0) {
          $rootScope.token = response.data.token
          $rootScope.tokenLogin = $rootScope.token
          $cookies.put('token', $rootScope.token);
          $rootScope.curentuser.username = response.data.account;
          $rootScope.curentuser.namespace = response.data.namespace;
          $rootScope.curentuser.displayname = response.data.account;
          $rootScope.curentuser.tokenlocal = response.data.tokenlocal;
          $rootScope.tokenlocal = response.data.tokenlocal
          $rootScope.token = response.data.token
          $rootScope.account = response.data.account;
          $cookies.put('token', $rootScope.token);
          $cookies.put('tokenlocal', $rootScope.tokenlocal);
          $cookies.put('namespace', $rootScope.curentuser.namespace);
          $cookies.put('tokenLogin', $rootScope.tokenLogin);
          $cookies.put('account', $rootScope.account);
          $cookies.put('displayname', $rootScope.curentuser.displayname);
             
          for(var i=0;i<response.data.nslist.length;i++){
            $scope.lstNSName.push(response.data.nslist[i].namespace)
          }
          $cookies.put('arrNSInfo',JSON.stringify($scope.lstNSName));
          localStorage.clear();
          console.log("$scope.lstNSName", $scope.lstNSName)
          var directlyPath = "spacedetail?id=" + $rootScope.curentuser.namespace;
          $location.path(directlyPath);
          window.location = "/#/" + directlyPath;
         
        }
        else if (response.code == 125) {
          $scope.alert({
            title: "Error",
            content: "" + "User do not have any space. Please add a space first."
          }).then(function () {
            window.location = encodeURI(REDIRECT_TO_PORTAL_URL);
          });
        }
        else if (response.code == 101) {
          $scope.alert({
            title: "Error",
            content: "" + "User do not login"
          }).then(function () {
            window.location = encodeURI(LOGIN_URL);
          });

        }
      });
    }
    //$scope.getTokenPortal();

    $scope.login = function () {
      console.log("log in function...........")

      var namespaceid = $location.search()['namespaceid']
      var tokenLogin = $location.search()['token']
      if (tokenLogin === undefined) {
        return;
      }
      if (tokenLogin.length == 0 || namespaceid == 0) {
        //console.log("Invalid params")
        return;
      }

      LoginService.login(namespaceid, tokenLogin).then(function (response) {
        console.log("Login result=========================================================", response);
        if (response.code == 0) {

          if (response.data.account == undefined || response.data.account.length === 0) {
            response.data.account = "Admin";
          }
        
            $rootScope.tokenLogin = tokenLogin;
            $rootScope.curentuser.username = response.data.account;
            $rootScope.curentuser.namespace = response.data.namespace;
            $rootScope.curentuser.key = response.data.key;
            $rootScope.curentuser.uuid = response.data.uuid;
            $rootScope.curentuser.token = response.data.token;
            $rootScope.curentuser.tokenlocal = response.data.tokenlocal;
            $rootScope.curentuser.displayname = response.data.account;
            $rootScope.token = response.data.token
            $rootScope.tokenlocal = response.data.tokenlocal
            $rootScope.account = response.data.account;
            $cookies.put('token', $rootScope.token);
            $cookies.put('tokenlocal', $rootScope.tokenlocal);
            $cookies.put('tokenLogin', $rootScope.tokenLogin);
            $cookies.put('namespace', $rootScope.curentuser.namespace);
            $cookies.put('account', $rootScope.account);
            $cookies.put('displayname', $rootScope.curentuser.displayname);
            $cookies.put('key', $rootScope.curentuser.key);
            $cookies.put('uuid', $rootScope.curentuser.uuid);
            $cookies.put('displayname', $rootScope.curentuser.displayname);

            LoginService.getListNameSpace().then(function (resp) {
              console.log(resp);
              if(resp.code === 0){
                for(var i=0;i<resp.data.length;i++){
                  $scope.lstNSName.push(resp.data[i].namespace)
                }
                $cookies.put('arrNSInfo',JSON.stringify($scope.lstNSName));
                localStorage.clear();
                console.log("$scope.lstNSName", $scope.lstNSName)
                var directlyPath = "spacedetail?id=" + $rootScope.curentuser.namespace;
                $location.path(directlyPath);
                window.location = "/#/" + directlyPath;
              }
            });
        }
      });
    }

    $scope.doLogin = function () {
      console.log("doLogin");
      var namespaceid = $location.search()['namespaceid']
      var tokenLogin = $location.search()['token']
      if (tokenLogin === undefined || namespaceid === undefined || tokenLogin.length == 0 || namespaceid.length == 0) {
        console.log("getTokenPortal");
        //console.log("No param hub id and token id ==> do log in SSO")
        $scope.getTokenPortal();
        return;
      } else {
        console.log("$scope.login();");
        //console.log("Has param hub id and token id ==> do access site")
        $scope.login();
      }
    }

    $scope.doLogin();
    $scope.register = function () {
      window.location.href = REGISTER_PAGE;
    }

    $scope.homepage = function () {
      $location.path('/');
    }

    $scope.confirm = function (data) {
      var date = Date.now();
      //var data = {title: "Thêm yêu cầu phòng họp", content: "Thêm yêu cầu phòng họp không thành công \n" + data.msg}
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "/static/" + UIVER + '/popups/popupconfirm.view.html?updated=' + date,
        controller: 'PopupConfirmController',
        size: 'lg',
        resolve: {
          param: function () {
            return data;
          }
        }
      });

      return modalInstance.result.then(function (data) {
        modalInstance.close(data);
        return data.result;
      });
    }

    $scope.alert = function (data, size) {
      //console.log("aaaaaaaaaaa");
      //console.log(data);
      //var data = {title: "Thêm yêu cầu phòng họp", content: "Thêm yêu cầu phòng họp không thành công \n" + data.msg}
      var modalSize = 'sm';
      if (size != undefined) {
        modalSize = size;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "/static/" + UIVER + '/popups/popupalert.view.html?v=' + VER,
        controller: 'PopupAlertController',
        //size: 'lg',
        size: modalSize,
        resolve: {
          param: function () {
            return data;
          }
        }
      });
      return modalInstance.result.then(function (data) {
        modalInstance.close(data);
        return data.result;
      });
    }
  }
  theApp.controller('LogoutController', LogoutController);
  LogoutController.$inject = [];
  function LogoutController() {
    //console.log("LogoutController", LogoutController);

    window.location = encodeURI("/logout");
  }

})();
