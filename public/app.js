angular.module('socialMediaApp', ['ngRoute'])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/login'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            })
            .when('/posts', {
                templateUrl: 'templates/posts.html',
                controller: 'PostController',
                resolve: {
                    auth: function(AuthService, $location) {
                        return AuthService.isAuthenticated() || $location.path('/login');
                    }
                }
            })
            .when('/profile', {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileController',
                resolve: {
                    auth: function(AuthService, $location) {
                        return AuthService.isAuthenticated() || $location.path('/login');
                    }
                }
            })
            .otherwise({
                redirectTo: '/login'
            });

        // Configure XSRF
        $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

        // Add authentication interceptor
        $httpProvider.interceptors.push('AuthInterceptor');
    })
    .run(function($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.$$route && next.$$route.resolve && next.$$route.resolve.auth) {
                if (!AuthService.isAuthenticated()) {
                    $location.path('/login');
                }
            }
        });
    });