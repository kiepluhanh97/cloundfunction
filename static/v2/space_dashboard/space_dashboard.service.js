(function () {
    'use strict';
    theApp.factory('SpaceDashBoardService', SpaceDashBoardService);
    SpaceDashBoardService.$inject = ['$rootScope', '$http', '$q', 'API_URL', '$cookies'];

    function SpaceDashBoardService($rootScope, $http, $q, API_URL, $cookies) {

        var CHART_CONFIG = {
            rule: [{ type: 'horizontalBar', element: 'rule_chart' }],
            activity: [{ type: 'bar', element: 'timeline_chart' }]
        }

        var USAGE_CONFIG = {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: [{ label: 'Failed', backgroundColor: '#D52C4E', data: [], fill: false }, { label: 'Success', backgroundColor: '#37B777', data: [] }]
            },
            options: {
                responsive: true, 
                legend: {
                    display: false
                },
                scales: { 
                    xAxes: [{ stacked: true, gridLines: { display: false }, ticks: {} }], 
                    yAxes: [{ maxBarThickness: 30, barPercentage: 0.8, stacked: true, display: true, gridLines: { display: false } }] 
                }

            }
        };

        var TIMELINE_CONFIG = {
            type: 'bar',
            data: {
                datasets: [
                    { label: 'failed',backgroundColor: '#D52C4E', borderColor: '#D52C4E', data: [], fill: false, type: 'line', pointRadius: 2, borderWidth: 2 },
                    { label: 'success', backgroundColor: '#37B777', borderColor: '#37B777', data: [], fill: false, type: 'line', pointRadius: 2, borderWidth: 2 }
                ]
            },
            options: {
                scales: {
                    xAxes: [{ type: 'time', time: {unit: 'hour', displayFormats: {hour: 'HH:mm', minute: 'HH:mm'} }, gridLines: { display: false } }],
                    yAxes: [{ display: true, gridLines: { display: false }, ticks: { beginAtZero: true, suggestedMin: 0 } }]
                },
                tooltips: { mode: 'nearest', intersect: false }
            }
        };


        this.getChartData = function (request) {
            var url = API_URL + 'stat/hub/details?timeRange=' + request.timeRange + '&step=' + request.step;
            console.log('hub stat detail', url);
            return $http.get(url, {
                headers: {
                    'Authorization-Token': $rootScope.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(handleSuccess, handleError('Error get list Rule'));
        }

        this.getChartData = function (request) {
            var url = API_URL + 'stat/hub/details?timeRange=' + request.timeRange + '&step=' + request.step;
            console.log('hub stat detail', url);
            return $http.get(url, {
                headers: {
                    'Authorization-Token': $rootScope.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(handleSuccess, handleError('Error get list Rule'));
        }

        this.clearCharts = function (chartTypes) {
            Chart.helpers.each(Chart.instances, function (instance) {
                if (!chartTypes || $.inArray(instance.chart.config.type, chartTypes) >= 0) {
                    instance.chart.destroy();
                }

            })
        };

        this.getListActivationHistory = function (namespaceID, timeFrame, action) {
            //call api here
            var obj = {
                name: action,
                limit: timeFrame
            }
            var url = API_URL + "namespaces/" + namespaceID + "/activations?" + $.param(obj)
            console.log(url)
            $rootScope.token = ($cookies.get('token') != undefined ? $cookies.get('token') : "");
            return $http.get(url, {
                headers: {
                    'Authorization': "Basic " + $rootScope.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(handleSuccess, handleError("Error get list activation"));
        }

        this.drawCharts = function (data, chartTypes) {
            for (const [key, configs] of Object.entries(CHART_CONFIG)) {
                for (var i in configs) {
                    var config = configs[i];
                    if (chartTypes && $.inArray(config.type, chartTypes) < 0) {
                        continue;
                    }
                    switch (config.type) {
                        case 'bar':
                            drawTimelineChart(data, config.element);
                            break;
                        case 'horizontalBar':
                            drawSummaryChart(data, config.element);
                            break;
                    }
                }
            }
        }


        function drawTimelineChart(items, elementId) {
            var config = JSON.parse(JSON.stringify(TIMELINE_CONFIG));
            var successData = [];
            var failedData = [];
            var minutesDiff = 0;
            var dates = {}; dates['failed'] = {}; dates['success'] = {};

            if (items != null) {
                var minDate;
                var maxDate;
                for(var i in items) {
                    var item = items[i];
                    if(i == 0) {
                        minDate = item.startMs;
                        maxDate = item.startMs;
                    } else {
                        minDate = (minDate > item.startMs) ? item.startMs: minDate;
                        maxDate = (maxDate < item.startMs) ? item.startMs: maxDate;
                    }
                }
                minutesDiff = Math.round(Math.abs(maxDate - minDate) / 1000 / 60);

                for (var i in items) {
                    var item = items[i];

                    var statusKey = (item.response.success == true)? 'success': 'failed';
                    var keyDate = rountToNearestHour(new Date(item.startMs), minutesDiff/50);
                    if (!dates[statusKey].hasOwnProperty(keyDate)) {
                        dates[statusKey][keyDate] = {};
                        dates[statusKey][keyDate]['value'] = 1;
                    } else {
                        dates[statusKey][keyDate]['value'] += 1;
                    }
                }
            }

            for (var key in dates) {
                var data = dates[key]; 
                var status = key; // success or failed
                for(var key in data) {
                    if(status == 'failed') {
                        failedData.push({
                            t: parseInt(key),
                            y: data[key].value
                        });
                    } else {
                        successData.push({
                            t: parseInt(key),
                            y: data[key].value
                        });
                    }

                }
            }

            config.data.datasets[0].data = failedData;
            config.data.datasets[1].data = successData;
            if(minutesDiff / 60 >  72) { // display date formate:  > 3 days => day, < 1hour => minutes else hour
                config.options.scales.xAxes[0].time.unit = 'day';
            } else if(minutesDiff / 60 <= 1) {
                config.options.scales.xAxes[0].time.unit = 'minute';
            }
            new Chart(elementId, config);

        };

        function rountToNearestHour(date, step) {
            if(step == 0) {
                step = 1;
            }
            var p = step * 60 * 1000;
            return new Date(Math.round(date.getTime() / p) * p).valueOf();
        }

        function drawSummaryChart(items, elementId, timeRange) {
            var config = JSON.parse(JSON.stringify(USAGE_CONFIG));
            var data = {};
            if (items != null) {
                for (var i in items) {
                    var item = items[i];
                    var response = item.response;
                    if (!data.hasOwnProperty(item.name)) {
                        data[item.name] = {}
                        data[item.name]['success'] = 0;
                        data[item.name]['failed'] = 0;
                        data[item.name]['duration'] = 0;
                    }
                    if (response.success == true) {
                        data[item.name]['success'] += 1;
                    } else {
                        data[item.name]['failed'] += 1;
                    }
                    data[item.name]['duration'] += item.duration;
                }
            }
            var failedIndex = config.data.datasets.findIndex(dataset => dataset.label == 'Failed');
            var successIndex = config.data.datasets.findIndex(dataset => dataset.label == 'Success');
            var durationList = [];
            var maxValue = 0; // define max Value for displaying xAxes
            for (var key in data) {
                var value = data[key];
                config.data.labels.push(key)
                config.data.datasets[failedIndex].data.push(value.failed);
                config.data.datasets[successIndex].data.push(value.success);
                maxValue = (maxValue > value.failed + value.success)? maxValue: (value.failed + value.success);
                durationList.push((value.duration / (value.success + value.failed)).toFixed(2));
            }
            config.plugins = [ChartDataLabels];
            config.options.plugins = {
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    backgroundColor: function (context) {
                        if (context.datasetIndex == 0) return '';
                        return '';
                    },
                    borderRadius: 4,
                    color: 'grey',
                    formatter: function (value, context) {
                        if (context.datasetIndex == 0) return '';
                        return durationList[context.dataIndex] + ' ms';
                    }
                }
            } 
            // get max xAxes value and display 110% or +1 of max value
            if(maxValue > 0 && maxValue < 10) {
                config.options.scales.xAxes[0].ticks.suggestedMax = maxValue + 1;
            } else {
                config.options.scales.xAxes[0].ticks.suggestedMax = parseInt(maxValue * 1.1);
            }
            new Chart(elementId, config);
        };

        function handleSuccess(res, url) {
            if (url == undefined) {
                return res.data;
            }

            if (angular.isUndefined($rootScope.caches.get(url))) {
                $rootScope.caches.put(url, res);
            }
            var cache = $rootScope.caches.get(url);

            return $q.when(cache.data);
        }

        function handleError(error) {
            return function () {
                return {
                    err: -2,
                    msg: error
                };
            };
        }
        return this;
    }
})();
