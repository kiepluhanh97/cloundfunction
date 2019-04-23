(function () {
    'use strict';

    theApp.controller('PopupAlertController', PopupAlertController);
    PopupAlertController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'param'];
    function PopupAlertController($scope, $rootScope, $uibModalInstance, param) {
        $scope.popupalert = false;

        $scope.initData = function () {
            //console.log(param);
            $scope.title = param.title;
            $scope.type    = param.type;
            //$scope.content = param.content;
            if($scope.type == "html"){
              $scope.contentHtml = param.content;
            }else{
                $scope.content = param.content;
            }


        }

        $scope.initData();

        $scope.ok = function () {
            $uibModalInstance.close({result: true});
        }

    }

})();
