'use strict'

angular.module('myApp.details', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/currency/:Id', {
            templateUrl: 'details/details.html',
            controllerAs: 'detailsCtrl',
            controller: 'detailsCtrl'
        });
    }])
    .controller('detailsCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
        var id = $routeParams.Id;
        var self = this;

        this.test = 'test text';

        $http({ method: 'GET', url: url + 'Currencies/' + id })
            .then(
                function success(response) {
                    self.model = response.data;
                    console.log(response);
                    $http({ method: 'GET', url: url + 'Rates/' + id + '/' + self.getCurrentDate() })
                        .then(
                            function success(response1) {
                                self.rate = response1.data;
                                self.CurrencyRate = Number(self.rate.CurrencyRate);
                                console.log(response1);
                            },
                            function fail(response1) {
                                console.log(response1);
                            }
                        );
                },
                function fail(response) {
                    console.log(response);
                }
            );

        self.getCurrentDate = () => {
            var temp = new Date();
            var cd = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
            return cd;
        }
        console.log(self.getCurrentDate());

        this.searchRates = () => {
            var temp = new Date(this.startDate);
            var dtStart = (Number(temp.getDate()) > 9 ? temp.getDate() : '0' + temp.getDate()) + '-' + (Number((temp.getMonth() + 1)) > 9 ? (temp.getMonth() + 1) : '0' + (temp.getMonth() + 1)) + '-' + temp.getFullYear();
            temp = new Date(this.endDate);
            var dtEnd = (Number(temp.getDate()) > 9 ? temp.getDate() : '0' + temp.getDate()) + '-' + (Number((temp.getMonth() + 1)) > 9 ? (temp.getMonth() + 1) : '0' + (temp.getMonth() + 1)) + '-' + temp.getFullYear();

            var p = url + 'Rates/' + id + '/' + dtStart + '/' + dtEnd;
            $http.get(p)
                .then(
                    function success(response) {
                        console.log(response);
                        var rates = response.data;
                        if (rates.length > 0) {
                            var temp = Array();
                            temp[0] = ['Период', 'Курс'];
                            var max = rates[0].CurrencyRate;
                            var min = rates[0].CurrencyRate;
                            for (var i = 0; i < rates.length; i++) {
                                var itemDate = new Date(rates[i].Date);
                                var d = itemDate.getFullYear() + '.' + ((itemDate.getMonth() + 1) > 9 ? (itemDate.getMonth() + 1) : '0' + (itemDate.getMonth() + 1)) + '.' + (itemDate.getDate() > 9 ? itemDate.getDate() : '0' + itemDate.getDate());

                                temp[i + 1] = [d, rates[i].CurrencyRate];
                                if (rates[i].CurrencyRate > max) max = rates[i].CurrencyRate;
                                if (rates[i].CurrencyRate < min) min = rates[i].CurrencyRate;
                            }
                            //min -= 2;
                            console.log(max / min);
                            console.log(max, min);
                            if (temp != undefined) {
                                self.chart(temp, min, max);
                                rates = undefined;
                            }
                        }
                    },
                    function fail(response) {
                        console.log('no', response.data);
                    }
                );
        };

        this.chart = (input, min, max) => {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(input);

                var options = {
                    title: 'Курс по отношению к рублю РФ',
                    hAxis: { title: 'Период', titleTextStyle: { color: '#333' } },
                    //vAxis: { minValue: 0 }
                    vAxis: {
                        minValue: min,
                        ticks: [min * 0.9999, min, (max + min) / 2, max, max * 1.0001]
                    }
                };

                var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
                chart.draw(data, options);
            }
        };

    }]);