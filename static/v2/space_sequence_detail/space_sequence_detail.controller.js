(function() {
    'use strict';
    theApp.controller('SequenceDetailController', SequenceDetailController);
    SequenceDetailController.$inject = ['$rootScope','$scope','RuleService', 'SpaceTriggerService', '$uibModal', 'VER', '$cookies', 'UIVER','$location','$q', 'SpaceActionService','API_URL','$timeout', 'CodeFunctionService'];
  
    function SequenceDetailController($rootScope,$scope,RuleService, SpaceTriggerService, $uibModal, VER, $cookies, UIVER, $location, $q, SpaceActionService, API_URL, $timeout, CodeFunctionService) {
        $scope.itemByPageList = [5,10,30,50];
        $scope.itemPerPage = 5;
        $scope.pageTh = 1;
        $scope.totalItem = 10;
        $scope.totalPages = Math.ceil($scope.totalItem/$scope.itemPerPage);
        $scope.listTrigger = []
        $scope.listRule = []
        $scope.listRuleSelected = []
        $scope.listActionSelected = []
        $scope.deviceAttrs = []
        $scope.thisSequence = {}
        $scope.thisSequence.data = {}
        $scope.showcurl2 = false;
        $scope.expand = false;
        $scope.lisActivationInfor = []
        $scope.contentexpand = [];
        $scope.thisSequence.relatedTrigger = []
        $scope.showBtnSave = false;
        $scope.runtimeselectedInfo = {}
        $scope.timeoutLimit = 600 //seconds
        $scope.memoryLimit = 2048 //mb
        $scope.dataRuntime = {}
        $scope.showBtnSaveRuntime = false;
        $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
        $rootScope.curentuser.key = ($cookies.get('key') != undefined ? $cookies.get('key') : "");
        $rootScope.curentuser.uuid = ($cookies.get('uuid') != undefined ? $cookies.get('uuid') : "");
        var userAPIKEY = $rootScope.curentuser.uuid + ":" +$rootScope.curentuser.key 
        $scope.namespaceID = $rootScope.curentuser.namespace;
        $scope.thisSequence.name = $location.search()['name']
        $scope.urlRestApi = API_URL + "namespaces/" + $scope.namespaceID + "/actions/" + $scope.thisSequence.name
        $scope.curlTrigger = "curl -u API_KEY " + " -X POST " + API_URL + "namespaces/" + $scope.namespaceID + "/actions/" + $scope.thisSequence.name +"?blocking=true";
        $scope.curlTriggerValue = "curl -u " +  userAPIKEY + " -X POST " + API_URL + "namespaces/" + $scope.namespaceID + "/actions/" + $scope.thisSequence.name +"?blocking=true";
        $scope.curlTextShow = $scope.curlTrigger;
        localStorage.removeItem("sequenceDataExec")
        localStorage.removeItem("currSequenceName")
        $scope.runTimeInfoList = RUNTIME
        var itemRuneTimeSequence = { "name": "Sequence", "f": "sequence", "color": "#d060b6", "ext": "" }
        $scope.runtimeselectedInfo.color = "#d060b6" ;
        $scope.runtimeselectedInfo.ext = "sequence";
        $scope.runtimeselectedInfo.name = "Sequence";
        console.log("$scope.runtimeselectedInfo", $scope.runtimeselectedInfo)
        $scope.runTimeInfoList.push(itemRuneTimeSequence)
        $scope.listRuntime = $scope.runTimeInfoList
        //rule name format: <package_name>-<actions_name>_<trigger_name>

        $scope.listshow = [true, false, false];
        $scope.posShow = 0;
        $scope.showItem = function (item) {
            if (item == $scope.posShow) { return; }
            else {
              $scope.listshow[$scope.posShow] = false;
              $scope.listshow[item] = true;
              $scope.posShow = item;
            }
          }

        $scope.viewDetailAction = function(item)  {
            console.log("item", item)
            window.location = encodeURI("/#/codefunction?name=" + item.name + "&pkg="+item.path + "&manage=true" )
        }
        $scope.initData = function(){
           
            $scope.thisSequence.namespace = $scope.namespaceID
          
            var promise = []
            promise.push($scope.getDetailSequence())
            promise.push($scope.getListRules())
            promise.push($scope.getListTrigger())
            
            $q.all(promise).then(function(resp){
               
            })
        };
        $scope.move = function(action, item){
            console.log("move:" , action)
            console.log("item", item)
            console.log("listActionSelected", $scope.listActionSelected)
            var index = $scope.listActionSelected.indexOf(item)
            if(action == 'up' && index != 0){
                [$scope.listActionSelected[index], $scope.listActionSelected[index-1]] = [$scope.listActionSelected[index-1], $scope.listActionSelected[index]];
            }else if(action == 'down' && index != $scope.listActionSelected.length){
                [$scope.listActionSelected[index], $scope.listActionSelected[index+1]] = [$scope.listActionSelected[index+1], $scope.listActionSelected[index]];
            }
        
        
        };

        $scope.removeAction = function(index){
            console.log("index", index)
            if(index == 0){
                return
            }
            $scope.listActionSelected.splice(index,1)
            $scope.showBtnSave = true
        };

        $scope.createAction = function(){
            console.log("$scope.packageselected", $scope.packageselected)

        };

        $scope.resizeCodeContent = function () {
            console.log("$scope.expand", $scope.expand)
            if ($scope.expand == false) {
              var codeContent = document.getElementById("codecontent");
              var resultContent = document.getElementById("resultcontent");
              codeContent.classList.remove("col-lg-6");
              codeContent.className += " col-lg-12";
              resultContent.classList.remove("col-lg-6");
              //resultContent.className += " col-lg-12";
              resultContent.style.display = "none";
              $scope.expand = true;
            }
            else {
              var codeContent = document.getElementById("codecontent");
              var resultContent = document.getElementById("resultcontent");
              codeContent.classList.remove("col-lg-12");
              codeContent.className += " col-lg-6";
              resultContent.classList.remove("col-lg-12");
              resultContent.className += " col-lg-6";
              resultContent.style.display = "block";
              $scope.expand = false;
            }
        };

        $scope.clearResult = function () {
            $scope.showInvokingText = false;
            $scope.lisActivationInfor = [];
            $scope.contentexpand = [];
        };



    $scope.popupChangeInput = function () {

        var data = $scope.parameter;
        if (data === null) {
          data = {}
        }
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'AddParameters.html',
          controller: 'AddPArameterController',
          size: 'lg',
          resolve: {
            param: function () {
              return data;
            }
          }
        });
  
        modalInstance.result.then(function (result) {
          $scope.parameter = result.parameters
          var key = "paramInvoke" + "-" + $scope.namespaceID + "-" + $scope.thisSequence.name //
          localStorage.setItem(key, JSON.stringify($scope.parameter))
        })
    };

        $scope.getActivation = function (item) {
            $scope.actionTime = 0
            item.data = $scope.parameter
            function newAsyncRequest() {
              setTimeout(function () {
                $scope.actionTime ++;
                CodeFunctionService.getActivation(item).then(function (response) {
                  console.log("response", response)
                  if (response.code === 0) {
                    $scope.activationInfor = response.data;
                    $scope.contentexpand.unshift(false);
                    if ($scope.activationInfor.logs.length == 0) {
                      $scope.timeNow = GlobalService.convertUNIXTimeToDateTime($scope.activationInfor.start)
                    } else
                      $scope.timeNow = $scope.activationInfor.logs[0].substring(0, 19);
                    var dataResult = {};
                    for (var i = 0; i < $scope.activationInfor.annotations.length; i++) {
                      if ($scope.activationInfor.annotations[i].key == "waitTime") {
                        dataResult.waitTime = $scope.activationInfor.annotations[i].value;
                        break;
                      }
                    }
                    dataResult.data = $scope.activationInfor;
                    dataResult.timeNow = $scope.timeNow;
                    $scope.lisActivationInfor.unshift(dataResult);
                    if ($scope.expand) {
                      $scope.resizeCodeContent();
                    }
                  } else {
                    newAsyncRequest();
                  }
                });
              }, 1000);
            }
            newAsyncRequest();
          };
        
        $scope.invokeCode = function () {
            console.log("$scope.thisSequence", $scope.thisSequence)
            var itemInvoke = $scope.thisSequence
            itemInvoke.data = $scope.parameter
            return CodeFunctionService.invokeAction(itemInvoke).then(function (resp) {
              console.log("resp", resp)
              if(resp.code === 0){//get activation id
                var activationID = resp.data.activationId
                var tempItemp = {"data":{"activationId":activationID}}
                $scope.lisActivationInfor.push(tempItemp)
                var item = {"namespace": $scope.namespaceID,"activationID":activationID}
                $scope.getActivation(item);
              }else{
                showToast("Invoke action failed! Error:" + resp.data.error)
              }
            })
        };

        $scope.deleteAction = function(thisSequence){
            console.log("thisSequence", thisSequence)
            $scope.confirm( { title:"Remove trigger",
                title2:thisSequence.name,
                content:"Do you want to remove trigger from the list?",
                footer1:"Delete"
                },"md").then(function(data){
                    if(data){
                        SpaceActionService.deleteAction(thisSequence).then(function (resp) {
                            //then delete from the list now, not reload
                            if(resp.code == 0 ){
                                showToast("Remove action success")
                                window.location = encodeURI("/#/spaceaction")
                            }else{
                                showToast("Remove action failed. Error:" +  resp.data.error)
                            }
                        });
                    }
            })
        };

        $scope.save = function(){
            // prepair data: {"exec":{"kind":"sequence","components":["001DfkjHzeiR_s2/c1","001DfkjHzeiR_s2/pkg1/a1","001DfkjHzeiR_s2/pkg1/a9"]}}
            var updatedData = {"exec":{"kind":"sequence","components":[]}}
           
            for( var i=0; i<$scope.listActionSelected.length; i++){
                updatedData.exec.components.push($scope.listActionSelected[i].fullname)
            }
            $scope.thisSequence.data = updatedData
            $scope.thisSequence.data.limits = {"timeout":$scope.timeout*1000,"memory":$scope.memory}
            console.log("$scope.thisSequence", $scope.thisSequence)
            CodeFunctionService.addAction($scope.thisSequence).then(function (response) {
                console.log("addAction", response)
                if(response.code == 0){
                    $scope.showBtnSave = false;
                }else{
                     showToast("Create Sequence failed! Error" + response.data.error)
                 }
            });
        }

        $scope.getListTrigger = function(){
            SpaceTriggerService.getlistTrigger($scope.namespaceID).then(function(response){
              console.log("getlistTrigger", response)
              if(response.code == 0){
                $scope.listTrigger = response.data
              }
            });
          };
        
        $scope.getListRules = function(){
            RuleService.getListRules($scope.namespaceID).then(function(resp){
                console.log("getListRules", resp)
                if(resp.code == 0){
                    $scope.listRule = resp.data
                    var actionFullName = $scope.namespaceID + "/" + $scope.thisSequence.name//format actionname :<namespace>/<pkg_name>-<action_name>
                    for(var i=0 ; i< $scope.listRule.length; i++){
                      var actRuleName = $scope.listRule[i].action.path +"/" + $scope.listRule[i].action.name
                      if(actionFullName == actRuleName){
                        $scope.thisSequence.relatedTrigger.push($scope.listRule[i].trigger.name)
                      }
                    }
                    console.log("$scope.thisSequence", $scope.thisSequence)
                }else{
                    showToast("Get trigger info failed! Error:" + resp.data.error)
                }
            });
          };


        $scope.getDetailSequence = function(){
            CodeFunctionService.getActionDetails($scope.thisSequence).then(function(response){
                console.log("response", response)
                if(response.code == 0){
                    for(var i in response.data.exec.components){
                        var actFullName = response.data.exec.components[i]
                        var arrayActInfo = actFullName.split("/"); 
                        console.log("arrayActInfo", arrayActInfo)
                        if(arrayActInfo.length == 3){// format: /<namespace>/<action name>
                            var name = arrayActInfo[2]
                            var path = DEFAULT_PACKAGE
                        }else if (arrayActInfo.length == 4){// format: /<namespace>/<package name>/<action name>
                            var name = arrayActInfo[3]
                            var path = arrayActInfo[2]
                        }
                        
                        var itemAct = { "name": name,
                                        "path": path,
                                        "fullname": actFullName
                                        }
                        $scope.listActionSelected.push(itemAct)
                        
                    }
                    var key = "paramInvoke" + "-" + $scope.namespaceID + "-" + $scope.thisSequence.name //
                    $scope.parameter = JSON.parse(localStorage.getItem(key))
                    $scope.deviceAttrs = $scope.listActionSelected
                    $scope.thisSequence.exec = response.data.exec
                    $scope.timeout = (response.data.limits.timeout) / 1000
                    $scope.memory = response.data.limits.memory
                    $scope.thisSequence.data.limits = response.data.limits
                    $scope.dataRuntime.limit = response.data.limits
                    //$scope.resizeCodeContent()
                }else{
                    showToast("Get action info failed! Error:" + response.data.error)
                    $timeout(function () {
                        window.location = encodeURI("/#/spaceaction")
                      }, 3000);
                }
            });
        };
        $scope.addTriggerToAction= function(){
            console.log("add trigger 2 action.................")
                  var data={"namespaceID": $scope.namespaceID,"listTrigger":$scope.listTrigger,"action_name": $scope.thisSequence.name,"listTriggerConnected":$scope.thisSequence.relatedTrigger}
                  var modalInstance = $uibModal.open({
                      animation: true,
                      templateUrl: '/static/' + UIVER + '/code_function/addTriggerToAction.html',
                      controller: 'AddTriggerToActionController',
                      size: 'lg',
                      resolve: {
                          param: function () {
                              return data;
                          }
                      }
                  });
                  modalInstance.result.then(function (result) {
                      console.log("ret", result)
                      if(result.code == 0){
                          // $scope.listActionSelected.unshift(itemAct)
                      }
                  })
             
          };

        $scope.copyText = function(index){
            if(index == 1){
                var thisCopy = document.getElementById("urlRestApi");
            }
            else if(index ==2){
                var thisCopy = document.getElementById("urlCurl");
            }
            var range = document.createRange();
            window.getSelection().removeAllRanges();
            range.selectNode(thisCopy);
            window.getSelection().addRange(range);
            console.log("window.thisCopy()",thisCopy)
            console.log("range", range)
            console.log("window.getSelection()", window.getSelection())
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            showToast("Copied");
        };

        $scope.changeShowCurl = function(stt){
            console.log("stt", stt)
            console.log("$scope.curlTrigger", $scope.curlTrigger)
            console.log("$scope.curlText2", $scope.curlTrigger)
            if(stt == 1){
              $scope.curlTextShow = $scope.curlTriggerValue;
              $scope.showcurl2 = true;
      
            }
            else if(stt == 2){
              $scope.curlTextShow = $scope.curlTrigger;
              $scope.showcurl2 = false;
            }
          }

        
    $scope.resetRuntime = function () {
        $scope.timeout = $scope.dataRuntime.limit.timeout / 1000;
        $scope.memory = $scope.dataRuntime.limit.memory;
        $scope.showBtnSaveRuntime = false;
      }
  
      $scope.addTimeout = function () {
        $scope.showBtnSaveRuntime = true
        $scope.timeout += 10;
        if ($scope.timeout > $scope.timeoutLimit) {
          $scope.timeout = $scope.timeoutLimit;
        }
      }
  
      $scope.minusTimeout = function () {
        $scope.showBtnSaveRuntime = true
        $scope.timeout -= 10;
        if ($scope.timeout < 1) {
          $scope.timeout = 1;
        }
      }
  
      $scope.addMemory = function () {
        $scope.showBtnSaveRuntime = true
        $scope.memory += 32;
        if ($scope.memory > $scope.memoryLimit) {
          $scope.memory = $scope.memoryLimit;
        }
      }
  
      $scope.minusMemory = function () {
        $scope.showBtnSaveRuntime = true
        $scope.memory -= 32;
        if ($scope.memory < 128) {
          $scope.memory = 128;
        }
      }
  
      $scope.updateMemory = function () {
        $scope.showBtnSaveRuntime = true
        var mmrvalue = parseInt($scope.memory);
        if (mmrvalue < 32) {
          $scope.memory = 32;
        }
        else if (mmrvalue > $scope.memoryLimit) {
          $scope.memory = $scope.memoryLimit;
        }
        else {
          $scope.memory = mmrvalue;
        }
      }
  
      $scope.updateTimeout = function () {
        $scope.showBtnSaveRuntime = true
        var tovalue = parseInt($scope.timeout);
        if (tovalue < 1) {
          $scope.timeout = 1;
        }
        else if (tovalue > $scope.timeoutLimit) {
          $scope.timeout = $scope.timeoutLimit;
        }
        else {
          $scope.timeout = tovalue;
        }
      };
      
      $scope.saveRuntime = function () {
        //call api here
        /* "limits": {
            "concurrency": 1,
            "logs": 10,
            "memory": 256,
            "timeout": 60000
        }
        */
        console.log("$scope.timeout", $scope.timeout)
        console.log("$scope.memory", $scope.memory)
      
        $scope.save();
        $scope.showBtnSaveRuntime = false
      };

        $scope.addAction = function(){
            SpaceActionService.getlistaction($scope.namespaceID).then(function(resp){
                if(resp.code == 0){
                    var listAction = JSON.parse(JSON.stringify( resp.data ));
                    var data={"namespaceID": $scope.namespaceID,"listAction":listAction,"sequence_name": $scope.thisSequence.name,"listActSelected":$scope.listActionSelected, "exec": $scope.thisSequence.exec}
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'AddActionSequence.html',
                        controller: 'AddActionSequenceController',
                        size: 'lg',
                        resolve: {
                            param: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        console.log("ret", result)
                        console.log("$scope.listActionSelected", $scope.listActionSelected)
                        $scope.listActionSelected.push(result)
                        //$scope.save();
                        $scope.showBtnSave = true;
                    })
                    
                }else{
                    showToast("Get list actions failed. Error:" + resp.data.error)
                }
            });
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

    theApp.controller('AddActionSequenceController', AddActionSequenceController);
    AddActionSequenceController.$inject = ['$scope', '$uibModalInstance','param'];
  
    function AddActionSequenceController( $scope, $uibModalInstance, param) {
        console.log("param", param)
        var selectedAction = param.listActSelected
        var exec = param.exec
        var namespaceId = param.namespaceID
        $scope.listAction = param.listAction 
        var thisSequenceName = param.sequence_name
        var package_name = ""
        var fullname = ""
       
        console.log("thisSequenceName", thisSequenceName)
        $scope.listAction = $scope.listAction.filter(function( obj ) {
            return obj.name !== thisSequenceName;
        });
        console.log("$scope.listAction",$scope.listAction)
        $scope.changeAction = function(){
            console.log("selectedAction", $scope.selectedAction)
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.listAction.sort(function(a, b){
            // ASC  -> a.length - b.length
            // DESC -> b.length - a.length
            return a.namespace.length - b.namespace.length;
          });
        for(var i=0; i< $scope.listAction.length; i ++){
            var itemAct = $scope.listAction[i]
          
            if(itemAct.namespace.indexOf( namespaceId + "/") != -1){//contain namespace + package name, such as: <namespaceID>/<package_name>
                fullname = itemAct.namespace.substring(namespaceId.length + 1) + "/" + itemAct.name //add '-' for rule name format : <package_name>-<actions_name>_<trigger_name>
                package_name = itemAct.namespace.substring(namespaceId.length + 1)
                console.log("package_name", package_name)
            }else{// format: <namespaceID>/<action_name>
                fullname =  DEFAULT_PACKAGE + "/" + itemAct.name
                package_name = DEFAULT_PACKAGE
            }
            $scope.listAction[i].fullname = fullname
        };
        
        localStorage.setItem("sequenceDataExec", JSON.stringify(exec))
        localStorage.setItem("currSequenceName", thisSequenceName)
        $scope.selectAction = function(evt, optName) {
            if(optName == "createnew"){
                $scope.showBTNAct = false
                
            }else{
                $scope.showBTNAct = true
            }
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(optName).style.display = "block";
            evt.currentTarget.className += " active";
        };

        $scope.save = function () {
            console.log("selectedAction", $scope.selectedAction)
            console.log("package_name",package_name)
            console.log("fullname",fullname)
           
            var path = ""
            if($scope.selectedAction.namespace == namespaceId){
                path = namespaceId
            }else{
                path = namespaceId + "/" + $scope.selectedAction.namespace.substring(namespaceId.length + 1)
            }
            fullname = path + "/" + $scope.selectedAction.name
            var selectedAction = {"name": $scope.selectedAction.name, "path":path, "fullname":fullname}
            console.log("selectedAction",selectedAction)
            $uibModalInstance.close(selectedAction)
        };
    };



  theApp.controller('AddPArameterController', AddPArameterController);
  AddPArameterController.$inject = ['$scope', '$uibModalInstance', 'param', '$timeout'];

  function AddPArameterController($scope, $uibModalInstance, param, $timeout) {

    $scope.thisParameter = param;
    $scope.changeparameters = JSON.stringify($scope.thisParameter, undefined, 4);
    $timeout(function () {
      document.getElementById("focusname").focus();
    }, 100);
    $scope.showInvalidJson = false;
    $scope.checkJsonFuntion = function () {
      try {
        JSON.parse($scope.changeparameters);
      } catch (e) {
        $scope.showInvalidJson = true;
        return false;
      }
      $scope.showInvalidJson = false;
      return true;
    }


    // $('#focusname').text(textedJson);
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    $scope.saveParameter = function () {
      if ($scope.checkJsonFuntion()) {
        var papameter = JSON.parse($scope.changeparameters);
        $scope.thisParameter = papameter;
        var result = {
          parameters: $scope.thisParameter,
        };
        $uibModalInstance.close(result);

      }
      else {
        return;
      }
    }

  }
    
  })();
  
