(function () {
    'use strict';
    theApp.factory('CodeFunctionService', CodeFunctionService);
    CodeFunctionService.$inject = ['$rootScope', '$http', '$q', 'API_URL', '$cookies'];
  
    function CodeFunctionService($rootScope, $http, $q, API_URL, $cookies) {
      var service = {};
      service.addAction = addAction
      service.getActionDetails = getActionDetails
      service.invokeAction = invokeAction;
      service.getActivation = getActivation;
      return service;


      function getActivation(item){
          var url = API_URL + 'namespaces/'  + item.namespace + "/" + 'activations/' + item.activationID;
          console.log(url);
          $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
          return $http.get(url,{
              headers: {
                'Content-Type':'application/json',
                'Authorization': "Basic " +  $rootScope.token,
                'Accept': 'application/json'
              }
            }).then(handleSuccess, handleError('Error get list actions'));
      }
      function getActionDetails(item) {
        var key1 = "namespaces"
        var key2 = "actions"
        var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.name;
  
        $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
        return $http.get(url, {
          headers: {
            'Authorization': "Basic " + $rootScope.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(handleSuccess, handleError('Error get list actions'));
      }


      function invokeAction(item) {
        var url = ""
        console.log("item invoke service", item.data)
        if (item.package_name != undefined && item.package_name != "")
          url = API_URL + "namespaces/" + item.namespace +"/" + "actions/" + item.package_name + "/" + item.name + "?blocking=false&result=false"
        else
          url = API_URL +  "namespaces/" + item.namespace +"/" + "actions/"  + item.name + "?blocking=false&result=false"

        console.log(url);
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
        }).then(handleSuccess, handleError('Error invoke action'));
      }
  
      function addAction(item) {
        console.log("item",item)
        var key1 = "namespaces"
        var key2 = "actions"
        var key3 = "?overwrite=true"
        var url = API_URL + key1 + "/" + item.namespace + "/" + key2 + "/" + item.name + key3;
  
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
  
