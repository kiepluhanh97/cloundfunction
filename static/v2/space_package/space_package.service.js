(function() {
  'use strict';
  theApp.factory('SpacePackageService', SpacePackageService);
  SpacePackageService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService', '$cookies'];

  function SpacePackageService($rootScope, $http, $q, API_URL, GlobalService, $cookies) {
    
    //var API_URL = "http://127.0.0.1/api/v1/"
    var service = {};
    service.getPackageList = getPackageList;
    service.addPackage = addPackage
    service.deletePackage = deletePackage;
 
    return service;
    
    function deletePackage(item){
      var key1 = "namespaces"
      var key2 = "packages"
      var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.package_name + "?force=true";
      
      $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");

      return $http({
        method: 'DELETE',
        url:url,
        data: {},
        headers: {
          'Authorization': "Basic " + $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(handleSuccess, handleError('Error delete package'));
    };

    function addPackage(item){
      console.log("item",item)
      var key1 = "namespaces"
      var key2 = "packages"
      var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.package_name ;

      $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");

      return $http({
        method: 'PUT',
        url:url,
        data: {},
        headers: {
          'Authorization': "Basic " + $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(handleSuccess, handleError('Error add package'));
    };

    function getPackageList(namespace){
      var key1 = "namespaces"
      var key2 = "packages"
      var url = API_URL + key1 + "/" + namespace + "/" + key2;

      $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
      return $http.get(url, {
        headers: {
          'Authorization': "Basic " + $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(handleSuccess, handleError('Error get list packages'));
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
