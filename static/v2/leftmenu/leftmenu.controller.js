(function () {
    'use strict';
    theApp.controller('LeftMenuController', LeftMenuController);
    LeftMenuController.$inject = ['$scope', '$rootScope', 'UIVER', '$cookies'];
    function LeftMenuController($scope, $rootScope,  UIVER, $cookies) {
        $scope.uiver = UIVER;
        $scope.listchoose = [false,false,false,false] // details, action, trigger,dashboard
        $scope.posLeftMenu = $rootScope.posLeftMenuRoot;
        $scope.listchoose[$scope.posLeftMenu] = true;
        $scope.opensubmenu1 = function(){
            $rootScope.nowshow1 = !$rootScope.nowshow1;
        }

        $scope.viewSubOverView = function(){
            console.log("Lol");
            $rootScope.posLeftMenuRoot = 8;

        }
        $scope.viewSubPricing = function(){
            console.log("Lol");
            $rootScope.posLeftMenuRoot = 9;

        }
        $scope.viewSubCLI = function(){
            console.log("Lol");
            $rootScope.posLeftMenuRoot = 10;

        }
        $scope.viewSubAPIKEY = function(){
            console.log("Lol");
            $rootScope.posLeftMenuRoot = 11;

        }

        $scope.viewDocuments = function(){
            if($scope.posLeftMenu == 7){
        		return
        	}
        	else{
        		$rootScope.posLeftMenuRoot = 7;
        		$scope.listchoose[$scope.posLeftMenu] = false;
        		window.location = encodeURI('#documents');
        	}
        };

        $scope.viewDetail = function(){
        	if($scope.posLeftMenu == 0){
        		return
        	}
        	else{
        		$scope.listchoose[$scope.posLeftMenu] = false;
                $rootScope.posLeftMenuRoot = 0;
                $rootScope.curentuser.namespace = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
                var path = '#spacedetail?id=' + $rootScope.curentuser.namespace
                console.log("path", path)
        		window.location = encodeURI(path);
        	}
        }

        $scope.viewAction = function(){
            if($scope.posLeftMenu == 1){
        		return
        	}
        	else{
        		$scope.listchoose[$scope.posLeftMenu] = false;
        		$rootScope.posLeftMenuRoot = 1;
        		window.location = encodeURI('#spaceaction');
        	}
        }

        $scope.viewTrigger = function(){
            if($scope.posLeftMenu == 2){
        		return
        	}
        	else{
        		$rootScope.posLeftMenuRoot = 2;
        		$scope.listchoose[$scope.posLeftMenu] = false;
        		window.location = encodeURI('#spacetrigger?id=');
        	}
        }
        $scope.viewDashBoard = function(){
            if($scope.posLeftMenu == 3){
        		return
        	}
        	else{
        		$rootScope.posLeftMenuRoot = 3;
        		$scope.listchoose[$scope.posLeftMenu] = false;
        		window.location = encodeURI('#spacedashboard?id=');
        	}
        }

        $scope.openmenu = true;

        $scope.resizeMenu = function(){
            // console.log($scope.openmenu);
            if($scope.openmenu){//thu nho
                
                var menu = document.getElementById('menucontainer');
                var content = document.getElementById('contentcontainer');
                var lastchild = document.getElementById('lastchild');
                menu.style.width = '0';
                content.style.paddingLeft = "2%";
                
                lastchild.innerHTML = '<i class="fas fa-angle-double-right"></i>';
                // lastchild.style.color = 'black';
            }
            else{
                var menu = document.getElementById('menucontainer');
                var content = document.getElementById('contentcontainer');
                var lastchild = document.getElementById('lastchild');
                menu.style.width = '20%';
                content.style.paddingLeft = "21%";
                lastchild.innerHTML = '<i class="fas fa-angle-double-left"></i>';
                // lastchild.style.color = 'white';

            }
            $scope.openmenu =  !$scope.openmenu;
        }






    }

})();
