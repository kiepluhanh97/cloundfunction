(function() {
  'use strict';
  theApp.controller('SpaceController', SpaceController);
  SpaceController.$inject = ['$scope','$rootScope', 'SpaceService', '$uibModal', 'VER', 'UIVER','GlobalService', '$timeout','$cookies'];

  function SpaceController($scope, $rootScope, SpaceService, $uibModal, VER, UIVER,  GlobalService, $timeout, $cookies) {
   
    // init data , call func

    $scope.newSpace = {};
    $scope.baddNew = false
    $rootScope.curentuser.vndtuid = ($cookies.get('vndtuid') != undefined ? $cookies.get('vndtuid') : "");
    $scope.vndtuid = $rootScope.curentuser.vndtuid
    $scope.spaceList = [];
    
    $scope.initData = function(){
      SpaceService.getSpace().then(function (result) {
        if (result.code === 0){
          if(result.data !== null){
            result.data.forEach(function (item){
              if(item.blocked != true){
                item.blocked = "Active"
              }else{
                item.blocked = "Blocked"
              }
            });
            $scope.spaceList = result.data
            
          }
        }
        
      })

    };

    function converNpToShow(np){
      if(np.blocked){
        np.blocked = "Blocked";
      }
      else{
        np.blocked = "Unblocked";
      }
      // console.log("New namespace: ",np);
    }

// NOW JUST GET A NAMESPACE TO TEST, GET ALL LATER
    $scope.getListNameSpace = function(id){
      return SpaceService.getSpace(id).then(function(resp){
         console.log(resp);
        if(resp.code == 0){
          var thisNp = resp.data;
          if(thisNp.blocked){
            thisNp.status = "Blocked";
          }
          else{
            thisNp.status =  "Unblocked" ;
          }
          $scope.spaceList.push(thisNp);
        }
        else{
          showToast(resp.msg);
        }
      })
    }

    $scope.initData();

    $scope.viewDetail = function(item){
      window.location = encodeURI('#spacedetail?id='+item.namespace);
    }


    $scope.UpdateNp = function(item, status){
      GlobalService.showConfirm({
        title: "Update space",
        title2: item.name,
        content: "Do you want to update the space from the list?",
        footer1: "Update"
      }, "md").then(function (data) { 
        // console.log("confirm data", data)
        if(data){
          var data = {};
          data.blocked = status;
          return SpaceService.updateSpace(item.namespace, data).then(function(resp){
            if(resp.code == 0){
              // console.log(resp);
              showToast("Update success");
              for(var i=0;i<=$scope.spaceList.length;i++){
                if($scope.spaceList[i].namespace == resp.data.id){
                  converNpToShow(resp.data);
                  $scope.spaceList[i].namespace = resp.data.id;
                  $scope.spaceList[i].blocked = resp.data.blocked;
                  return;
                }
              }
    
            }
            else{
              showToast("Update fail");
            }
          })               
        }
      });

    

    }

    $scope.showPopupAddNewSpace = function () {
      $scope.baddNew = true;
      $scope.newSpace.name =  $scope.vndtuid + "_";
      $timeout(function () {
        document.getElementById('spacename').focus();
      }, 10);
      // $scope.addNewSpace($scope.newSpace.name);
      
    };

    $scope.addNewSpace = function(id){
      $scope.baddNew = false;
      if(id == ""){
        showToast("Namespace id empty")
        return
      }
      var itemId = id.substring( $scope.vndtuid.length + 1, id.length);
      var data={"id":itemId,"blocked":false};
      // console.log(data);
      return SpaceService.addNewSpace(data).then(function(resp){
         console.log(resp);
        if(resp.code ==0){
          var newNp = resp.data;
          converNpToShow(newNp);
          $scope.spaceList.push(newNp);
          showToast("Success");
        }
        else{
          showToast("Fail");
        }
      })
    }

    $scope.addNewSpace2 = function () {
      var vndtuid =  $scope.vndtuid ;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'add_new_space.html',
        controller: 'AddNewSpaceController',
        size: 'md',
        resolve: {
          param: function () {
            return vndtuid;
          }
        }
      });
  
      modalInstance.result.then(function (result) {
        // console.log("result", result)
        $scope.baddNew = false;
       
        $scope.addNewSpace(result.name);
      })
  
    };

    
    $scope.renameSpace = function(item){
    //  console.log(item);
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
    };

    $scope.removeSpace = function(item){

      GlobalService.showConfirm({
        title: "Delete space",
        title2: item.name,
        content: "Do you want to remove the space from the list?",
        footer1: "Delete"
      }, "md").then(function (data) { 
        // console.log("confirm data", data)
        if(data){
          return SpaceService.deleteSpace(item.namespace).then(function(resp){
            if(resp.code == 0){
              $scope.spaceList.splice($scope.spaceList.indexOf(item),1);
              showToast("Delete success");
            }
            else{
              showToast("Delete fail")
            }
          })                   
        }
      });
    };



    $scope.onDel = function(){
      $scope.confirm({
        title: "Delete",
        
        content: "Are you sure you want to delete the space?"
      }, "sm").then(function(resp) {
          if(resp == true){
            $scope.bAddNew = true;
            SpaceService.deleteSpace($scope.SpaceLabel).then(function(resp){
              showToast("Delete the space success");
            });
            
          }
            
      });
    }
  }

  theApp.controller('AddNewSpaceController', AddNewSpaceController);
  AddNewSpaceController.$inject = ['$scope', '$uibModalInstance', 'GlobalService','param'];
  function AddNewSpaceController($scope, $uibModalInstance,GlobalService, param) {
    console.log("param",param)
    $scope.new_space_name = param + "_";
    
    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    }
    $scope.ok = function(){
      $scope.bInvalidName = GlobalService.isContainInvalidChars($scope.new_space_name)
      if(!$scope.bInvalidName ){
        var result = {
          name: $scope.new_space_name,
        };
        $uibModalInstance.close(result);
      }
      
    }
  }
  
})();
