angular.module('socialMediaApp')
    .controller('MainController', function($scope, $location, $http, AuthService) {
        $scope.logout = function() {
            $http.post('/api/logout', {}, {
                headers: {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                }
            }).then(function() {
                AuthService.logout();
                $location.path('/login');
            }).catch(function(error) {
                console.error('Logout failed', error);
                // Optionally, still logout on the client-side even if the server request fails
                AuthService.logout();
                $location.path('/login');
            });
        };
    });