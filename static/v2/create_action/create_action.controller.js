(function() {
    'use strict';
    theApp.controller('CreateActionController', CreateActionController);
    CreateActionController.$inject = ['$scope','SpacePackageService','RuleService','$rootScope','$cookies','SpaceActionService','$uibModal', 'GlobalService', 'UIVER','VER','CodeFunctionService'];
  
    function CreateActionController($scope, SpacePackageService,RuleService, $rootScope,$cookies, SpaceActionService,$uibModal, GlobalService, UIVER, VER, CodeFunctionService) {
        $scope.packageselected = DEFAULT_PACKAGE;
        $scope.listPackageName = [DEFAULT_PACKAGE];
        $scope.listRuntime = [{"name":"Node.js 10","f":"nodejs:10"},
                              {"name":"Node.js 8","f":"nodejs:8"},
                              {"name":"Python 3","f":"python:3"},
                              {"name":"Swift 4.2","f":"swift:4.2"},
                              {"name":"Ruby 2.5","f":"ruby:2.5"},
                              {"name":"PHP 7","f":"php:7.3"},
                              {"name":"Go 1.11","f":"go:1.11"}];
        $rootScope.listRuntime = $scope.listRuntime
        $scope.showBtnCreate = true;
        $scope.existsName = false;
        $scope.invalidName = false;
        $scope.lisAction = []
        $scope.uiver = UIVER;
        $scope.ver = VER;
        $scope.thisAction = {}
        localStorage.setItem("listRuntime", JSON.stringify($scope.listRuntime));
        $scope.runtimeselected = $scope.listRuntime[0];
        $scope.actionname = "";
        $scope.namespaceID =  $rootScope.curentuser.token = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
        $scope.initData = function(){  
            //get package list
            SpacePackageService.getPackageList($scope.namespaceID).then(function(response){
                if(response.code === 0){
                    var data = response.data
                    for(var i = 0;i<data.length;i++){
                        $scope.listPackageName.push(data[i].name)
                    }
                    
                }

            });
            SpaceActionService.getlistaction($scope.namespaceID).then(function (resp) {
                if (resp.code === 0) {
                    $scope.lisAction = resp.data.slice();
                } else {
                    console.log("error:", resp.code)
                }

            })
        };
        $scope.checkValidActName = function(){
           
            if( GlobalService.isContainInvalidChars($scope.actionname)){
                $scope.invalidName = true
                return
            }else{
                $scope.invalidName = false
            }
            var newName = ""
            if($scope.packageselected === DEFAULT_PACKAGE){
                newName = $scope.namespaceID  + "/" + $scope.actionname
            }else{
                newName =  $scope.namespaceID + "/" + $scope.packageselected + "/" +  $scope.actionname
            }
            for(var i=0 ; i < $scope.lisAction.length; i++){
                var item = $scope.lisAction[i]
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
      

        $scope.prepairData = function () {
            switch ($scope.runtimeselected.f) {

                case "go:1.11":
                  // code block
                  $scope.code_area_txt = codeSample.golang;
                  break;
                case "php:7.3":
                  $scope.code_area_txt = codeSample.php;
                  break;
                case "ruby:2.5":
                  $scope.code_area_txt = codeSample.ruby;
                  break;
                case "swift:4.2":
                  $scope.code_area_txt = codeSample.swift;
                  break;
                case "python:3":
                  $scope.code_area_txt = codeSample.python;
                  break;
                case "nodejs:8":
                  $scope.code_area_txt = codeSample.nodejs;
                  break;
                case "nodejs:10":
                  $scope.code_area_txt = codeSample.nodejs;
                  break;
                default:
                // code block
              }
            var codeContent = {}
            codeContent = { "exec": { "kind": $scope.runtimeselected.f, "code": $scope.code_area_txt }, "parameters": [], "limits": {} }
            $scope.thisAction.namespace = $scope.namespaceID
            $scope.thisAction.data = codeContent;
            if($scope.packageselected === DEFAULT_PACKAGE){
                $scope.thisAction.name =  $scope.actionname;
            }else{
                $scope.thisAction.name = $scope.packageselected + "/" + $scope.actionname;
            }
           
          };
      
        $scope.createAction = function(directPath){
            if(directPath == "codefunction")
                window.location = encodeURI('#codefunction?runtime=' + $scope.runtimeselected.f + "&pkg=" + $scope.packageselected + "&name=" + $scope.actionname);
            else if(directPath.indexOf("#create_act_trigger") > -1){
                $scope.prepairData();
                CodeFunctionService.addAction($scope.thisAction).then(function (response) {
                    console.log(response)
                    if(response.code == 0){
                        var action_name =  response.data.name
                        var package_name = response.data.namespace.replace("/","-")
                        var action_fullname = response.data.namespace + "/" + action_name
                        var trigger_fullname = localStorage.getItem("newTriggerName")
                        console.log("trigger_name", trigger_fullname)
                        var trigger_name = trigger_fullname.substring($scope.namespaceID.length + 1) 
                        var ruleName = ""
                        if(package_name == $scope.namespaceID){
                            ruleName = action_name  + "_" + trigger_name
                        }else{
                            ruleName = package_name.substring($scope.namespaceID.length + 1) +  "-" + action_name + "_" + trigger_name
                        }
                        var item={"namespace":$scope.namespaceID, "name":ruleName,"data":{}}
                        //data
                        /*
                        {
                                "trigger": "001DfkjHzeiR_s2/trg13",
                                "action": "001DfkjHzeiR_s2/q2"
                        }
                        */
                        item.data.trigger = trigger_fullname
                        item.data.action = action_fullname
                        console.log("itemRule", item)
                        RuleService.addRule(item).then(function(resp){
                            console.log("resp",resp)
                            if(resp.code == 0 ){
                                localStorage.removeItem("newTriggerName")
                                location.reload()
                            }else{
                                showToast("Add action to trigger failed! Error" + resp.data.error)
                            }
                        });
                    }else{
                        showToast("Create action failed! Error:"  + response.data.error)
                    }
                });
               
                
                //location.reload();
            }else if(directPath.indexOf("#create_act_sequence") > -1){
                $scope.prepairData();
                CodeFunctionService.addAction($scope.thisAction).then(function (response) {
                    console.log("response", response)
                    if(response.code == 0){
                        var sequenceDataExec = JSON.parse(localStorage.getItem("sequenceDataExec"))
                        var currSequenceName = localStorage.getItem("currSequenceName")
                        console.log("sequenceDataExec",sequenceDataExec )
                        var itemComponent = "/" + response.data.namespace + "/" + response.data.name
                        sequenceDataExec.components.push(itemComponent)
                        console.log("sequenceDataExec",sequenceDataExec )
                        var sequenceItem = {"name":currSequenceName, "namespace":$scope.namespaceID,"data":{"exec":sequenceDataExec}}
                        console.log("sequenceItem", sequenceItem)
                        CodeFunctionService.addAction(sequenceItem).then(function (response) {
                            console.log("addAction", response)
                            if(response.code == 0){
                                localStorage.removeItem("sequenceDataExec")
                                localStorage.removeItem("currSequenceName")
                                location.reload()
                            }else{
                                 showToast("Create Sequence failed! Error" + response.data.error)
                             }
                        });
                        
                    }else{
                        showToast("Create Action failed. Error:" + response.data.error)
                    }
                });
              
            }
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
  
