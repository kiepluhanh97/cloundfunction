(function() {
  'use strict';
  theApp.factory('SpaceService', SpaceService);
  SpaceService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService', '$cookies'];

  function SpaceService($rootScope, $http, $q, API_URL, GlobalService, $cookies) {
    
    //var API_URL = "http://127.0.0.1/api/v1/"
    var service = {};
    service.getSpace = getSpace;
    service.getSpaceDetail = getSpaceDetail;
    service.updateSpace = updateSpace;
    service.deleteSpace = deleteSpace;
    service.getErrMsg = getErrMsg;
    service.addNewSpace = addNewSpace;
    return service;

    function addNewSpace(data){
      var key = "namespaces";
      var url = API_URL + key;
      // $rootScope.token = ($cookies.get('token') != undefined? $cookies.get('token'):"");
      // console.log(url,data);
      return $http({
        method:'POST',
        headers:{
          'Authorization': $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        url:url,
        data:data
      }).then(handleSuccess,handleError("Error add new space"))
    }
    
    function getSpaceDetail(id){
      var key1 = "namespaces"
      var url = API_URL + key1 + "/"+ id ;  
   
      $rootScope.tokenlocal = ($cookies.get('tokenlocal') != undefined ? $cookies.get('tokenlocal') : "");
     
      return $http.get(url, {
        headers: {
          'Authorization': $rootScope.tokenlocal,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(handleSuccess, handleError('Error get list Space'));
  }

    function getSpace(){
        var key1 = "namespaces"
        var url = API_URL + key1  ;  
     
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
       
        return $http.get(url, {
          headers: {
            'Authorization': $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error get list Space'));
    }

    function deleteSpace(spaceid) {
      var key1 = "namespaces"
     
      var url = API_URL + key1 + "/" + spaceid;
     
      return $http({
        method: 'DELETE',
        headers: {
          'Authorization': $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        url: url,
      }).then(handleSuccess, handleError('Error deleteVariable'));
    }


    function updateSpace(id,data) {
      var key1 = "namespaces";
      var key2 = id;
      var url = API_URL + key1 + "/" +key2;  
      // console.log(data);
 
      return $http({
        method: 'PATCH',
        headers: {
          'Authorization': $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        url: url,
        data: data
      }).then(handleSuccess, handleError('Error updateSpace'));
    }

    function getErrMsg(data) {
      var msg = GlobalService.getErrMsg(data.error);
      msg += parserMsgErr(data);
      return msg;
    }

    function parserMsgErr() {

      var result = "";
   
      if (result.length > 0) {
        result = ": " + result;
      }
      return result;
    }

    function handleSuccess(res, url) {
      if (url == undefined) {
        return res.data;
      }


      if (angular.isUndefined($rootScope.caches.get(url))) {
        $rootScope.caches.put(url, res);
      }
      var cache = $rootScope.caches.get(url);
    
      return $q.when(cache.data);
    }

    function handleError(error) {
      return function() {
        return {
          err: -2,
          msg: error
        };
      };
    }
  }

})();
