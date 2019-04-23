(function () {
    'use strict';
    theApp.controller('SpaceActionController', SpaceActionController);
    SpaceActionController.$inject = ['$scope', 'SpaceService', 'SpaceActionService', '$uibModal', 'VER', '$cookies', 'UIVER', '$rootScope', 'SpacePackageService','GlobalService','$q'];

    function SpaceActionController($scope, SpaceService, SpaceActionService, $uibModal, VER, $cookies, UIVER, $rootScope, SpacePackageService,GlobalService,$q) {


        $scope.itemByPageList = [5, 10, 30, 50];
        // $scope.itemPerPage = 10;
        // $scope.pageTh = 1;
        // $scope.totalItem = 10;
        // $scope.totalPages = Math.ceil($scope.totalItem / $scope.itemPerPage);
        $scope.lstPackages = []
        $rootScope.posLeftMenuRoot = 1

        $scope.initData = function () {
            $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
            $scope.namespaceID = $rootScope.curentuser.namespace;
            // console.log($rootScope.curentuser.namespace);
            //var uuid = $location.search()['id'];
            var uuid = $rootScope.curentuser.namespace;
            SpacePackageService.getPackageList($scope.namespaceID).then(function(response){
                if(response.code === 0){
                    $scope.lstPackages = response.data
                    console.log($scope.lstPackages);
                }else{
                    console.log("get lst pkg failed");
                }
            });

            //$scope.getNamespaceById(uuid);
            
            var promise  = [];
            promise.push($scope.getListAction());
            $q.all(promise).then(function(){
                $scope.createListObjShow();
            });
            console.log($scope.listObjAction);

            
        }

        $scope.listObjActionShow = [];

        $scope.createListObjShow = function(){
            if($scope.listObjAction){
                for(var i=0;i<$scope.listObjAction.length;i++){
                    var data={}
                    data.data=$scope.listObjAction[i].data.slice(0,10);
                    data.itemPerPage = 10;
                    data.pageTh = 1;
                    data.totalItem = $scope.listObjAction[i].data.length;
                    data.totalPages = Math.ceil(data.totalItem / data.itemPerPage);
                    data.package = $scope.listObjAction[i].package;
                    data.showMenu = (data.package === $scope.namespaceID) ? false:true
                    $scope.listObjActionShow.push(data);
                }
            }
            console.log("listObjActionShow", $scope.listObjActionShow)
        }

        $scope.updatePagingPackage = function(index,page,itemperpage){
            $scope.listObjActionShow[index].data = $scope.listObjAction[index].data.slice((page-1)*itemperpage,page*itemperpage);
            $scope.listObjActionShow[index].pageTh = page;
            $scope.listObjActionShow[index].itemPerPage = itemperpage;
            $scope.listObjActionShow[index].totalPages = Math.ceil($scope.listObjActionShow[index].totalItem / $scope.listObjActionShow[index].itemPerPage);
        }

        $scope.updatePagingPackage2 = function(index,itemperpage){
            $scope.updatePagingPackage(index,1,itemperpage)
        }
        $scope.searchTextIn = {}
        $scope.changeSearch = function(){
            $scope.searchTextIn.name = $scope.searchtext.data.name;
        }
        
        // function dynamicSort(property) {
        //     var sortOrder = 1;
        //     if(property[0] === "-") {
        //         sortOrder = -1;
        //         property = property.substr(1);
        //     }
        //     return function (a,b) {
        //         var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        //         return result * sortOrder;
        //     }
        // }

        $scope.listObjAction = [];
        
        $scope.manageAction = function(item){
            console.log("item", item)
            console.log("$scope.namespaceID", $scope.namespaceID)
            if(item.namespace.indexOf( $scope.namespaceID + "/") != -1){//contain namespace + package name, such as: abcde02/package_name
                var package_name = item.namespace.substring($scope.namespaceID.length + 1)
                item.package_name = package_name
            }else{
                item.package_name = ""
            }
            if(item.annotations[0].value == "sequence"){
                window.location = encodeURI('#sequence_detail?manage=true' + "&name=" + item.name);
            }else{
                window.location = encodeURI('#codefunction?manage=true&pkg=' + item.package_name + "&name=" + item.name);
            }
            
        };
        $scope.creaceListObjectByPackage = function (listAction) {
            //sort by namespaceID
            listAction.sort(function(a, b){
                // ASC  -> a.length - b.length
                // DESC -> b.length - a.length
                return a.namespace.length - b.namespace.length;
              });
            // console.log("lisAction", listAction)

            if (listAction.length > 0) {
                for (var i = 0; i < listAction.length; i++) {
                    listAction[i].updatedTime = GlobalService.convertUNIXTimeToDateTime(listAction[i].updated)
                    var stthave = false;
                    for (var ii = 0; ii < $scope.listObjAction.length; ii++) {
                        if ($scope.listObjAction[ii].package == $scope.lisAction[i].namespace) {
                            $scope.listObjAction[ii].data.push(listAction[i])
                            stthave = true;
                            break;
                        }
                    }
                    if (stthave == false) {
                        var obj = {};
                        obj.package = listAction[i].namespace;
                        obj.data = [];
                        obj.data.push(listAction[i]);
                        $scope.listObjAction.push(obj);
                    }

                }
            }
            if ($scope.listObjAction.length) {
                $scope.listPkShow = new Array($scope.listObjAction.length);
                $scope.listPkShow.fill(false, 0, $scope.listObjAction.length);
            }
        }




        $scope.getListAction = function () {
            $scope.lisAction = [];
            return SpaceActionService.getlistaction($scope.namespaceID).then(function (resp) {
                // console.log("getlistaction", resp)
                if (resp.code === 0) {
                    $scope.lisAction = resp.data.slice();
                   
                    $scope.creaceListObjectByPackage($scope.lisAction);
                } else {
                    console.log("error:", resp.code)
                }

            })

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
                    SpaceActionService.deleteAction(item).then(function () {
                        //then delete from the list now, not reload
                        for (var i = 0; i < $scope.listObjActionShow.length; i++) {
                            var thisdata = $scope.listObjActionShow[i].data;
                            for (var ii = 0; ii < thisdata.length; ii++) {
                                if (thisdata[ii].name == item.name) {
                                    thisdata.splice(thisdata.indexOf(item), 1);
                                    $scope.listObjActionShow[i].totalItem = $scope.listObjActionShow[i].totalItem-1
                                    $scope.listObjActionShow[i].totalPages = Math.ceil($scope.listObjActionShow[i].totalItem / $scope.listObjActionShow[i].itemPerPage);
                                    return;
                                }
                            }
                        }
                    });

                }
            })

        };

        $scope.deletePackage = function(item){
            item.namespace = $scope.namespaceID
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'DeletePackage.html',
                controller: 'DeletePackageController',
                size: 'md',
                resolve: {
                    param: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                console.log("ret", result)
                if(result.code == 0){
                    showToast("Delete package success.")
                    $scope.listObjActionShow.splice($scope.listObjActionShow.indexOf(item), 1)
                }
            })
        }


        $scope.resizeTable = function (index) {
            $scope.listPkShow[index] = !$scope.listPkShow[index];

        }
        $scope.createAction = function(){
            window.location  = "/#/createaction";
        };
        $scope.getNamespaceById = function (namespace) {
            return SpaceService.getSpaceDetail(namespace).then(function (resp) {
                if (resp.code == 0) {
                    $scope.thisNamespace = resp.data;
                    if ($scope.thisNamespace) {
                        if ($scope.thisNamespace.blocked) {
                            $scope.thisNamespace.status = "Active";
                        }
                    }
                    $scope.spaceName = resp.data.id
                }
                else {
                    showToast("Get space error");
                }
            })
        }

        $scope.initData();

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
    };


  theApp.controller('DeletePackageController', DeletePackageController);
  DeletePackageController.$inject = ['$scope', '$uibModalInstance', 'param', 'SpacePackageService'];

  function DeletePackageController($scope, $uibModalInstance, param, SpacePackageService) {

    $scope.listAction = param.data
    var package_fullname = param.package
    $scope.package_name = package_fullname.substring(param.namespace.length + 1)
    // $('#focusname').text(textedJson);
    // console.log(textedJson);
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    $scope.save = function () {
        
        var itemPkg = {"namespace":param.namespace, "package_name":$scope.package_name}
        console.log("item", itemPkg)
        SpacePackageService.deletePackage(itemPkg).then(function(resp){
            console.log("resp", resp)
            if(resp.code == 0){
                $uibModalInstance.close(resp);
            }else{
                showToast("Delete package failed. Error:" + resp.data.error)
            }
        });
    };

  };

})();

