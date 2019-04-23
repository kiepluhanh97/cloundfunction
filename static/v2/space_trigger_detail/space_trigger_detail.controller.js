(function() {
    'use strict';
    theApp.controller('TriggerDetailController', TriggerDetailController);
    TriggerDetailController.$inject = ['$rootScope','$scope', 'SpaceTriggerService', 'CodeFunctionService','RuleService', '$uibModal', 'VER', '$cookies', 'UIVER','$location','$q', 'SpaceActionService','API_URL','$timeout'];
  
    function TriggerDetailController($rootScope,$scope,SpaceTriggerService, CodeFunctionService,RuleService, $uibModal, VER, $cookies, UIVER, $location, $q, SpaceActionService, API_URL, $timeout) {
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
        $scope.thisTrigger = {}
        $scope.showcurl2 = false;
        $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
        $rootScope.curentuser.key = ($cookies.get('key') != undefined ? $cookies.get('key') : "");
        $rootScope.curentuser.uuid = ($cookies.get('uuid') != undefined ? $cookies.get('uuid') : "");
        var userAPIKEY = $rootScope.curentuser.uuid + ":" +$rootScope.curentuser.key 
        $scope.namespaceID = $rootScope.curentuser.namespace;
        $scope.thisTrigger.name = $location.search()['name']
        $scope.urlRestApi = API_URL + "namespaces/" + $scope.namespaceID + "/triggers/" + $scope.thisTrigger.name
        $scope.curlTrigger = "curl -u API_KEY " + "-X POST " + API_URL + "namespaces/" + $scope.namespaceID + "/triggers/" + $scope.thisTrigger.name +"?blocking=true";
        $scope.curlTriggerValue = "curl -u " +  userAPIKEY + " -X POST " + API_URL + "namespaces/" + $scope.namespaceID + "/triggers/" + $scope.thisTrigger.name +"?blocking=true";
        $scope.curlTextShow = $scope.curlTrigger;
        
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

        $scope.initData = function(){
           
            $scope.thisTrigger.namespace = $scope.namespaceID
          
            var promise = []
            promise.push($scope.getDetailTrigger())
            promise.push($scope.getListRules())
            $q.all(promise).then(function(resp){
            })
        };
        var checkExistsInArr = function(array, valueInObj){
            for(var i=0; i< array.length; i++){
                if(array[i].fullname === valueInObj){
                    return true
                }
            }
            return false
        }
        $scope.getDetailTrigger = function(){
            SpaceTriggerService.getDetailTrigger($scope.thisTrigger).then(function(response){
                console.log("response", response)
                if(response.code == 0){
                    for(var i in response.data.rules){
                        var actFullName = response.data.rules[i].action.path + "-" + response.data.rules[i].action.name
                        if(checkExistsInArr($scope.listActionSelected,actFullName ) ){
                            //do nothing
                        }else{
                            var checked = false;
                            if(response.data.rules[i].status == "active"){
                                checked = true;
                            }
                            var itemAct = { "name":response.data.rules[i].action.name, 
                                            "path": response.data.rules[i].action.path,
                                            "fullname": actFullName,"status": response.data.rules[i].status.toUpperCase(),
                                            "checked": checked}
                            $scope.listActionSelected.push(itemAct)
                        }
                    }
                    $scope.deviceAttrs = response.data.parameters
                    
                }else{
                    showToast("Get trigger info failed! Error:" + response.data.error)
                    $timeout(function () {
                        window.location = encodeURI("/#/spacetrigger")
                      }, 3000);
                }
            });
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

        $scope.changeStatusAction = function(index){
            console.log("$scope.listActionSelected", $scope.listActionSelected)
            console.log("index", index)
            var tempStt = ""
            if($scope.listActionSelected[index].status == "ACTIVE"){
                tempStt = "INACTIVE"
            }else{
                tempStt = "ACTIVE"
            }
            var ruleName = ""
            var path =  $scope.listActionSelected[index].path
            var package_name = ""
            if(path.indexOf( $scope.namespaceID + "/") != -1){//contain namespace + package name, such as: abcde02/package_name
                package_name = path.substring($scope.namespaceID.length + 1) + "-" //add '-' for rule name format : <package_name>-<actions_name>_<trigger_name>
            }else{
                package_name = ""
            }
            var ruleName = package_name +  $scope.listActionSelected[index].name + "_" +   $scope.thisTrigger.name
            var itemRule = { "name":ruleName,
                             "namespace":$scope.namespaceID,
                             "data":{"status": tempStt.toLowerCase()}}
            
            RuleService.updateRuleStatus(itemRule).then(function(resp){
                console.log("resp", resp)
                if(resp.code == 0){
                    $scope.listActionSelected[index].status = tempStt
                }else{
                    showToast("Update trigger failed. Error:" + resp.data.error)
                }

            });
        };

        $scope.getListRules = function(){
            RuleService.getListRules($scope.namespaceID).then(function(resp){
                if(resp.code == 0){
                    $scope.listRule = resp.data
                    for(var i in  $scope.listRule){
                        if($scope.listRule[i].trigger.name === $scope.thisTrigger.name){
                            $scope.listRuleSelected.push($scope.listRule[i])
                        }
                    }
                }else{
                    showToast("Get trigger info failed! Error:" + resp.data.error)
                }
            });
        };

        $scope.removeTrigger = function(item){
            console.log("item", item)
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
                            window.location = encodeURI("/#/spacetrigger")
                        }else{
                            showToast("Delete trigger failed! Error:", response.data.error)
                        }
                    });
                }
            })
        };

        $scope.addAction = function(){
            SpaceActionService.getlistaction($scope.namespaceID).then(function(resp){
                if(resp.code == 0){
                    var listAction = JSON.parse(JSON.stringify( resp.data ));
                    var data={"namespaceID": $scope.namespaceID,"listAction":listAction,"trigger_name": $scope.thisTrigger.name,"listActSelected":$scope.listActionSelected}
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'AddActionTrigger.html',
                        controller: 'AddActionTriggerController',
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
                            var actFullName =  result.data.action.path + "-" + result.data.action.name
                            var itemAct = { "name":result.data.action.name, 
                            "path": result.data.action.path,
                            "fullname": actFullName,"status": result.data.status.toUpperCase(),
                            "checked": true}
                            $scope.listActionSelected.unshift(itemAct)
                        }
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

        $scope.onclickViewAct = function(item){
            console.log("item", item)
            var package_name = item.path
            if(package_name ==  $scope.namespaceID ){
                package_name = "" 
            }else{
                package_name = item.path.substring($scope.namespaceID.length + 1)
            }

            var directUrl = "/#/codefunction?manage=true&pkg=" + package_name + "&name=" + item.name
            window.location = encodeURI(directUrl)
        };

        $scope.saveParam = function(){
            console.log("$scope.deviceAttrs", $scope.deviceAttrs)
            $scope.parameters = [];
            if($scope.isAttrKeyDuplicated($scope.deviceAttrs,$scope.deviceAttrs)){
              $scope.showDuplicateParam = true;
              return;
            }else{
              $scope.showDuplicateParam = false;
            }
            for(var i=0;i<$scope.deviceAttrs.length;i++){
              console.log("$scope.deviceAttrs[i]", $scope.deviceAttrs[i])
              if(isNaN($scope.deviceAttrs[i].value)){
                console.log("value is text ")
              }
              if(isNaN($scope.deviceAttrs[i].key)){
                console.log("key is text ")
              }
              $scope.parameters.push($scope.deviceAttrs[i])
            }
          
            console.log("$scope.parameters", $scope.parameters)
            
            //console.log("$scope.thisAction", $scope.thisAction)
            //$scope.save();
            
            
            $scope.thisTrigger.data = {"parameters": $scope.parameters}
            SpaceTriggerService.createTrigger($scope.thisTrigger).then(function(resp){
                console.log("update trigger", resp)
                if(resp.code == 0){

                }else{
                    showToast("Update trigger failed! Error:" + resp.data.error)
                }
            });
        };

        $scope.addParam = function () {
            $scope.deviceAttrs.push({ key: '', value: '' });
          };
      
          $scope.removeParam = function (item) {
              $scope.deviceAttrs.splice(item, 1);
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
    }

    theApp.controller('AddActionTriggerController', AddActionTriggerController);
    AddActionTriggerController.$inject = ['$rootScope','$scope', '$uibModalInstance', 'param', 'RuleService', 'VER'];
  
    function AddActionTriggerController($rootScope, $scope, $uibModalInstance, param, RuleService, VER) {
        //var data={"namespaceID": $scope.namespaceID,"listAction":resp.data,"trigger_name": $scope.thisTrigger.name,"listActSelected":$scope.listActionSelected}
        
        var namespaceId = param.namespaceID
        var listActSelected = param.listActSelected
        var listAllAction = param.listAction
        $scope.listAction = param.listAction 
        $scope.ver = VER
        $scope.showBTNAct = false
        for(var i=0 ;i< listActSelected.length; i++){
            var itemAct = listActSelected[i]
            var pkg_name = ""
            if(itemAct.path.indexOf( namespaceId + "/") != -1){// path has contain package name
                pkg_name = itemAct.path.substring(namespaceId.length + 1)
            }else{
                pkg_name = DEFAULT_PACKAGE
            }
            var newName = pkg_name + "/" + itemAct.name
            listActSelected[i].newName = newName
        }
      
        
        $scope.listAction.sort(function(a, b){
            // ASC  -> a.length - b.length
            // DESC -> b.length - a.length
            return a.namespace.length - b.namespace.length;
          });
        for(var i=0; i< $scope.listAction.length; i ++){
            var itemAct = $scope.listAction[i]
            var package_name = ""
            if(itemAct.namespace.indexOf( namespaceId + "/") != -1){//contain namespace + package name, such as: abcde02/package_name
                package_name = itemAct.namespace.substring(namespaceId.length + 1) + "/" + itemAct.name //add '-' for rule name format : <package_name>-<actions_name>_<trigger_name>
            }else{
                package_name =  DEFAULT_PACKAGE + "/" + itemAct.name
            }
            $scope.listAction[i].name = package_name
        }
        var dupArr = []
        var lenAct = listAllAction.length
        while(lenAct--){
            for(var j=0; j< listActSelected.length; j++){
                if(listAllAction[lenAct].name === listActSelected[j].newName){
                    dupArr.push(listActSelected[j])
                    listAllAction.splice(lenAct,1)
                    //listActSelected.splice(j,1)
                    break;
                }
            }
        }
      
        $scope.changeAction = function(){
            console.log("selectedAction", $scope.selectedAction)
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        
        $scope.selectAction = function(evt, optName) {
            if(optName == "createnew"){
                $scope.showBTNAct = false
                var trigger_name = namespaceId + "/" + param.trigger_name
                localStorage.setItem("newTriggerName", trigger_name)
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
        
        $scope.prepairData = function(){
            var ruleName = ""
            var actionName = ""
            var actionInfo = ""
            var defaultPgk = DEFAULT_PACKAGE
            /**
             * selectAction data:{
                name: "DEFAULT_PACKAGE/a16" || name: "pkg01/a16"
                namespace: "001DfkjHzeiR_s2"}
             */
            if($scope.selectedAction.name.indexOf( DEFAULT_PACKAGE + "/") != -1){// <DEFAULT_PACKAGE>/<action_name>
                actionName = $scope.selectedAction.name.substring(defaultPgk.length + 1) 
                actionInfo = namespaceId + "/" + $scope.selectedAction.name.substring(defaultPgk.length + 1) 

            }
            else if($scope.selectedAction.name.indexOf("/") != -1){// <package_name>/<action_name>
                actionInfo = namespaceId + "/" + $scope.selectedAction.name
                actionName = $scope.selectedAction.name.replace("/", "-") 
            }
            ruleName = actionName + "_" + param.trigger_name
            console.log("actionName", actionName)
            console.log("ruleName", ruleName)
            var item={"namespace":namespaceId, "name":ruleName,"data":{}}
            //data
            /*
            {
                    "trigger": "001DfkjHzeiR_s2/trg13",
                    "action": "001DfkjHzeiR_s2/q2"
            }
            */
            item.data.trigger = namespaceId + "/" + param.trigger_name
            item.data.action = actionInfo
            return item
        };

        $scope.save = function () {
            console.log("selectedAction", $scope.selectedAction)
            if($scope.selectedAction == undefined){
                return
            }
            var item = $scope.prepairData()
            console.log("item", item)
            RuleService.addRule(item).then(function(resp){
                console.log("resp",resp)
                if(resp.code == 0 ){
                    $uibModalInstance.close(resp);
                }else{
                    showToast("Add action failed! Error" + resp.data.error)
                }
            });
            
        }
    };
    
  })();
  
