(function() {
    'use strict';
    theApp.factory('CreationService', CreationService);
    CreationService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService', '$cookies'];
  
    function CreationService($rootScope, $http, $q, API_URL, GlobalService, $cookies) {
      
      //var API_URL = "http://127.0.0.1/api/v1/"
      var service = {};
      service.demo = demo;
      return service;
      function demo(){
          console.log("get in service");
      }
      

  
      
  
        
  
      
    }
  
  })();
  