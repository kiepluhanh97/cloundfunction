(function() {
    'use strict';
    theApp.controller('SpaceDetailController', SpaceDetailController);
    SpaceDetailController.$inject = ['$scope','SpaceService', '$uibModal', '$location', 'VER', '$cookies', 'UIVER','GlobalService','SpaceDetailService','$rootScope'];
  
    function SpaceDetailController($scope,SpaceService, $uibModal, $location, VER, $cookies, UIVER,  GlobalService, SpaceDetailService, $rootScope) {
        
        $scope.listRuntime = [{"name":"Node.js 10","f":"nodejs:10"},
        {"name":"Node.js 8","f":"nodejs:8"},
        {"name":"Python 3","f":"python:3"},
        {"name":"Swift 4.2","f":"swift:4.2"},
        {"name":"Ruby 2.5","f":"ruby:2.5"},
        {"name":"PHP 7","f":"php:7.3"},
        {"name":"Go 1.11","f":"go:1.11"}];
        $rootScope.listRuntime = $scope.listRuntime
        localStorage.setItem("listRuntime", JSON.stringify($scope.listRuntime));    

        $scope.initData = function(){
            // console.log("controler details")
            var uuid = $location.search()['id'];
            $rootScope.curentuser.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
            $rootScope.posLeftMenuRoot = 0
            console.log("uuid", uuid)
            if(uuid == undefined){
                $rootScope.selectedNS = $cookies.get('namespace') != undefined ? $cookies.get('namespace') : ""
                uuid = $rootScope.selectedNS
            }
            $scope.getNamespaceById(uuid);
        }

        $scope.getNamespaceById = function(namespace){
            return SpaceService.getSpaceDetail(namespace).then(function(resp){
                if(resp.code == 0){
                    $scope.thisNamespace = resp.data;
                    $scope.thisNamespace.status = "Active";
                    if($scope.thisNamespace){
                        if($scope.thisNamespace.blocked){
                            $scope.thisNamespace.status = "Blocked";
                        }
                    }
                    $scope.spaceName = resp.data.id
                    $scope.thisNamespace.token = $rootScope.curentuser.token
                }
                else{
                    showToast(resp.msg);
                }
            })
        }
        $scope.openmenu = true;

        $scope.resizeMenu = function(){
            console.log($scope.openmenu);
            if($scope.openmenu){//thu nho
                
                var menu = document.getElementById('menucontainer');
                var content = document.getElementById('contentcontainer');
                var lastchild = document.getElementById('lastchild');
                menu.style.width = '0';
                content.style.width = "99%";
                
                lastchild.innerHTML = '<i class="fas fa-angle-double-right"></i>';
                // lastchild.style.color = 'black';
            }
            else{
                var menu = document.getElementById('menucontainer');
                var content = document.getElementById('contentcontainer');
                var lastchild = document.getElementById('lastchild');
                menu.style.width = '20%';
                content.style.width = "80%";
                lastchild.innerHTML = '<i class="fas fa-angle-double-left"></i>';
                // lastchild.style.color = 'white';

            }
            $scope.openmenu =  !$scope.openmenu;
        }

        


        $scope.initData();
    }
    
  })();
  
