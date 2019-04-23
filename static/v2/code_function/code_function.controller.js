angular.module('theApp').directive('contenteditable', function () {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function (scope, elm, attr, ngModel) {

      function updateViewValue() {
        ngModel.$setViewValue(this.innerHTML);
      }
      //Binding it to keyup, lly bind it to any other events of interest 
      //like change etc..
      elm.on('keyup', updateViewValue);

      scope.$on('$destroy', function () {
        elm.off('keyup', updateViewValue);
      });

      ngModel.$render = function () {
        elm.html(ngModel.$viewValue);
      }

    }
  }
});
(function () {
  'use strict';
  theApp.controller('CodeFunctionController', CodeFunctionController);
  CodeFunctionController.$inject = ['$rootScope', '$scope', 'CodeFunctionService', '$uibModal', '$location', 'VER', '$cookies', 'UIVER', 'GlobalService', '$compile','$q','API_URL', 'SpaceActionService','RuleService','SpaceTriggerService'];

  function CodeFunctionController($rootScope, $scope, CodeFunctionService, $uibModal, $location, VER, $cookies, UIVER, GlobalService, $compile,$q,API_URL, SpaceActionService, RuleService, SpaceTriggerService) {

    const SHOW_TRIGER_CONNECT = 4
    $scope.listshow = [true, false, false, false, false, false, false];
    $scope.posShow = 0;
    $scope.actName = ""
    $scope.saveAct = true;
    $scope.timeoutLimit = 300000;
    $scope.deviceAttrs = [];
    $scope.memoryLimit = 512;
    $scope.invokeAct = false;
    $scope.ationName = "Invoke"
    $scope.thisAction = {}
    $scope.actionexpand = "Collapse";
    $scope.runtimeselectedInfo = {}
    $scope.expandall = false;
    $scope.showInvokingText = false;
    $scope.thisAction.relatedTrigger = []
    $scope.thisAction.data = {}
    $scope.thisAction.data.annotations = []
    $scope.listTrigger = []
    $scope.runTimeInfoList = RUNTIME
    $scope.showWarning = false;
    $scope.listRuntime = $scope.runTimeInfoList
    $scope.bShowAddParam = false
    //khoi tao parameter
    $scope.parameter = {};
    $scope.parameterAction = [];
    //$scope.paramTmpCount = 0
    $scope.typeAttrs = [];
    $scope.webAction = {}
    $scope.dataRuntime = {};
    //khoi tao data runtime
    $scope.dataRuntime.limit = { "memory": 500, "timeout": 300000 }

    $scope.actionForCode = "Invoke";
    $scope.namespaceID = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
    $scope.initData = function () {

      $scope.resetRuntime();
      $scope.code_area_txt = codeSample.golang;
      $scope.runtimeselected = $location.search()['runtime'];
      
      switch ($scope.runtimeselected) {

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
      $scope.htmlEditor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        theme: "elegant",
        matchBrackets: true,
        indentUnit: 8,
        tabSize: 8,
        indentWithTabs: true,
        mode: "text/x-go"
      })

      $scope.htmlEditor.setValue($scope.code_area_txt);

      var thisCodeMirror = document.getElementsByClassName("CodeMirror")[0];
      
      thisCodeMirror.setAttribute("ng-model", "thisNotUse");
      thisCodeMirror.setAttribute("ng-change", "changeCode()");
      thisCodeMirror.setAttribute("contenteditable", "true");
      $compile(thisCodeMirror)($scope);
      // htmlEditor.on('change',htmlEditor=>{
      //   $scope.actionForCode = "Save";
      //   $scope.codeText = htmlEditor.getValue();
      //   $scope.getEdited();
      //   var thistoupdate = document.getElementById("updatecode");
      //   $compile(thistoupdate)($scope);
      //   return
      // })


      $scope.pkg = $location.search()['pkg'];
      if ($scope.pkg === DEFAULT_PACKAGE) {
        $scope.pkg = ""
      }
      $scope.actName = $location.search()['name'];
      $scope.thisAction.name = $scope.actName;
      
      var package_name = $location.search()['pkg']
      if (package_name === DEFAULT_PACKAGE) {
        package_name = ""
      }
      if (package_name.length === 0) {
        $scope.thisAction.name = $location.search()['name'];
      } else {
        $scope.thisAction.name = package_name + "/" + $location.search()['name'];
      }

      $scope.thisAction.namespace = $scope.namespaceID
      var isEdited = $location.search()['manage'];
      if (isEdited) {
        CodeFunctionService.getActionDetails($scope.thisAction).then(function (resp) {
          console.log("getActionDetails", resp)
          if (resp.code === 0) {
            if(resp.data.exec.kind == "sequence"){
              console.log("sequence............................................................")
              window.location = encodeURI("/#/sequence_detail?name=" + resp.data.name )
              return
            }
            $scope.code_area_txt = resp.data.exec.code;
            $scope.htmlEditor.setValue($scope.code_area_txt);
            $scope.runtimeselected = resp.data.exec.kind;
            $scope.dataRuntime.limit = { "memory": resp.data.limits.memory, "timeout": resp.data.limits.timeout }

            //set color for runtime
            for (var i = 0; i < $scope.runTimeInfoList.length; i++) {
              if ($scope.runtimeselected === $scope.runTimeInfoList[i].f) {
                $scope.runtimeselectedInfo.color = $scope.runTimeInfoList[i].color;
                $scope.runtimeselectedInfo.ext = $scope.runTimeInfoList[i].ext;
                $scope.runtimeselectedInfo.name = $scope.runTimeInfoList[i].name;
                break;
              }
            }
            /////

            //set param
            $scope.deviceAttrs = resp.data.parameters
            $scope.deviceAttrsReset = resp.data.parameters
            $scope.deviceAttrsReset = JSON.parse(JSON.stringify(resp.data.parameters));
            $scope.parameterAction = resp.data.parameters
            ///
            $scope.memory = resp.data.limits.memory / 1024 * 1024;
            $scope.timeout = resp.data.limits.timeout;
            $scope.invokeAct = true;
            $scope.saveAct = false;
            for(var i=0; i< resp.data.annotations.length; i++){
              if(resp.data.annotations[i].key == "web-export"){
                $scope.webAction.webExport = resp.data.annotations[i].value
              }else if(resp.data.annotations[i].key == "raw-http"){
                $scope.webAction.rawHttp = resp.data.annotations[i].value
              }
            }
            $scope.showSaveWebAction = false;
            $scope.stWebExport = $scope.webAction.webExport;
            $scope.stRawHttp = $scope.webAction.rawHttp;
            
          }
        });
      } else {//add newds
        for (var i = 0; i < $scope.runTimeInfoList.length; i++) {
          if ($scope.runtimeselected === $scope.runTimeInfoList[i].f) {
            $scope.runtimeselectedInfo = $scope.runTimeInfoList[i]
            $scope.runtimeselectedName = $scope.runTimeInfoList[i].name
            break;
          }
        }
        $scope.invokeAct = false;
        $scope.saveAct = true;
        $scope.htmlEditor.setValue($scope.code_area_txt);
      }
      var key = "paramInvoke" + "-" + $scope.namespaceID + "-" + $scope.thisAction.name //
      $scope.parameter = JSON.parse(localStorage.getItem(key))
      $scope.thisAction.title_name = $scope.thisAction.name
      //window.location = encodeURI('#codefunction?manage=true&ns=' + item.namespace + "&name=" + item.name);
      var promises=[]
      promises.push($scope.getListTrigger())
      promises.push($scope.getListRules())
      promises.push($scope.getListAction())
      $q.all(promises).then(function(){
        console.log("$scope.thisAction", $scope.thisAction)
      });
    }

    $scope.getListAction = function(){
      SpaceActionService.getlistaction($scope.namespaceID).then(function (resp) {
        console.log("getlistaction", resp)
        if (resp.code === 0) {
            $scope.lisAction = resp.data;
        } else {
            console.log("error:", resp.code)
        }

      })
    };
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
          if(resp.code == 0){
              $scope.listRule = resp.data
              var actionFullName = $scope.namespaceID + "/" + $scope.thisAction.name//format actionname :<namespace>/<pkg_name>-<action_name>
              for(var i=0 ; i< $scope.listRule.length; i++){
                var actRuleName = $scope.listRule[i].action.path +"/" + $scope.listRule[i].action.name
                if(actionFullName == actRuleName){
                  $scope.thisAction.relatedTrigger.push($scope.listRule[i].trigger.name)
                }
              }
          }else{
              showToast("Get trigger info failed! Error:" + resp.data.error)
          }
      });
    };

    $scope.addTriggerToAction= function(){
      console.log("add trigger 2 action.................")
            var data={"namespaceID": $scope.namespaceID,"listTrigger":$scope.listTrigger,"action_name": $scope.thisAction.name,"listTriggerConnected":$scope.thisAction.relatedTrigger}
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'AddTriggerToAction.html',
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

    $scope.saveParam = function(){
      $scope.parameterAction = [];
      if($scope.isAttrKeyDuplicated($scope.deviceAttrs,$scope.deviceAttrs)){
        $scope.showDuplicateParam = true;
        return;
      }else{
        $scope.showDuplicateParam = false;
      }
      for(var i=0;i<$scope.deviceAttrs.length;i++){
        if(isNaN($scope.deviceAttrs[i].value)){
        }
        if(isNaN($scope.deviceAttrs[i].key)){
        }
        $scope.parameterAction.push($scope.deviceAttrs[i])
      }
      $scope.save();
      $scope.bShowAddParam = false;
      $scope.isChanged = false;
    };

    $scope.addParam = function () {
      $scope.deviceAttrs.push({ key: '', value: '' });
      $scope.bShowAddParam = true;
      //$scope.paramTmpCount ++
      $scope.isChanged = true
      $scope.canSave = true;
      $scope.isSaving = false;
      console.log("$scope.deviceAttrsReset", $scope.deviceAttrsReset)
    };

    $scope.resetParam = function(){
      $scope.bShowAddParam = false;
      // for(var i=0 ; i< $scope.paramTmpCount; i++){
      //   $scope.deviceAttrs.pop()  
      // }
      
      $scope.deviceAttrs = JSON.parse(JSON.stringify($scope.deviceAttrsReset));
      console.log("$scope.deviceAttrsReset", $scope.deviceAttrsReset)
      //$scope.paramTmpCount = 0
      $scope.isChanged = false
    };

    $scope.removeParam = function (item) {
        $scope.deviceAttrs.splice(item, 1);
        $scope.bShowAddParam = true;
        $scope.isChanged = true;
        $scope.canSave = true;
    };
    
    $scope.changeInput = function(){
      console.log("=====changeInput===============")
      console.log("$scope.deviceAttrs", $scope.deviceAttrs)
      for (var i in $scope.deviceAttrs) {
        if($scope.deviceAttrs[i].key == ""){
          $scope.canSave = false
          return
        }
      }
      $scope.canSave = true
      $scope.isChanged = true
      console.log("$scope.canSave", $scope.canSave)
    };

    $scope.isAttrKeyDuplicated = function (deviceAttrs, totalAttrs) {
      for (var i in deviceAttrs) {
        var count = 0;
        for (var j in totalAttrs) {
          if (deviceAttrs[i].key == totalAttrs[j].key) {
            count++;
          }
          if (count >= 2) {
            return true;
          }
        }

      }
      return false;
    };


    $scope.resetRuntime = function () {
      $scope.timeout = $scope.dataRuntime.limit.timeout / 1000;
      $scope.memory = $scope.dataRuntime.limit.memory;
    }

    $scope.addTimeout = function () {
      $scope.timeout += 10;
      if ($scope.timeout > $scope.timeoutLimit) {
        $scope.timeout = $scope.timeoutLimit;
      }
    }

    $scope.minusTimeout = function () {
      $scope.timeout -= 10;
      if ($scope.timeout < 1) {
        $scope.timeout = 1;
      }
    }

    $scope.addMemory = function () {
      $scope.memory += 32;
      if ($scope.memory > $scope.memoryLimit) {
        $scope.memory = $scope.memoryLimit;
      }
    }

    $scope.minusMemory = function () {
      $scope.memory -= 32;
      if ($scope.memory < 128) {
        $scope.memory = 128;
      }
    }

    $scope.updateMemory = function () {
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
    }

    $scope.saveRuntime = function () {
      $scope.dataRuntime.limit.timeout = $scope.timeout;
      $scope.dataRuntime.limit.memory = $scope.memory;
      $scope.dataRuntime.kind = $scope.runtimeselectedInfo.f
      //call api here
      showToast("Save Success")
      $scope.changeCode();
      $scope.save();
    };

    $scope.initData();
    $scope.invoke = function () {
      $scope.showInvokingText = true;
      $scope.invokeCode($scope.thisAction);


    };

    $scope.getActivation = function (item) {
      $scope.actionTime = 0
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

    $scope.invokeCode = function (item) {
      item.data = $scope.parameter
      return CodeFunctionService.invokeAction(item).then(function (resp) {
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
    }

    $scope.save = function () {
      $scope.showWarning = false;
      $scope.code_area_txt = $scope.htmlEditor.getValue()
      //$scope.changeCode();
      $scope.prepairData();
      //$scope.showInvokingText = false;
      if (!$scope.invokeAct) {
        CodeFunctionService.addAction($scope.thisAction).then(function (response) {
          console.log("resp", response)
          if (response.code == 0) {
            //$scope.getactivation(response.data);
            var item = response.data
            if (item.namespace.indexOf($scope.namespaceID + "/") != -1) {//contain namespace + package name, such as: abcde02/package_name
              var package_name = item.namespace.substring($scope.namespaceID.length + 1)
              item.package_name = package_name
            } else {
              item.package_name = ""
            }
            item.namespace = $scope.namespaceID;
            $scope.thisAction = item;
            $scope.invokeAct = true
            $scope.saveAct = false;
            $scope.actName = $scope.thisAction.name
            $scope.thisAction.title_name = $scope.thisAction.name
            for(var i=0; i< response.data.annotations.length; i++){
              if(response.data.annotations[i].key == "web-export"){
                $scope.webAction.webExport = response.data.annotations[i].value
              }else if(response.data.annotations[i].key == "raw-http"){
                $scope.webAction.rawHttp = response.data.annotations[i].value
              }
            }
            showToast("Save action success");
          } else {
            showToast("Failed! Message:" + response.data.error)
            $scope.saveAct = true;
          }


        });
      }

    };

    $scope.clearResult = function () {
      $scope.showInvokingText = false;
      $scope.lisActivationInfor = [];
      $scope.contentexpand = [];
    }


    $scope.prepairData = function () {
      var codeContent = {}
      codeContent = { "exec": { "kind": $scope.runtimeselected, "code": $scope.code_area_txt }, "parameters": [], "limits": {}, "annotations":[] }
      $scope.thisAction.namespace = $scope.namespaceID
      //$scope.thisAction.name = $scope.pkg  + "/" +  $scope.actName
      $scope.thisAction.data = codeContent;
      $scope.thisAction.data["limits"] = $scope.dataRuntime.limit
      $scope.thisAction.data["parameters"] = $scope.parameterAction
      console.log("$scope.thisAction", $scope.thisAction)
      //updated data:"annotations":[{"key":"exec","value":"nodejs:10"},{"key":"web-export","value":true},{"key":"final","value":true}
      if($scope.stWebExport == true){
        $scope.thisAction.data.annotations.push({"key":"web-export","value":$scope.stWebExport})
        $scope.thisAction.data.annotations.push({"key":"final","value":true})
      }
      if($scope.stRawHttp){
        $scope.thisAction.data.annotations.push({"key": "raw-http", "value": $scope.stRawHttp})
      }

      $scope.invokeAct = false;
      console.log("$scope.thisAction", $scope.thisAction)
    };

    $scope.changeCode = function () {
      var codeContent = {}
      codeContent = { "exec": { "kind": $scope.runtimeselected, "code": $scope.code_area_txt }, "parameters": [], "limits": {} }
      //codeContent.paramters = $scope.parameter
      $scope.thisAction.namespace = $scope.namespaceID
      //$scope.thisAction.name = $scope.pkg  + "/" +  $scope.actName
      $scope.thisAction.data = codeContent;
      //$scope.thisAction.data["parameters"] = Object.values($scope.parameter)
      $scope.thisAction.data["limits"] = $scope.dataRuntime.limit
      $scope.thisAction.data["parameters"] = $scope.parameterAction
      $scope.invokeAct = false;
      $scope.saveAct = true;
      //$scope.changeCodeOnSave();
    };

    $scope.showItem = function (item) {
      if (item == $scope.posShow) { return; }
      else {
        $scope.listshow[$scope.posShow] = false;
        $scope.listshow[item] = true;
        $scope.posShow = item;
      }
      if(item == SHOW_TRIGER_CONNECT){
        var len = $scope.thisAction.relatedTrigger.length
        while(len --){
          var bFound = false;
          for(var j=0;j<$scope.listTrigger.length;j++){
            if($scope.listTrigger[j].name === $scope.thisAction.relatedTrigger[len]){
                bFound = true;
                break;
            }
          }
          if(bFound == false){
            $scope.thisAction.relatedTrigger.splice($scope.thisAction.relatedTrigger[len],1)
          }
        }
      }
    };

    $scope.expand = false;
    $scope.saveActions = function () {
    };

    $scope.resizeCodeContent = function () {
      if ($scope.expand == false) {
        var codeContent = document.getElementById("codecontent");
        var resultContent = document.getElementById("resultcontent");
        codeContent.classList.remove("col-lg-6");
        codeContent.className += " col-lg-12";
        resultContent.classList.remove("col-lg-6");
        resultContent.className += " col-lg-12";
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

    }


    $scope.lisActivationInfor = [];
    $scope.contentexpand = [];

    $scope.getactivation = function (item) {
      return CodeFunctionService.getActivation(item).then(function (resp) {
        console.log(resp);
        if (resp.code == 0) {
          $scope.activationInfor = resp.data;
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
        }
        else {
          showToast("Error get activation: " + resp.data.error);
        }
      });
    };


    $scope.collapsecontent = function (index) {
      var thisContent = document.getElementById('contentactivation' + index);
      thisContent.style.height = '0';
      $scope.contentexpand[index] = true;
    }

    $scope.expandcontent = function (index) {
      var thisContent = document.getElementById('contentactivation' + index);
      thisContent.style.height = 'auto';
      $scope.contentexpand[index] = false;
    }

    $scope.resizeContent = function (index) {
      if (!$scope.contentexpand[index]) {
        $scope.collapsecontent(index);
      }
      else {
        $scope.expandcontent(index);
      }
    }

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
        var key = "paramInvoke" + "-" + $scope.namespaceID + "-" + $scope.thisAction.name //
        localStorage.setItem(key, JSON.stringify($scope.parameter))
      })
    };

    $scope.resizeAllContent = function () {
      if ($scope.actionexpand == "Collapse") {
        for (var i = 0; i < $scope.contentexpand.length; i++) {
          $scope.collapsecontent(i);
        }
        $scope.actionexpand = "Expand";
        $scope.expandall = true;
      }
      else {
        for (var i = 0; i < $scope.contentexpand.length; i++) {
          $scope.expandcontent(i);
        }
        $scope.actionexpand = "Collapse";
        $scope.expandall = false;
      }
    }

    $scope.invokeOrSaveCode = function () {
      if ($scope.actionForCode == "Invoke") {
        $scope.invokeCode();
      }
      else {
        $scope.saveCode();
      }
    }

    $scope.onchangeRunTime = function () {
      $scope.showWarning = true;
      for (var i = 0; i < $scope.runTimeInfoList.length; i++) {
        if ($scope.runtimeselectedName === $scope.runTimeInfoList[i].name) {
          $scope.runtimeselectedInfo = $scope.runTimeInfoList[i];
          $scope.runtimeselected = $scope.runtimeselectedInfo.f
          break;
        }

      }

      //$scope.runtimeselectedInfo = item
    };
 
    //Khoi tao gia tri web action
    
    $scope.changestWebExport = function(option){
      $scope.isSaving = false
      if(option == 'webexport'){
        if($scope.stWebExport == false){
          $scope.stRawHttp = false
        }
       
      }else{//rawhttp
        if($scope.stRawHttp == true){
          $scope.stWebExport = true
        }
      }
      $scope.showSaveWebAction = true;
      console.log("$scope.webAction", $scope.webAction)
      //$scope.stWebExport = $scope.webAction.webExport;
      //$scope.stRawHttp = $scope.webAction.rawHttp;
      
     
    };
    
    $scope.resetstWebExport = function(){
      // $scope.stWebExport = false;
      // $scope.stRawHttp = false;
      $scope.isSaving = true
      console.log("$scope.webAction", $scope.webAction)
      if($scope.webAction.webExport){
        $scope.stWebExport = true;
      }else{
        $scope.stWebExport = false;
      }
      if($scope.webAction.rawHttp){
        $scope.stRawHttp = true;
      }else{
        $scope.stRawHttp = false;
      }
      

    }

    $scope.isWebAction = function(){
      return scope.stWebExport
    }

    $scope.saveWebAction = function(){
      //call api here
      $scope.isSaving = true
      $scope.save()
    }

    $scope.copyText = function(stt){
      if(stt == 1){
        var thisCopy = document.getElementById("urlRestApi");
      }
      else if(stt ==2){
        var thisCopy = document.getElementById("urlCurl");
      }
      var range = document.createRange();
      window.getSelection().removeAllRanges();
      range.selectNode(thisCopy);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      showToast("Copied");
    }

    $scope.getNamespaceById = function(){
      $scope.uuidNameSpace = ($cookies.get('uuid') != undefined ? $cookies.get('uuid') : "");
      $scope.keyNameSpace = ($cookies.get('key') != undefined ? $cookies.get('key') : "");
      $scope.urlWebAction = API_URL + "web/" + $scope.thisAction.namespace + "/actions/" + $scope.thisAction.name;
      $scope.urlRestApi = API_URL + "namespaces/" + $scope.thisAction.namespace + "/actions/" + $scope.thisAction.name;
      $scope.curlText1 = "curl -u API-KEY -X POST " + API_URL + "namespaces/" + $scope.thisAction.namespace + "/actions/" + $scope.thisAction.name +"?blocking=true";
      
      $scope.curlText2 = "curl -u " + $scope.uuidNameSpace +":" + $scope.keyNameSpace +" -X POST " + API_URL + "namespaces/" + $scope.thisAction.namespace +"/actions/" + $scope.thisAction.name + "?blocking=true";
      $scope.curlTextShow = $scope.curlText1;
      $scope.showcurl2 = false;
          

    }
    $scope.getNamespaceById();
    
    $scope.changeShowCurl = function(stt){
      if(stt == 1){
        $scope.curlTextShow = $scope.curlText2;
        $scope.showcurl2 = true;

      }
      else if(stt == 2){
        $scope.curlTextShow = $scope.curlText1;
        $scope.showcurl2 = false;
      }
    }

    $scope.removeAction = function (item) {
      $scope.confirm({
          title: "Remove action",
          title2: item.name,
          content: "Do you want to remove the action from the list?",
          footer1: "Delete"
      }, "md").then(function (data) {
          if (data) {
              //call api here
              SpaceActionService.deleteAction(item).then(function (resp) {
                  //then delete from the list now, not reload
                  if(resp.code == 0 ){
                    window.location = encodeURI("/#/spaceaction")
                  }else{
                    showToast("Remove action failed. Error:" +  resp.data.error)
                  }
              });

          }
      })

  };

    $scope.confirm = function (data, size) {
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



  theApp.controller('AddTriggerToActionController', AddTriggerToActionController);
  AddTriggerToActionController.$inject = ['$rootScope','$scope', '$uibModalInstance', 'param', 'RuleService', 'VER','GlobalService','SpaceTriggerService'];

  function AddTriggerToActionController($rootScope, $scope, $uibModalInstance, param, RuleService, VER, GlobalService, SpaceTriggerService) {
    //var data={"namespaceID": $scope.namespaceID,"listTrigger":$scope.listTrigger,"action_name": $scope.thisAction.name,"listTriggerConnected":$scope.thisAction.relatedTrigger}
    console.log("AddTriggerToActionController......................................................")
    $scope.namespaceID = param.namespaceID
    $scope.listTrigger = param.listTrigger
    $scope.action_name = param.action_name
    $scope.selectedTrigger = {}
    $scope.listTriggerConnected = param.listTriggerConnected
    console.log("param", param)
    $scope.listTriggerAvailable=[]
    $scope.listTriggerConnected.sort(function(a, b){
      return a.length - b.length;
    });
    var len = $scope.listTrigger.length
    while(len--){
      for(var i=0; i<$scope.listTriggerConnected.length; i++){
        if($scope.listTriggerConnected[i] == $scope.listTrigger[len]){
          $scope.listTrigger.splice($scope.listTrigger[len],1)
        }
      }
    }

    $scope.createTriggerAndConect = function(){
        console.log("trigger_name", $scope.trigger_name)
        var itemTrigger = {"name":$scope.trigger_name,"namespace":$scope.namespaceID,"data":{} }
        SpaceTriggerService.createTrigger(itemTrigger).then(function(resp){
          console.log("createTrigger", resp)
          if(resp.code == 0){
            $scope.selectedTrigger.name = $scope.trigger_name
            $scope.save()
          }else{
              showToast("Update trigger failed! Error:" + resp.data.error)
          }
      });
    };

    $scope.checkValidTriggerName = function(){
      for(var i=0 ; i<$scope.listTrigger.length;i++){
        if($scope.listTrigger[i].name === $scope.trigger_name){
            $scope.bDuplicateName = true;
            break;
        }else{
            $scope.bDuplicateName = false;
            if( GlobalService.isContainInvalidChars($scope.trigger_name)){
              $scope.bInvalidName = true
              return
            }else{
                $scope.bInvalidName = false
            }
        }
      }
     

    };

    $scope.selectAction = function(evt, optName) {
      if(optName == "createnew"){
          $scope.showBTNAct = false
          var trigger_name =  $scope.namespaceID + "/" + param.trigger_name
          //localStorage.setItem("newTriggerName", trigger_name)
      }else{// select existing
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
    
    $scope.save = function () {
      var itemRule = {}
      itemRule.namespace = $scope.namespaceID 
      itemRule.name = $scope.action_name.replace("/", "-") + "_" + $scope.selectedTrigger.name
      itemRule.data = {"trigger":$scope.namespaceID + "/" +$scope.selectedTrigger.name,"action":$scope.namespaceID + "/" +  $scope.action_name }
      console.log("itemRule", itemRule)
      RuleService.addRule(itemRule).then(function(resp){
        console.log("resp",resp)
        if(resp.code == 0 ){
            location.reload()
        }else{
            showToast("Add action failed! Error" + resp.data.error)
        }
      });
        
    }


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


