angular.module('socialMediaApp')
    .controller('MainController', function($scope, $location, $http, AuthService) {
        $scope.userName = '';

        function fetchUserData() {
            if (AuthService.isAuthenticated()) {
                $http.get('/api/user', {
                    headers: {
                        'Authorization': 'Bearer ' + AuthService.getToken()
                    }
                }).then(function(response) {
                    $scope.userName = response.data.name;
                }).catch(function(error) {
                    console.error('Error fetching user data:', error);
                    if (error.status === 401) {
                        AuthService.logout();
                        $location.path('/login');
                    }
                });
            }
        }

        $scope.$on('$routeChangeSuccess', function() {
            fetchUserData();
        });

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
                AuthService.logout();
                $location.path('/login');
            });
        };
    });
