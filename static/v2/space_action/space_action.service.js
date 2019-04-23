(function () {
  'use strict';
  theApp.factory('SpaceActionService', SpaceActionService);
  SpaceActionService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService', '$cookies'];

  function SpaceActionService($rootScope, $http, $q, API_URL, GlobalService, $cookies) {
    var service = {};
    service.getlistaction = getlistaction;
    service.deleteAction = deleteAction;
    return service;
    function deleteAction(item) {
      var key1 = "namespaces"
      var key2 = "actions"
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
      }).then(handleSuccess, handleError('Error delete actions'));
    };

    function getlistaction(namespace) {
      var key1 = "namespaces"
      var key2 = "actions"
      var url = API_URL + key1 + "/" + namespace + "/" + key2 + "?limit=0";

      $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
      return $http.get(url, {
        headers: {
          'Authorization': "Basic " + $rootScope.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(handleSuccess, handleError('Error get list actions'));
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
