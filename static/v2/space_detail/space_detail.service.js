(function() {
    'use strict';
    theApp.factory('SpaceDetailService', SpaceDetailService);
    SpaceDetailService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService', '$cookies'];
  
    function SpaceDetailService($rootScope, $http, $q, API_URL, GlobalService, $cookies) {
      
      //var API_URL = "http://127.0.0.1/api/v1/"
      var service = {};
      service.demo = demo;
      return service;
      function demo(){
          console.log("get in service");
      }
      

  
      
  
        
  
      
    }
  
  })();
  