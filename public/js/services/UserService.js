angular.module('socialMediaApp')
    .service('UserService', function($http) {
        this.getCurrentUser = function() {
            return $http.get('/api/user');
        };
    });