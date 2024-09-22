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
                controller: 'PostController'
            })
            .otherwise({
                redirectTo: '/login'
            });

        // Configure XSRF
        $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

        // Add authentication interceptor
        $httpProvider.interceptors.push('AuthInterceptor');
    });