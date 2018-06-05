'use strict'

angular.module('myApp.currency', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/currency', {
            templateUrl: 'currency/currency.html',
            controller: 'currencyCtrl'
        });
    }])
    .controller('currencyCtrl', ['$http', function($http) {

        this.currencies = [{}];
        var setCurrencies = (_currencies) => {
            this.currencies = _currencies;
        }

        $http({ method: 'GET', url: url + 'Currencies/' })
            .then(function success(response) {
                setCurrencies(response.data);
            });
        var laodList = () => {
            $http({ method: 'GET', url: url + 'Currencies/' })
                .then(function success(response) {
                    setCurrencies(response.data);
                });
        };

        this.isEditing = false;

        this.submit = function() {
            if (this.isEditing) {
                var output = {
                    id: this.Id,
                    Code: this.Code,
                    Description: this.Description
                }

                $http.put(url + 'Currencies/' + this.Id, output)
                    .then(
                        function success(response) {
                            laodList();
                        },
                        function fail(response) {
                            console.log(response);
                        }
                    );

                this.isEditing = false;
            } else {
                var genId = this.currencies > 0 ? this.currencies[this.currencies.length - 1].Id + 1 : 1;
                var item = {
                    Code: this.Code,
                    Description: this.Description
                };
                $http.post(url + '/Currencies/', item)
                    .then(function success(response) {
                        laodList();
                    });
            }
            this.Id = undefined;
            this.Code = '';
            this.Description = '';
        };

        this.remove = function(currency) {
            $http.delete(url + 'Currencies/' + currency.Id)
                .then(
                    function success(response) {
                        laodList();
                    },
                    function fail(response) {
                        console.log(response);
                    }
                );
        };

        this.edit = function(currency) {
            this.Id = currency.Id;
            this.Code = currency.Code;
            this.Description = currency.Description;
            this.isEditing = true;
        };

        this.clear = function() {
            this.isEditing = false;
            this.Id = undefined;
            this.Code = '';
            this.Description = '';
        };
    }]);