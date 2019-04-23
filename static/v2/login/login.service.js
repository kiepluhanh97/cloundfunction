(function () {
    'use strict';
    theApp.factory('LoginService', LoginService);
    LoginService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService','$cookies'];
    function LoginService($rootScope, $http, $q, API_URL, GlobalService, $cookies) {
        var today = new Date();
        var d = today.getDate();
        var m = today.getMonth();
        var y = today.getFullYear();
        var url = API_URL + "login";

        var service = {};

        service.login = login;
        
        service.logout = logout;
        service.addNewUser = addNewUser;
        service.getErrMsg = getErrMsg;
        service.getToken = getToken;
        service.getTokenPortal = getTokenPortal;    
        service.getListNameSpace = getListNameSpace

        return service;
        
       function getListNameSpace(){

            //console.log("API_URL", API_URL);
            var key = "/cas/namespaces"
            var url = API_URL + key 
            console.log("url", url)
            $rootScope.tokenLogin = ($cookies.get('tokenLogin') != undefined ? $cookies.get('tokenLogin') : "");
            console.log("tokenLogin", $rootScope.tokenLogin)
            return $http.get(url, {
            headers: {
                'Authorization': $rootScope.tokenLogin,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            }).then(handleSuccess, handleError('Error get list namespace'));
    
        
       } ;

       function getTokenPortal(){
        //url:61.28.226.133:8088/api/v1/tokens/vndt/request
        //console.log("API_URL", API_URL);
        var key = "tokens/vndt/request"
        var url = API_URL + key
        //var url = "http://61.28.226.133:8088/api/v1/" + key;
        //console.log("url", url)
        
        return $http.get(url, {      
        }).then(handleSuccess, handleError('Error get Token Portal'));
       }

        function getToken(hubID){
        
            //console.log("API_URL", API_URL);
            var key = "login?"
            var url = API_URL + key + "hubid=" + hubID;
            //console.log("url", url)
            $rootScope.tokenLogin = ($cookies.get('tokenLogin') != undefined ? $cookies.get('tokenLogin') : "");
            //console.log("tokenLogin", $rootScope.tokenLogin)
            return $http.get(url, {
            headers: {
                'Authorization': $rootScope.tokenLogin,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            }).then(handleSuccess, handleError('Error get token'));
    
        
        }

        function login(namespaceid, tokenLogin){
        
            //console.log("API_URL", API_URL);
            var key = "login?"
            var url = API_URL + key + "namespaceid=" + namespaceid ;
            //console.log("url", url)
            //console.log("token login user input:", tokenLogin)
            return $http.get(url, {
            headers: {
                'Authorization': tokenLogin,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            }).then(handleSuccess, handleError('Error do login'));
    
        
        }
      
        function  addNewUser (data){
              var key = "user"
              var cmd = "adduser";
              var url = API_URL +  key + "/" +  cmd;
                //return $q.when({err: 0, msg: ""});
                return $http.post(url,data).then(handleSuccess, handleError('Error add  user'));
            }

        function logout() {
            var cm = "logout";
            var url = API_URL + "login?cm=" + cm;
            return $http.get(url).then(function (res) {
                return handleSuccess(res, url)
            }, handleError('Error logout'));
        }

        function  getErrMsg(data) {
            var msg = GlobalService.getErrMsg(data.err);
            msg += parserMsgErr(data);
            return msg;
        }

        function parserMsgErr(data) {

            var result = "";

            if (data.err == -1) {
                result = "Vui lòng kiểm tra lại tên đăng nhập và mật khẩu";
            }

            if (result.length > 0) {
                result = ": " + result;
            }
            return result;
        }



        function handleSuccess(res, url) {
            //console.log("response", res);
            return res.data;
        }
        /*
         function handleSuccess(res) {
         return res.data;
         }
         */
        function handleError(error) {
            return function () {
                return {err: -2, msg: error};
            };
        }
    }

})();
