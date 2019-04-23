(function() {
    'use strict';
    theApp.controller('SpaceTriggerController', SpaceTriggerController);
    SpaceTriggerController.$inject = ['$rootScope','$scope', 'SpaceTriggerService', '$uibModal', 'VER', '$cookies', 'UIVER','GlobalService','$q','RuleService'];
  
    function SpaceTriggerController($rootScope,$scope,SpaceTriggerService, $uibModal, VER, $cookies, UIVER, GlobalService,$q,RuleService) {
        $scope.itemByPageList = [5,10,30,50];
        $scope.itemPerPage = 5;
        $scope.pageTh = 1;
        $scope.totalItem = 10;
        $scope.totalPages = Math.ceil($scope.totalItem/$scope.itemPerPage);
        $scope.listTrigger = []
        $scope.searchTextIn = {}
        var num = 0
        $scope.initData = function(){
            $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
            $scope.namespaceID = $rootScope.curentuser.namespace;
            SpaceTriggerService.getlistTrigger($scope.namespaceID).then(function(response){
                console.log("response", response)
                if(response.code == 0){

                    $scope.listTrigger = response.data
                    for(var i=0 ; i< $scope.listTrigger.length; i++){
                        $scope.listTrigger[i].updated = GlobalService.convertUNIXTimeToDateTime($scope.listTrigger[i].updated)
                        $scope.listTrigger[i].actChild = 0
                    }
                    if($scope.listTrigger.length){
                        $scope.listPkShow = new Array($scope.listTrigger.length);
                        $scope.listPkShow.fill(false, 0, $scope.listTrigger.length);
                    }
                    console.log("$scope.listTrigger", $scope.listTrigger)
                    RuleService.getListRules($scope.namespaceID).then(function(resp){
                        console.log("resp", resp)
                        if(resp.code == 0){
                            $scope.listRule = resp.data
                            console.log("$scope.listRule", $scope.listRule)
                            for(var i=0;i<$scope.listTrigger.length;i++){
                                for(var j=0;j<$scope.listRule.length;j++){
                                    if($scope.listRule[j].trigger.name === $scope.listTrigger[i].name){
                                        $scope.listTrigger[i].actChild ++;
                                    }
                                }
                            }
                            console.log("$scope.listTrigger", $scope.listTrigger)
                        }else{
                            showToast("Get trigger info failed! Error:" + resp.data.error)
                        }
                    });
                }else{
                    showToast("Get list Triggers failed! Error:" + response.data.error)
                }
            });

        }
  
        $scope.manageTrigger = function(item){
            console.log("item",item)
            window.location = encodeURI("/#/trigger_detail?name=" + item.name );
        };

        $scope.createTrigger = function(){
            var data={"namespaceID": $scope.namespaceID,"listTrigger":$scope.listTrigger}
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'AddTriggerPage.html',
                controller: 'AddTriggerController',
                size: 'md',
                resolve: {
                    param: function () {
                        return data;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                console.log("ret", result)
                if(result.code == 0){
                    result.data.updated = GlobalService.convertUNIXTimeToDateTime(""+ new Date().getTime())
                    $scope.listTrigger.unshift(result.data)
                }
            })
        };

        $scope.removeTrigger = function(item){
            $scope.confirm({
                title:"Remove trigger",
                title2:item.name,
                content:"Do you want to remove trigger from the list?",
                footer1:"Delete"
            },"md").then(function(data){
                if(data){
                    //call api here
                    SpaceTriggerService.deleteTrigger(item).then(function(response){
                        console.log("response", response)
                        //after remove from the list, not reload
                        if(response.code == 0){
                            for(var i=0;i<$scope.listTrigger.length;i++){
                                if($scope.listTrigger[i].name == item.name){
                                    $scope.listTrigger.splice($scope.listTrigger.indexOf(item),1);
                                    return;
                                }
                            }
                        }else{
                            showToast("Delete trigger failed! Error:", response.data.error)
                        }
                    });
                }
            })
        };

        $scope.changeSearch = function(){
            $scope.searchTextIn.name = $scope.searchtext.data.name;
        };

        $scope.openmenu = true;

        $scope.resizeMenu = function(){
            // console.log($scope.openmenu);
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
        $scope.confirm = function (data, size) {
            //console.log(data);
            var modalSize = 'sm';
            if (size != undefined) {
              modalSize = size;
            }
      
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: '/static/' + UIVER + '/popups/popupconfirm.view.html?v=' + VER,
              controller: 'PopupConfirmController',
              //size: 'lg',
              size: modalSize,
              backdrop: 'static',
              keyboard: false,
              resolve: {
                param: function () {
                  return data;
                }
              }
            });
            return modalInstance.result.then(function (data) {
              modalInstance.close(data);
              return data.result;
            });
          }
    }

    theApp.controller('AddTriggerController', AddTriggerController);
    AddTriggerController.$inject = ['$scope', '$uibModalInstance', 'param','SpaceTriggerService'];
  
    function AddTriggerController($scope, $uibModalInstance, param, SpaceTriggerService) {
  
      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
      $scope.bInvalidName = false;
      var listTrigger = param.listTrigger
      $scope.checkValidTriggerName = function(){
        for(var i=0 ; i<listTrigger.length;i++){
            if(listTrigger[i].name === $scope.trigger_name){
                $scope.bInvalidName = true;
                break;
            }else{
                $scope.bInvalidName = false;
            }
        }
      };
      
      $scope.save = function () {
        var item={"namespace":param.namespaceID, "name": $scope.trigger_name,"data":{}}
        SpaceTriggerService.createTrigger(item).then(function(resp){
            if(resp.code == 0){
                $uibModalInstance.close(resp);
            }else{
                showToast("Create trigger failed! Error:" + resp.data.error)
            }
        });
      }
    };
    
  })();
  
