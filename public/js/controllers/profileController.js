angular.module('socialMediaApp')
    .controller('ProfileController', function($scope, ProfileService, PostService, $location, $timeout) {
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

        //ANG POOOOOST!!!!!
        $scope.loadPosts = function() {
            PostService.getPosts()
                .then(function(response) {
                    console.log('Posts loaded:', response.data);
                    // Filter posts to only show the current user's posts
                    $scope.posts = response.data.filter(function(post) {
                        return post.user_id === $scope.user.id;
                    });
                })
                .catch(function(error) {
                    console.error('Error loading posts:', error);
                    $scope.showMessage('Failed to load posts. Please try again.', false);
                });
        };

        $scope.$on('$routeChangeSuccess', function() {
            $scope.loadProfile();
        });

        $scope.editPost = function(post) {
            post.editing = true;
            post.editedContent = post.content;
          };
      
          $scope.savePost = function(post) {
            PostService.updatePost(post.id, { content: post.editedContent })
              .then(function(response) {
                post.content = post.editedContent;
                post.editing = false;
                $scope.showMessage('Post updated successfully', true);
              })
              .catch(function(error) {
                $scope.showMessage('Failed to update post. Please try again.', false);
              });
          };
      
          $scope.cancelEdit = function(post) {
            post.editing = false;
          };
      
          $scope.deletePost = function(post) {
            PostService.deletePost(post.id)
            .then(function() {
                $scope.posts = $scope.posts.filter(p => p.id !== post.id);
                $scope.showMessage('Post deleted successfully', true);
            })
            .catch(function(error) {
                console.error('Error deleting post:', error);
                $scope.showMessage('Failed to delete post. Please try again.', false);
            });
            
          };
      
          $scope.toggleLike = function(post) {
            PostService.likePost(post.id)
                .then(function(response) {
                    post.is_liked = response.data.is_liked;
                    post.likes_count = response.data.likes_count;
                })
                .catch(function(error) {
                    console.error('Error toggling like:', error);
                    $scope.showMessage('Failed to toggle like. Please try again.', false);
                });
          };
      
          $scope.addComment = function(post) {
            PostService.addComment(post.id, { content: post.newComment })
                .then(function(response) {
                    if (!post.comments) {
                        post.comments = [];
                    }
                    post.comments.push(response.data);
                    post.newComment = '';
                })
                .catch(function(error) {
                    console.error('Error adding comment:', error);
                    $scope.showMessage('Failed to add comment. Please try again.', false);
                });
          };
      
          $scope.deleteComment = function(post, comment) {
            PostService.deleteComment(post.id, comment.id)
                .then(function() {
                    var index = post.comments.indexOf(comment);
                    post.comments.splice(index, 1);
                })
                .catch(function(error) {
                    console.error('Error deleting comment:', error);
                    $scope.showMessage('Failed to delete comment. Please try again.', false);
                });
          };      

        // Load profile on init
        $scope.loadProfile();
    });
