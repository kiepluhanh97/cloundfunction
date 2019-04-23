var theApp = angular.module('theApp', ['ngRoute', 'ngCookies', 'ngAnimate','ui.bootstrap','angularjs-dropdown-multiselect']);

theApp.constant('API_URL', window.location.protocol + '//' + window.location.host + "/api/" +"v1" + "/"); //define CONST API_URL
//theApp.constant('API_URL', "http://61.28.226.133:8081/api/v1/"); //define CONST API_URL

theApp.constant('API_HOST', window.location.protocol + '//' + window.location.host );

theApp.constant('WS_URL', window.location.protocol == "https:" ? 'wss://' + window.location.host + '/zcloud/ntf/?token=' : 'ws://' + window.location.host + '/zcloud/ntf/?token='); //define CONST WS_URL
//theApp.constant('WS_URL', 'ws://172.17.0.1:8089/zcloud/ntf/?token='); //define CONST WS_URL


theApp.constant('LOGIN_URL',  window.location.host == "iothub-s9.vinadata.vn" ? 'https://portal.vinadata.vn' : 'https://sso-dev.vinadata.vn/cas/login?service=http%3A%2F%2F61.28.227.226%2F#/login'); //define CONST LOGIN_URL
theApp.constant('REDIRECT_TO_PORTAL_URL',  window.location.host == "iothub-s9.vinadata.vn" ? 'https://portal.vinadata.vn' : 'https://portal.vinadata.vn'); //define CONST LOGIN_URL
//theApp.constant('WS_URL', 'ws://172.17.0.1:8089/zcloud/ntf/?token='); //define CONST WS_URL


var updatettmplTime = Date.now();
theApp.constant('VER', updatettmplTime + ""); //define Ver
theApp.constant('UIVER', "v2"); //define Ver
theApp.constant('LOGIN_URL', window.location.protocol + '//' + window.location.host + '/zcloud/#/login'); //define Ver
theApp.constant('REGISTER_PAGE', window.location.protocol + '//' + window.location.host + '/zcloud/#/register'); //define Ver
theApp.constant('ADMIN_PAGE', window.location.protocol + '//' + window.location.host + '/zcloud'); //define Ver

(function() {
  'use strict';

  theApp
    .config(config).run(run);
  //config.$inject = ['$routeProvider', '$httpProvider'];
  config.$inject = ['$routeProvider', '$httpProvider', 'VER', 'UIVER'];

  function config($routeProvider, $httpProvider, VER, UIVER) {
    $routeProvider
      .when('/', {
        redirectTo: '/login'
      })
      .when('/userinfo', {
        controller: 'UserInfoController',
        templateUrl: "/static/" + UIVER + '/userinfo/userinfo.view.html?v=' + VER
      })
      .when('/login', {
        controller: 'LoginController',
        templateUrl: "/static/" + UIVER + '/login/login.view.html?v=' + VER
      })
      .when('/logout', {
        controller: 'LogoutController',
        templateUrl: "/static/" + UIVER + '/login/login.view.html?v=' + VER
      })
      .when('/space',{
        controller: 'SpaceController',
        templateUrl: "/static/" + UIVER + '/space/space.view.html?v=' + VER
      })
      .when('/spacedetail',{
        controller: 'SpaceDetailController',
        templateUrl: "/static/" + UIVER + '/space_detail/space_detail.view.html?v=' + VER
      })
      .when('/actions',{
        controller: 'ActionViewController',
        templateUrl: "/static/" + UIVER + '/actions-view/actions-view.view.html?v=' + VER
      })
      .when('/spaceaction',{
        controller: 'SpaceActionController',
        templateUrl: "/static/" + UIVER + '/space_action/space_action.view.html?v=' + VER
      })
      .when('/spacetrigger',{
        controller: 'SpaceTriggerController',
        templateUrl: "/static/" + UIVER + '/space_trigger/space_trigger.view.html?v=' + VER
      })
      .when('/spacedashboard',{
        controller: 'SpaceDashBoardController',
        templateUrl: "/static/" + UIVER + '/space_dashboard/space_dashboard.view.html?v=' + VER
      })
      .when('/createoptions',{
        templateUrl:"/static/" + UIVER + '/create_options/create_options.view.html?v=' + VER
      })
      .when('/createaction',{
        controller:'CreateActionController',
        templateUrl:"/static/" + UIVER + '/create_action/create_action.view.html?v=' + VER
      })
      .when('/createsequence',{
        controller:'CreateSequenceController',
        templateUrl:"/static/" + UIVER + '/create_sequence/create_sequence.view.html?v=' + VER
      })
      .when('/create',{
        controller: 'CreationController',
        templateUrl: "/static/" + UIVER + '/creation/creation.view.html?v=' + VER
      })
      .when('/codefunction',{
        controller:'CodeFunctionController',
        templateUrl: "/static/" + UIVER + '/code_function/code_function.view.html?v=' + VER
      })
      .when('/sidebar',{
        controller: 'SidebarController',
        templateUrl: "/static/" + UIVER + '/sidebar/sidebar.view.html?v=' + VER
      })
      .when('/trigger_detail',{
        controller: 'TriggerDetailController',
        templateUrl: "/static/" + UIVER + '/space_trigger_detail/space_trigger_detail.view.html?v=' + VER
      })
      .when('/sequence_detail',{
        controller: 'SequenceDetailController',
        templateUrl: "/static/" + UIVER + '/space_sequence_detail/space_sequence_detail.view.html?v=' + VER
      })
      .when('/documents-overview',{
        controller: 'CommonController',
        templateUrl: "/static/" + UIVER + '/documents/documents.view.html?v=' + VER
      })
      .when('/learn-api-key',{
        controller: 'CommonController',
        templateUrl: "/static/" + UIVER + '/documents/apikey.view.html?v=' + VER
      })
      .when('/learn-cli',{
        controller: 'CommonController',
        templateUrl: "/static/" + UIVER + '/documents/learn-cli.view.html?v=' + VER
      })
      .when('/pricing',{
        controller: 'CommonController',
        templateUrl: "/static/" + UIVER + '/documents/pricing.view.html?v=' + VER
      })
      .when('/overview',{
        controller: 'CommonController',
        templateUrl: "/static/" + UIVER + '/documents/overview.view.html?v=' + VER
      })
      .when('/login', {
        controller: 'LoginController',
        templateUrl: "/static/" + UIVER + '/login/login.view.html?v=' + VER
      })
      .when('/logout', {
        controller: 'LogoutController',
        templateUrl: "/static/" + UIVER + '/login/login.view.html?v=' + VER
      })
      .otherwise({
        redirectTo: '/login'
      });

  }

  run.$inject = ['$rootScope', '$templateCache', '$cacheFactory', '$cookies', '$location', '$interval'];

  function run($rootScope, $templateCache, $cacheFactory, $cookies, $location, $interval) {
    $rootScope.globals = {};
    $rootScope.curentuser = {};
    $rootScope.caches = $cacheFactory('cacheData');
    $rootScope.deviceNameEventSelected = "";
	  $rootScope.updateVariableData = {procId: null,  path: ""};
    $rootScope.user = {
      name: $rootScope.curentuser.username,
      email: $rootScope.curentuser.email
    };
    $rootScope.token = "";
    $rootScope.tokenLogin = "";
    $rootScope.account = "";

    //console.log("$rootScope.curentuser", $rootScope.curentuser);
    $templateCache.remove("sidebar/sidebar.view.html");
    $templateCache.remove("navigation/navigation.view.html");
    

    $rootScope.popupMode = {
      view: 1,
      add: 2,
      update: 3
    };

    $rootScope.appRole = {
       view: 1, add: 2, remove: 4, update: 8
    }

    //user token
    $rootScope.token = "";
    $rootScope.tokenLogin = "";
 
    $rootScope.$on('$locationChangeStart', function(event, next, current) {

      //console.log("locationChangeStart")
      //var loggedIn = ($rootScope.curentuser.username != "" && $rootScope.curentuser.type != -1);

      //var restrictedPage = $.inArray($location.path(), ['/login']) === -1;

      //if (restrictedPage && !loggedIn) {
      //    $location.path('/login');
      //}


      if (checkLogin()){

        $rootScope.tokenLogin = ($cookies.get('tokenLogin') != undefined ? $cookies.get('tokenLogin') : "");
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
        $rootScope.account = ($cookies.get('account') != undefined ? $cookies.get('account') : "-1");
        //$location.path('/device');
     }
      if ($rootScope.updateVariableData.procId != null){

        $interval.cancel($rootScope.updateVariableData.procId );
        $rootScope.updateVariableData.procId  = null;
      }


    });

     function checkLogin() {
      var param = $location.search();
      // var email = param.email;
      // var type = param.type;
      // var user = param.user;
      var  tokenLogin = $cookies.get('tokenLogin');
      var  token = $cookies.get('token');
      var  account = $cookies.get('account');
      if(tokenLogin === undefined || token === undefined || account == undefined){
        return false;
      }
      return true;
    }

    $rootScope.$on('$locationChangeSuccess', function() {
      //console.log("locationChangeSuccess===================")
      var loggedIn = ($rootScope.account != "" && $rootScope.token != "" && $rootScope.tokenLogin != "");
      var restrictedPage = $.inArray($location.path(), ['/login','/home', '/register','/docs','/pricing' ]) === -1;
      //console.log("$location.path()", $location.path());
      if($location.path() === "/logout"){
        //$location.path('/logout');
        return;
      }
      if (checkLogin()){
          //$location.path('/device');
      }
      //console.log($location.path(),restrictedPage,loggedIn);
      if (restrictedPage && !loggedIn) {
        console.log($location.path(),restrictedPage,loggedIn);
        $location.path('/login');
      }
      
    });
  }

  theApp.factory('GlobalService',GlobalService);
  GlobalService.$inject = ['$uibModal','UIVER','VER'];
   function GlobalService($uibModal,UIVER,VER) {
  
    return {
      getErrMsg: function(errCode) {
        var msg = "";
        if (errCode == -2) {
          msg = "Connect to service failure";
        } else if (errCode == -1) {
          msg = "Internal error (-1)";
        } else {
          msg = error[errCode];
          if (msg == undefined || msg == null) {
            return "";
          }
        }
        return msg;
      },
      change_alias: function(alias) {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/ /g,"_");
        //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        //  str = str.replace(/ + /g," ");
        str = str.trim();
        return str;
      },
      isContainInvalidChars:function ( x) {
        var str = x;
        var restrictedChars = ['<','>','\`','&','|','=','%','~','^','\'','/'];
        for(var i=0; i< restrictedChars.length; i++){
          if(str.indexOf(restrictedChars[i]) > -1)
            return true;
        }
        return false;
    },isInvalidTrigger:function ( x) {
      var str = x;
      var restrictedChars = [,'\`','%','~','^','\''];
      for(var i=0; i< restrictedChars.length; i++){
        if(str.indexOf(restrictedChars[i]) > -1)
          return true;
      }
      return false;
  },
 
    showAlert : function (data, size) {
      //console.log(data);
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
    },
    showConfirm : function (data, size) {
      //console.log(data);
      var modalSize = 'sm';
      if (size != undefined) {
        modalSize = size;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/static/' + UIVER + '/popups/popupconfirm.view.html?v=' + VER,
        controller: 'PopupConfirmController',
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
    }, 
    convertUNIXTimeToDateTime: function(unixtimestamp){
            
      // Unixtimestamp
      // Months array
      var str = unixtimestamp;
      str = str.toString();
      str = str.slice(0, -3);
      str = parseInt(str);
      unixtimestamp = str;
      
      var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      // Convert timestamp to milliseconds
      var date = new Date(unixtimestamp*1000);

      // Year
      var year = date.getFullYear();

      // Month
      var month = months_arr[date.getMonth()];

      // Day
      var day = date.getDate();

      // Hours
      var hours = date.getHours();

      // Minutes
      var minutes = "0" + date.getMinutes();

      // Seconds
      var seconds = "0" + date.getSeconds();

      // Display date time in MM-dd-yyyy h:m:s format
      var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      
      return  convdataTime;
    }
    
  

    };
  };

})();
