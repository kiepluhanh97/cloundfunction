(function () {
    'use strict';

    theApp.controller('PopupConfirmController', PopupConfirmController);
    PopupConfirmController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'param'];
    function PopupConfirmController($scope, $rootScope, $uibModalInstance, param) {


        $scope.initData = function () {
            //console.log(param);
            $scope.title = param.title;
            $scope.content = param.content;
            $scope.listname = param.listname;
            if(param.footer1){
                $scope.footer1 = param.footer1;
            }
            else{
                $scope.footer1 = "OK";
            }
            if ( param.title2 != null &&  param.title2 != undefined){
              $scope.title2 =  param.title2;
            }

        }

        $scope.initData();

        $scope.ok = function () {
            $uibModalInstance.close({result: true});
        }
        $scope.cancel = function () {
            $uibModalInstance.close({result: false});
        }

    }

})();
