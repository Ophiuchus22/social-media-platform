angular.module('socialMediaApp')
    .controller('ProfileController', function($scope, ProfileService, $location, $timeout) {
        $scope.user = {};
        $scope.posts = [];
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.messageVisible = false;
        $scope.isEditing = false;

        $scope.loadProfile = function() {
            ProfileService.getProfile()
                .then(function(response) {
                    console.log('Profile loaded:', response.data);
                    $scope.user = response.data.user;
                    $scope.posts = response.data.posts;
                })
                .catch(function(error) {
                    console.error('Error loading profile:', error);
                    $scope.showMessage('Failed to load profile. Please try again.', false);
                });
        };

        $scope.$on('$routeChangeSuccess', function() {
            $scope.loadProfile();
        });

        $scope.updateProfile = function() {
            var formData = new FormData();
            formData.append('name', $scope.user.name);
            formData.append('email', $scope.user.email);
            formData.append('bio', $scope.user.bio);
            if ($scope.profilePicture) {
                formData.append('profile_picture', $scope.profilePicture);
            }

            ProfileService.updateProfile(formData)
                .then(function(response) {
                    $scope.user = response.data.user;
                    $scope.isEditing = false;
                    $scope.showMessage('Profile updated successfully', true);
                })
                .catch(function(error) {
                    console.error('Error updating profile:', error);
                    $scope.showMessage('Failed to update profile. Please try again.', false);
                });
        };

        $scope.onFileSelect = function(files) {
            $scope.profilePicture = files[0];
        };

        $scope.toggleEdit = function() {
            $scope.isEditing = !$scope.isEditing;
        };

        $scope.goToPosts = function() {
            $location.path('/posts');
        };

        $scope.showMessage = function(message, isSuccess) {
            $scope.successMessage = isSuccess ? message : '';
            $scope.errorMessage = !isSuccess ? message : '';
            $scope.messageVisible = true;

            // Automatically hide the message after 5 seconds
            $timeout(function() {
                $scope.messageVisible = false;
            }, 3000);
        };

        // Load profile on init
        $scope.loadProfile();
    });
