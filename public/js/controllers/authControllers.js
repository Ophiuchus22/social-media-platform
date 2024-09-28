angular.module('socialMediaApp')
    .controller('LoginController', function($scope, $http, $location, AuthService) {
        $scope.login = function() {
            console.log('Attempting to log in with:', $scope.user);
            $http.post('/api/login', $scope.user)
                .then(function(response) {
                    AuthService.setToken(response.data.token);
                    $scope.successMessage = "Login successful! Redirecting...";
                    $scope.messageVisible = true;  // Show the message
                    setTimeout(() => {
                        $location.path('/posts');
                        // Reset messages after redirection
                        $scope.successMessage = '';
                        $scope.errorMessage = '';
                        $scope.messageVisible = false;
                        $scope.$apply(); // Apply the scope changes
                    }, 2000); // Redirect after 2 seconds
                }, function(error) {
                    console.error('Login failed', error);
                    $scope.errorMessage = 'Login failed: ' + (error.data.message || 'Please try again.');
                    $scope.messageVisible = true;  // Show the message
                    // Automatically hide error message after 5 seconds
                    setTimeout(() => {
                        $scope.errorMessage = '';
                        $scope.messageVisible = false;
                        $scope.$apply(); // Apply the scope changes
                    }, 5000); // Hide after 5 seconds
                });
        };
    })
    .controller('RegisterController', function($scope, $http, $location, AuthService) {
        $scope.user = {};
        $scope.register = function() {
            console.log('Attempting to register with:', $scope.user);
            $http.post('/api/register', $scope.user)
                .then(function(response) {
                    console.log('Registration successful:', response.data);
                    AuthService.setToken(response.data.token);
                    $scope.successMessage = "Registration successful! Redirecting...";
                    $scope.messageVisible = true;  // Show the message
                    setTimeout(() => {
                        $location.path('/posts');
                        // Reset messages after redirection
                        $scope.successMessage = '';
                        $scope.errorMessage = '';
                        $scope.messageVisible = false;
                        $scope.$apply(); // Apply the scope changes
                    }, 2000); // Redirect after 2 seconds
                }, function(error) {
                    console.error('Registration failed', error);
                    $scope.errorMessage = 'Registration failed: ' + (error.data.message || 'Please try again.');
                    $scope.messageVisible = true;  // Show the message
                    // Automatically hide error message after 5 seconds
                    setTimeout(() => {
                        $scope.errorMessage = '';
                        $scope.messageVisible = false;
                        $scope.$apply(); // Apply the scope changes
                    }, 5000); // Hide after 5 seconds
                });
        };
    });
