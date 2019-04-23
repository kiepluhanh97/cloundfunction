(function () {
    'use strict';
    theApp.factory('SpaceTriggerService', SpaceTriggerService);
    SpaceTriggerService.$inject = ['$rootScope', '$http', '$q', 'API_URL', '$cookies'];
  
    function SpaceTriggerService($rootScope, $http, $q, API_URL, $cookies) {
      var service = {};
      service.getlistTrigger = getlistTrigger;
      service.deleteTrigger = deleteTrigger;
      service.createTrigger = createTrigger;
      service.getDetailTrigger = getDetailTrigger;

      return service;

      function getDetailTrigger(item){
        var key1 = "namespaces"
        var key2 = "triggers"
        var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.name;
  
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
        return $http.get(url, {
          headers: {
            'Authorization': "Basic " + $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error get list Triggers'));
      };

      function createTrigger(item){
        console.log("item",item)
        var key1 = "namespaces"
        var key2 = "triggers"
        var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.name + "?overwrite=true" ;
  
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
  
        return $http({
          method: 'PUT',
          url:url,
          data: item.data,
          headers: {
            'Authorization': "Basic " + $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error create triggers'));
      };
       
      function deleteTrigger(item) {
        var key1 = "namespaces"
        var key2 = "triggers"
        var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.name;
  
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
  
        return $http({
          method: 'DELETE',
          url,
          headers: {
            'Authorization': "Basic " + $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error delete Triggers'));
      };
  
      function getlistTrigger(namespace) {
        var key1 = "namespaces"
        var key2 = "triggers"
        var url = API_URL + key1 + "/" + namespace + "/" + key2 + "?limit=0";
  
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
        return $http.get(url, {
          headers: {
            'Authorization': "Basic " + $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error get list Triggers'));
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
        return function () {
          return {
            err: -2,
            msg: error
          };
        };
      }
    }
  
  })();
  