var app = angular.module('resto-app', ['ngResource', 'ngRoute', 'ngCookies']);

app.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'accountController'
    }).
    
    when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'profileController'
    }).
   
    when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'accountController'
    }).
    when('/food/:foodId', {
      templateUrl: 'partials/food-detail.html',
      controller: 'foodDetailController'
    }).
    when('/thanks', {
      templateUrl: 'partials/thanks.html'

    }).
    when('/logout', {
      templateUrl: 'partials/logout.html',
      controller: 'accountController'

    }).
    when('/forgot', {
      templateUrl: 'partials/forgot.html',
      controller: 'accountController'

    }).
    when('/reset', {
      templateUrl: 'partials/reset.html',
      controller: 'accountController'
    }).
    otherwise({
      redirectTo: '/',
      templateUrl: 'partials/food-list.html',
      controller: 'foodController'
    });
  }]);

  app.factory('Identity', function($http, $resource) {
    return $resource('/login', {},{
      query: { method: "GET", isArray: false }
    });

  });

  app.factory('Food', function ($resource) {
    return $resource("/food");
  });

  app.controller('profileController', function ($scope, Identity, $location) {

    $scope.name = "";
    $scope.email = "";
    
    Identity.query(function(result) {
      $scope.name = result.firstname;
      $scope.email = result.username;
    }, function (error) {
       $location.path('/');
    });
  });



  app.controller('foodController', function ($scope, Food, Identity) {

    Food.query(function(data) {
      $scope.foods = data;
    });

    $scope.name = "";
    $scope.isAuthenticated = false;
    Identity.query(function(result) {
      $scope.name = result.firstname;
      $scope.isAuthenticated = true;
    });

  });


  app.controller('accountController', function ($scope,$location,$http) {
    $scope.formData = {};
    $scope.msg = "";

    //register
    $scope.register = function () {

      $http.post('/register', $scope.formData).then(function (response) {
        if (response.data.success) {
          $location.path('/thanks');

        } else {
          $scope.msg = "user already exists";
        }

      });
    };
    //login

    $scope.login = function () {
      $http.post('/login', $scope.formData).then(function (response) {
        if (response.data.success) {
          $location.path('/');
        } else {
          $scope.msg = response.data.message;
        }

      });
    }; 


    $scope.logout = function() {
      console.log("logging out");
      $http.get('/logout');
      $location.path("/");
    };


    //forgot
    $scope.forgot = function () {
      $http.post('/forgot', $scope.formData).then(function (response) {
        if (response.data.success) {
          $location.path('/thanks');
        } else {
          $scope.msg = "user already exists";
        }
      });
    };
  });
