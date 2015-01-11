  var app = angular.module('resto-app', ['ngResource', 'ngRoute', 'ui.router']);

  app.config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('home', {
      url: '/',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/content.html',controller: 'homeController'}
      }

    })
    .state('login', {
      url: '/login',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/login.html',controller: 'accountController'}
      }
    })

    .state('logout', {
      url: '/logout',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/logout.html',controller: 'accountController'}
      }
    })

    .state('profile', {
      url: '/profile',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/profile.html',controller: 'profileController'}
      }
    })



    .state('register', {
      url: '/register',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/register.html',controller: 'accountController'}
      }
    })

    .state('forgot', {
      url: '/forgot',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/forgot.html', controller: 'accountController'}
      }
    })

    .state('forgotmessage', {
      url: '/forgotmessage',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/forgot-message.html'}
      }
    })

    .state('feedback', {
      url: '/feedback/:message',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/feedback.html', controller: 'feedbackController'}
      }
    })


    .state('resetform', {
      url: '/reset/:uuid',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/reset-form.html', controller: 'passwordResetController'},
      }
    })


    .state('reset', {
      url: '/reset',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/reset.html', controller: 'accountController'}
      }
    })


    .state('about', {
      url: '/about',
      views: {
        'navbar': { templateUrl: 'partials/navbar.html', controller: 'homeController' },
        'content': { templateUrl: 'partials/about.html'}
      }
    });


  });



  app.factory('Identity', function($http, $resource) {
       //return current ingelogde user
    return $resource('/login', {},{
      query: { method: "GET"}
    });

  });

  /*
  app.factory('IdentityProvider', function($http, $q) {

    //check of een e-mail adres bestaat

    var IdentityProvider = function(username) {
      this.username = username;
      this.profile = null;

    };

    //return current ingelogde user
    return $resource('/login', {},{
      query: { method: "GET" }
    });

  });
*/

 app.factory('Food', function ($resource) {
   return $resource('/food',{}, {
   query: { method: "GET" }
   });
  });


  app.controller('profileController', function ($scope, Identity, $location) {

    $scope.name = "";
    $scope.email = "";

    Identity.query(function(result) {
      $scope.name = result.user.firstname;
      $scope.email = result.user.username;
    }, function (error) {
      $location.path('/');
    });
  });



  app.controller('homeController', function ($scope, $http, Food, Identity) {

   Food.query(function(result) {
     $scope.foods = result.food;
   });

    $scope.name = "";
    $scope.isAuthenticated = false;

    $http.get('/login').success(function(data){
      if(data.success) {
        $scope.name = data.user.firstname;
        $scope.isAuthenticated = true;
      }
    }).error(function(err) {
      console.log(err);
    });

  });

app.controller('feedbackController', function($scope,$stateParams) {

    $scope.message = "";

      if($stateParams.message === "noresetrecord") {
      $scope.message = "Nothing to reset anymore";
    }

     if($stateParams.message === "thanksforregistering") {
      $scope.message = "Thanks for registering! You can proceed to logon.";
    }

     if($stateParams.message === "forgotmessage") {
      $scope.message = "Check your e-mail quickly! Click the link to reset your password.";
    }


    });



  app.controller('passwordResetController', function($scope,$location,$http,$stateParams) {

    $http.get('/reset/' + $stateParams.uuid).then(function(response) {
      console.log(response);

      if(!response.data.success) {
        $location.path('/feedback/noresetrecord');
      }

    });

    $scope.reset = function() {
      $http.post('/reset/', $scope.formData).then(function(response) {
        if (response.data.success) {
          $location.path('/');
        } else {
          $scope.msg = "nothing to do for you!";
        }
      });
    };



  });


  app.controller('accountController', function ($scope,$location,$http,$stateParams) {
    $scope.formData = {};
    $scope.msg = "";
    $scope.formData.uuid = $stateParams.uuid;



    //register
    $scope.register = function () {

      $http.post('/register', $scope.formData).then(function (response) {
        if (response.data.success) {
          $location.path('/feedback/thanksforregistering');

        } else {
          $scope.msg = "user already exists";
        }

      });
    };
    //login

    $scope.login = function () {

       $http.post('/login',$scope.formData).then(function(response) {
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

      $http.post('/forgot', $scope.formData).then(function(response) {
        if (response.data.success) {
          $location.path('/feedback/forgotmessage');
        } else {
          $scope.msg = "user does not exist";
        }
      });
    };

  });
