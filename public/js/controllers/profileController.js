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
                    // Load comments for each post
                    $scope.posts.forEach(function(post) {
                        $scope.loadComments(post);
                    });
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
                    // $scope.user = response.data.user;
                    $scope.isEditing = false;
                    $scope.showMessage('Profile updated successfully', true);
                    $scope.loadProfile();
                    $scope.closeModal();
                })
                .catch(function(error) {
                    console.error('Error updating profile:', error);
                    $scope.showMessage('Failed to update profile. Please try again.', false);
                });
        };

        $scope.onFileSelect = function(files) {
            $scope.profilePicture = files[0];
        };

        // Update modal handling functions
        $scope.openModal = function() {
            $('#editProfileModal').modal('show');
        };

        $scope.closeModal = function() {
            $('#editProfileModal').modal('hide');
            $scope.isEditing = false;
        };
        
        $scope.toggleEdit = function() {
            if ($scope.isEditing) {
                $scope.closeModal();
            } else {
                $scope.isEditing = true;
                $scope.openModal();
            }
        };    

        // Add event listener for modal hidden event
        angular.element(document).ready(function () {
            $('#editProfileModal').on('hidden.bs.modal', function () {
                $scope.$apply(function() {
                    $scope.isEditing = false;
                });
            });
        });

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
            PostService.toggleLike(post.id)
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
                    // Ensure post.comments is an array
                    if (!Array.isArray(post.comments)) {
                        post.comments = [];  // Initialize as an empty array
                    }
                    post.comments.push(response.data);  // Add the new comment
                    post.newComment = '';  // Clear the comment input
                    post.showComments = true;  // Ensure comments are visible
                })
                .catch(function(error) {
                    console.error('Error adding comment:', error);
                    $scope.showMessage('Failed to add comment. Please try again.', false);
                });
          };              
      
          $scope.deleteComment = function(post, comment) {
            PostService.deleteComment(comment.id)
                .then(function() {
                    var index = post.comments.indexOf(comment);
                    post.comments.splice(index, 1);
                    $scope.showMessage('Post deleted successfully!', true);
                })
                .catch(function(error) {
                    console.error('Error deleting comment:', error);
                    $scope.showMessage('Failed to delete comment. Please try again.', false);
                });
         };  
         
         $scope.loadComments = function(post) {
            PostService.getComments(post.id)
                .then(function(comments) {
                    console.log('Comments loaded for post:', post.id, comments);
                    post.comments = comments || [];
                    post.showComments = true;
                    console.log('Post comments after loading:', post.comments);
                })
                .catch(function(error) {
                    console.error('Error loading comments for post:', post.id, error);
                    $scope.showMessage('Failed to load comments. Please try again.', false);
                });
        };         

        // Load profile on init
        $scope.loadProfile();
    });
