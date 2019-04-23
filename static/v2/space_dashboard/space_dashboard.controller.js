(function () {
    'use strict';
    theApp.controller('SpaceDashBoardController', SpaceDashBoardController);
    SpaceDashBoardController.$inject = ['$scope', 'SpaceDashBoardService', '$uibModal', 'VER', '$cookies', 'UIVER','$q', 'GlobalService'];

    function SpaceDashBoardController($scope, SpaceDashBoardService, $uibModal, VER, $cookies, UIVER, $q, GlobalService) {

        $scope.ActiviResult = [];
        $scope.timeFrame = '50';
        $scope.selectedAction = '';
        $scope.actionList = [];

        $scope.initData = function () {
            $scope.namespaceID = ($cookies.get('namespace') != undefined ? $cookies.get('namespace') : "");
            Chart.plugins.register({
                beforeInit: function (chart, options) {
                    chart.legend.afterFit = function () {
                        this.height = this.height + 10;
                    };
                },
                afterDraw: function (chart) {
                    var dataExisted = false;
                    for(var i in chart.data.datasets) {
                        if(chart.data.datasets[i].data.length > 0) {
                            dataExisted = true;
                            break;
                        }
                    }
                    if (!dataExisted) {
                        var ctx = chart.chart.ctx;
                        var width = chart.chart.width;
                        var height = chart.chart.height
                        // chart.clear();
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = "16px 'Helvetica Nueue'";
                        ctx.fillText('No data to display', width / 2, height / 2);
                        ctx.restore();
                    }
                }
            });
            Chart.plugins.unregister(ChartDataLabels);
            Chart.defaults.global.maintainAspectRatio = false;
            Chart.defaults.global.plugins.labels = false;
            // add pointer cursor on legend 
            Chart.defaults.global.legend.onHover = function (e, legendItem) {
                e.target.style.cursor = 'pointer';
            };
            // default pointer
            Chart.defaults.global.hover.onHover = function (e) {
                if (e.target && e.target.style.cursor != 'default') {
                    e.target.style.cursor = 'default';
                }
            };

            // var promise = [];
            // promise.push($scope.getListActivity());
            // $q.all(promise).then(function () {
            //     $scope.handleListActivity();
            //     setTimeout(function () {
            //         // display text when no data to display on chart
                    
            //         $scope._drawCharts();
            //       },  200);
            // })
            //     ;
        };

        $scope.$watchGroup(['selectedAction', 'timeFrame'], function() {
            $scope.getListActivity();
        });

        $scope.$watch('listActivity', function(newValue){
            if(newValue == null) return;
            $scope._drawCharts();
        });

        $scope._drawCharts = function(chartTypes) {
            SpaceDashBoardService.clearCharts(chartTypes);
            console.log("$scope.listActivity", $scope.listActivity);
            if($scope.listActivity == null) return;
            SpaceDashBoardService.drawCharts($scope.listActivity); 
          };

        $scope.handleListActivity = function(){//this to easily get package for action 
            if($scope.listActivity.length){
                for(var i=0 ;i<$scope.listActivity.length ;i++){
                    var thisanotation = $scope.listActivity[i].annotations;
                    if(thisanotation.length){
                        for(var ii=0;ii<thisanotation.length;ii++){
                            if(thisanotation[ii].key == "path"){
                                $scope.listActivity[i].pakage = thisanotation[ii].value;
                                break;
                            }

                        }
                    }

                }
            }
        }

        $scope.getListActivity = function () {
            return SpaceDashBoardService.getListActivationHistory($scope.namespaceID, $scope.timeFrame, $scope.selectedAction).then(function(resp){
                console.log(resp);
                var tempActivityList = [];
                var tempActionList = [];
                if(resp.code == 0) {
                    tempActivityList = resp.data;
                    for(var i=0 ; i < tempActivityList.length ; i++){
                        var tempStart = tempActivityList[i].start
                        tempActivityList[i].start =  GlobalService.convertUNIXTimeToDateTime(tempStart)
                        tempActivityList[i].startMs = tempStart
                        var ret = {"ret":"", "time": tempStart}
                        ret.ret = tempActivityList[i].response.success
                        $scope.ActiviResult.push(ret);
                        if(tempActionList.indexOf(tempActivityList[i].name) == -1) {
                            tempActionList.push(tempActivityList[i].name);
                        }
                    }
                    $scope.listActivity = tempActivityList;
                    $scope.actionList = tempActionList;
                } else {
                    showToast("Error get list activation")
                }
            })
        }

        $scope.initData();

        $scope.popupViewDetail = function(item){
            var data = item;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'viewactivation.html',
                controller: 'DetailActivationController',
                size: 'lg',
                resolve: {
                  param: function () {
                    return data;
                  }
                }
              });

        }




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



    theApp.controller('DetailActivationController', DetailActivationController);
    DetailActivationController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'param','$timeout'];
  
    function DetailActivationController($scope, $rootScope, $uibModalInstance, param,$timeout) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.thisActivation = param;
        console.log($scope.thisActivation);
        $scope.activationString = JSON.stringify($scope.thisActivation,undefined, 4);
        // $scope.changeparameters = JSON.stringify($scope.thisParameter.parameters, undefined, 4);
    }


})();

