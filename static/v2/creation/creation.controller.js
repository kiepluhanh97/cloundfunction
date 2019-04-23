(function() {
    'use strict';
    theApp.controller('CreationController', CreationController);
    CreationController.$inject = ['$scope','SpaceService', '$uibModal', '$location', 'VER', '$cookies', 'UIVER','GlobalService','SpaceDetailService'];
  
    function CreationController($scope,SpaceService, $uibModal, $location, VER, $cookies, UIVER,  GlobalService, SpaceDetailService) {
        
        $scope.showList =[true,false,false,false,false,false];
        $scope.showPos = 0;
        $scope.spaceName = ""

        $scope.showCate = function(item){
            if($scope.showList){
                $scope.showList[$scope.showPos] = false;
                $scope.showPos = item;
                $scope.showList[$scope.showPos] = true;
            }
        }
        
        $scope.initData = function(){
            // console.log("controler details")
            var uuid = $location.search()['id'];
            console.log(uuid);
            $scope.getNamespaceById(uuid);
        }

        $scope.getNamespaceById = function(namespace){
            return SpaceService.getSpaceDetail(namespace).then(function(resp){
                console.log("resp", resp)
                if(resp.code == 0){
                    $scope.thisNamespace = resp.data;
                    if($scope.thisNamespace){
                        if($scope.thisNamespace.blocked){
                            $scope.thisNamespace.status = "Active";
                        }
                    }
                    console.log($scope.thisNamespace);
                    $scope.spaceName = resp.data.id
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
  
