(function () {
    'use strict';
    theApp.factory('RuleService', RuleService);
    RuleService.$inject = ['$rootScope', '$http', '$q', 'API_URL', '$cookies'];
  
    function RuleService($rootScope, $http, $q, API_URL, $cookies) {
      var service = {};
      service.getListRules = getListRules;
      service.updateRuleStatus = updateRuleStatus
      service.addRule = addRule;
      return service;

      function addRule(item){
        var key1 = "namespaces"
        var key2 = "rules"
        var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.name ;
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
        }).then(handleSuccess, handleError('Error delete actions'));
      };

      function updateRuleStatus(item){
        var url = API_URL +  "namespaces/" + item.namespace +"/" + "rules/"  + item.name + "?overwrite=true"
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
        return $http({
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': "Basic " + $rootScope.token,
                'Accept': 'application/json'
            },
            url:url,
            data:item.data
        }).then(handleSuccess, handleError('Error update status rule'));
      };

      function getListRules(namespace){
        var key1 = "namespaces"
        var key2 = "rules"
        var url = API_URL + key1 + "/" + namespace + "/" + key2 + "?limit=0"  ;  
     
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
        return $http.get(url, {
          headers: {
            'Authorization': "Basic " + $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error get list rules'));
      };
      
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
  