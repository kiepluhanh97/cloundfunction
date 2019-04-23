(function () {
    'use strict';
    theApp.factory('SequenceDetailService', SequenceDetailService);
    SequenceDetailService.$inject = ['$rootScope', '$http', '$q', 'API_URL', '$cookies'];
  
    function SequenceDetailService($rootScope, $http, $q, API_URL, $cookies) {
      var service = {};
    
      return service;

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
  