(function() {
    'use strict';
    theApp.controller('CreateSequenceController', CreateSequenceController);
    CreateSequenceController.$inject = ['$scope','SpacePackageService','RuleService','$rootScope','$cookies','SpaceActionService','$uibModal', 'GlobalService', 'UIVER','VER','CodeFunctionService'];
  
    function CreateSequenceController($scope, SpacePackageService,RuleService, $rootScope,$cookies, SpaceActionService,$uibModal, GlobalService, UIVER, VER, CodeFunctionService) {
        $scope.packageselected = DEFAULT_PACKAGE;
        $scope.listPackageName = [$scope.packageselected];
        $scope.showBtnCreate = true;
        $scope.existsName = false;
        $scope.invalidName = false;
        $scope.listAction = []
        $scope.uiver = UIVER;
        $scope.ver = VER;
        $scope.thisAction = {}
        $scope.sequenceName = "";
        $scope.selectedAction = "";
        console.log("selectedAction", $scope.selectedAction)
        $scope.namespaceID =  $rootScope.curentuser.token = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
        $scope.thisAction.namespace = $scope.namespaceID
        $scope.initData = function(){  
            //get package list
            console.log("get getPackageList ")
            SpacePackageService.getPackageList($scope.namespaceID).then(function(response){
                console.log("PackageList", response)
                if(response.code === 0){
                    var data = response.data
                    for(var i = 0;i<data.length;i++){
                        $scope.listPackageName.push(data[i].name)
                    }
                    
                }

            });
            console.log("get listAction")
            SpaceActionService.getlistaction($scope.namespaceID).then(function (resp) {
                console.log("listAction", resp)
                if (resp.code === 0) {
                    $scope.listAction = resp.data;
                    
                    $scope.listAction.sort(function(a, b){
                        // ASC  -> a.length - b.length
                        // DESC -> b.length - a.length
                        return a.namespace.length - b.namespace.length;
                    });
                    for(var i=0; i< $scope.listAction.length; i ++){
                        var itemAct = $scope.listAction[i]
                        var fullname = ""
                        if(itemAct.namespace.indexOf( $scope.namespaceID + "/") != -1){//contain namespace + package name, such as: abcde02/package_name
                            fullname = itemAct.namespace.substring($scope.namespaceID.length + 1) + "/" + itemAct.name //add '-' for rule name format : <package_name>-<actions_name>_<trigger_name>
                        }else{
                            fullname =  DEFAULT_PACKAGE + "/" + itemAct.name
                        }
                        $scope.listAction[i].fullname = fullname
                    }
                } else {
                    console.log("error:", resp.code)
                }

            })
        };
        $scope.checkValidActName = function(){
           
            if( GlobalService.isContainInvalidChars($scope.sequenceName)){
                $scope.invalidName = true
                return
            }else{
                $scope.invalidName = false
            }
            var newName = ""
            if($scope.packageselected === DEFAULT_PACKAGE){
                newName = $scope.namespaceID  + "/" + $scope.sequenceName
            }else{
                newName =  $scope.namespaceID + "/" + $scope.packageselected + "/" +  $scope.sequenceName
            }
            for(var i=0 ; i < $scope.listAction.length; i++){
                var item = $scope.listAction[i]
                var tempName = item.namespace + "/" + item.name
                if(newName === tempName)
                {
                    $scope.existsName = true;
                    $scope.showBtnCreate = false;
                    break;
                }else{
                    $scope.showBtnCreate = true;
                    $scope.existsName = false;
                }
            }
        }
        $scope.initData();
        $scope.changeRuntime = function(runtimeSelected){
            console.log(runtimeSelected)
            if(runtimeSelected != null){
                $scope.runtimeselected.f = runtimeSelected.f
            }
        };

        $scope.changePackage = function(packageselected){
            $scope.checkValidActName();
        };

        $scope.createPackage = function(){
            var data={listPackage:$scope.listPackageName,namespaceID:$scope.namespaceID}
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'AddPPackageController.html',
              controller: 'AddPPackageController',
              size: 'md',
              resolve:{
                  param:function(){
                      return data
                  }
              }
              
            });
      
            modalInstance.result.then(function (result) {
              console.log("ret", result)
              if(result.code == 0){
                $scope.listPackageName.push(result.data.name)
                $scope.packageselected = result.data.name
                $scope.changePackage(result.data.name)
              }else{
                    showToast("Create package failed: " + result.data.error)
              }
            })
        }

        $scope.cancelCreateAction = function(){
            window.location = encodeURI('#spaceaction');
        }
        $scope.prvCreateAction = function(){
            window.location = encodeURI('#spaceaction');
        }
      
        $scope.createAction = function(){
           console.log("selectedAction", $scope.selectedAction)
           console.log("packageselected", $scope.packageselected)
           console.log("sequenceName", $scope.sequenceName)
           $scope.thisAction.name = $scope.sequenceName
           var actionAttached = $scope.selectedAction.namespace + "/" + $scope.selectedAction.name
           $scope.thisAction.data = {"exec":{"kind":"sequence","components":[actionAttached]},"limits":{"timeout":null}}
           //data:  {"exec":{"kind":"sequence","components":["001DfkjHzeiR_s2/pkg1/c1","001DfkjHzeiR_s2/c2"]},"limits":{"timeout":null}}
           console.log("thisAction", $scope.thisAction)
           CodeFunctionService.addAction($scope.thisAction).then(function (response) {
               console.log("addAction", response)
               if(response.code == 0){
                window.location = encodeURI('#sequence_detail?manage=true' + "&name=" + $scope.thisAction.name);
               }else{
                    showToast("Create Sequence failed! Error" + response.data.error)
                }
           });
        }
    }
    


  theApp.controller('AddPPackageController', AddPPackageController);
  AddPPackageController.$inject = ['$scope', '$uibModalInstance', 'param','SpacePackageService'];

  function AddPPackageController($scope, $uibModalInstance, param, SpacePackageService) {
    //var data={listPackage:$scope.listPackageName,namespaceID:$scope.namespaceID}
    $scope.bInvalidName = false;
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
    var listPackage = param.listPackage
    $scope.checkValidPkgName = function(){
        for(var i=0;i<listPackage.length;i++){
            if($scope.package_name === listPackage[i]){
                $scope.bInvalidName = true;
                break;
            }else{
                $scope.bInvalidName = false;
            }
        }
    };

    $scope.save = function () {
        var packageItem={namespace:param.namespaceID,package_name:$scope.package_name}
        SpacePackageService.addPackage(packageItem).then(function(response){
            console.log("response", response)
            $uibModalInstance.close(response);
        });
    };

  }


  })();
  
