(function () {
    'use strict';
    theApp.factory('NavigationService', NavigationService);
    NavigationService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService'];
    function NavigationService($rootScope, $http, $q, API_URL, GlobalService) {
        var today = new Date();
        var d = today.getDate();
        var m = today.getMonth();
        var y = today.getFullYear();
        var url = API_URL + "login";

        var service = {};


        service.logout = logout;
        service.getErrMsg = getErrMsg;

        return service;



        function logout() {
					var key = "login"
					var url = API_URL +  key ;
						//return $q.when({err: 0, msg: ""});
						return $http.delete(url).then(handleSuccess, handleError('Error logout'));
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
