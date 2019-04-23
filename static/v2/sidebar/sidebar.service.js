(function () {
    'use strict';
    theApp.factory('SidebarService', SidebarService);
    SidebarService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'GlobalService'];
    function SidebarService($rootScope, $http, $q, API_URL, GlobalService) {
        var url = API_URL + "sidebar"
        var service = {};

        //service.getFunctionList = getFunctionList;

        service.parserMsgErr = parserMsgErr;
        service.getErrMsg = getErrMsg;

        return service;


        function getFunctionList() {
            var cmd = "getlist";
            var url = API_URL + "permission" + "?cm=" + cmd;
            
            return $q.when( {err: 0, dt:
                        {
                            1 :{
                                "function_code":1,
                                "function_name":"Tổng quan",
                                "icon":"fa fa-desktop",
                                "link":"#/overview",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":1,
                                "parent_function_code":0
                            },
                            2 :{
                                "function_code":2,
                                "function_name":"Xem lịch họp",
                                "icon":"fa fa-calendar",
                                "link":"#/calendar",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":2,
                                "parent_function_code":0
                            },
                            3 :{
                                "function_code":3,
                                "function_name":"Đặt lịch họp",
                                "icon":"fa fa-calendar-plus-o",
                                "link":"#/event",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":3,
                                "parent_function_code":0
                            },
                            4 :{
                                "function_code":4,
                                "function_name":"Quản lý tài nguyên",
                                "icon":"fa fa-bank",
                                "link":"#/resource",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":4,
                                "parent_function_code":0
                            },
                            5 :{
                                "function_code":5,
                                "function_name":"Yêu cầu phòng họp",
                                "icon":"fa fa-male",
                                "link":"#/requestfacility",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":5,
                                "parent_function_code":0
                            },
                            6 :{
                                "function_code":6,
                                "function_name":"Lịch sử đặt phòng",
                                "icon":"fa fa-male",
                                "link":"#/history",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":6,
                                "parent_function_code":0
                            },
                            7 :{
                                "function_code":7,
                                "function_name":"Cấu hình",
                                "icon":"fa fa-cog",
                                "link":"",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":7,
                                "parent_function_code":0
                            },
                            8 :{
                                "function_code":8,
                                "function_name":"Cấu hình chi phí phòng họp",
                                "icon":"",
                                "link":"#/roomprice",
                                "target":"",
                                "level":2,
                                "status":1,
                                "order_in_level":2,
                                "parent_function_code":7
                            },
                            9 :{
                                "function_code":9,
                                "function_name":"Cấu hình chung",
                                "icon":"",
                                "link":"#/setting/general",
                                "target":"",
                                "level":2,
                                "status":1,
                                "order_in_level":1,
                                "parent_function_code":7
                            },
                            10 :{
                                "function_code":10,
                                "function_name":"Thống kê",
                                "icon":"fa fa-bar-chart",
                                "link":"",
                                "target":"",
                                "level":1,
                                "status":1,
                                "order_in_level":8,
                                "parent_function_code":0
                            },
                            11 :{
                                "function_code":11,
                                "function_name":"Thống kê tổng quan",
                                "icon":"",
                                "link":"#/statistics/overview",
                                "target":"",
                                "level":2,
                                "status":1,
                                "order_in_level":1,
                                "parent_function_code":10
                            },
                            12 :{
                                "function_code":12,
                                "function_name":"Thống kê theo phòng ban",
                                "icon":"",
                                "link":"#/statistics/deppartmentscost",
                                "target":"",
                                "level":2,
                                "status":1,
                                "order_in_level":2,
                                "parent_function_code":10
                            },
                            13 :{
                                "function_code":13,
                                "function_name":"Thống kê tấn suất sử dụng theo phòng",
                                "icon":"",
                                "link":"#/statistics/frequencybyroom",
                                "target":"",
                                "level":2,
                                "status":1,
                                "order_in_level":3,
                                "parent_function_code":10
                            },
                            14 :{
                                "function_code":14,
                                "function_name":"Thống kê tấn suất sử dụng theo ngày",
                                "icon":"",
                                "link":"#/statistics/frequencyroombydate",
                                "target":"",
                                "level":2,
                                "status":1,
                                "order_in_level":4,
                                "parent_function_code":10
                            },
                            
                            1000 :{
                                "function_code":1000,
                                "function_name":"Chỉnh sửa thông tin tài nguyên",
                                "icon":"",
                                "link":"#/statistics/frequencyroombydate",
                                "target":"",
                                "level":2,
                                "status":0,
                                "order_in_level":4,
                                "parent_function_code":10
                            },
                            1001 :{
                                "function_code":1001,
                                "function_name":"Xuất thông tin file execl",
                                "icon":"",
                                "link":"#/statistics/frequencyroombydate",
                                "target":"",
                                "level":2,
                                "status":0,
                                "order_in_level":4,
                                "parent_function_code":10
                            },
                            1003 :{
                                "function_code":1003,
                                "function_name":"Chỉnh sửa cấu hình",
                                "icon":"",
                                "link":"#/statistics/frequencyroombydate",
                                "target":"",
                                "level":2,
                                "status":0,
                                "order_in_level":4,
                                "parent_function_code":10
                            },
                        }
                    });
            /*
            return $http.get(url).then(function (res) {
                console.log("getAllFloor", res);
                return handleSuccess(res, url)
            }, handleError('Error get  function permission list error'));
            */

        }   




        function  getErrMsg(data) {
            var msg = GlobalService.getErrMsg(data.err);
            msg += parserMsgErr(data);
            return msg;
        }

        function parserMsgErr(data) {

            var result = "";
            if (data.err == 104) {
                if (data.msg == "name") {
                    result = "Tên tài nguyên";
                } else if (data.msg == "id") {
                    result = "Mã tài nguyên";
                } else if (data.msg == "building_id") {
                    result = "Mã tòa nhà";
                } else if (data.msg == "email") {
                    result = "Email";
                } else if (data.msg == "seat") {
                    result = "Số chỗ";
                } else if (data.msg == "floor_id") {
                    result = "Mã tầng";
                } else if (data.msg == "area_id") {
                    result = "Mã khu vực";
                } else if (data.msg == "type") {
                    result = "Loại tài nguyên";
                } else if (data.msg == "status") {
                    result = "Trạng thái";
                } else if (data.msg == "address") {
                    result = "Địa địa chỉ";
                }

            }

            if (result.length > 0) {
                result = ": " + result;
            }
            return result;
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {err: -2, msg: error};
            };
        }
    }
})();
