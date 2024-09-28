angular.module('socialMediaApp')
    .controller('PostController', function($scope, PostService, CommentService, LikeService, $location, $timeout) {
        $scope.posts = [];
        $scope.newPost = {};
        $scope.successMessage = '';
        $scope.errorMessage = '';
        $scope.messageVisible = false;
        $scope.userProfilePicture = '';

        $scope.loadCurrentUserProfile = function() {
            PostService.getCurrentUserProfile()
                .then(function(response) {
                    $scope.userProfilePicture = response.data.profile_picture;
                })
                .catch(function(error) {
                    console.error('Error loading user profile:', error);
                    $scope.userProfilePicture = '/logo/default.png';
                });
        };

        // Display the alert message and automatically hide it after 5 seconds
        $scope.showMessage = function(message, isSuccess) {
            $scope.successMessage = isSuccess ? message : '';
            $scope.errorMessage = !isSuccess ? message : '';
            $scope.messageVisible = true;

            // Automatically hide the message after 5 seconds
            $timeout(function() {
                $scope.messageVisible = false;
            }, 3000);
        };

        $scope.goToPosts = function() {
            $location.path('/posts');
            $scope.loadPosts(); // Reload posts when navigating to the page
        };

        $scope.randomKey = Date.now();  // Initialize with the current timestamp

        // After you upload a new profile picture or create a new post, update the key
        $scope.updateProfilePicture = function() {
            // Update the user profile picture with a fresh key to bypass the cache
            $scope.userProfilePicture = "/path/to/new/profile_picture.jpg";
            $scope.randomKey = Date.now();  // Refresh the random key
        };


        $scope.loadPosts = function() {
            PostService.getPosts()
                .then(function(response) {
                    $scope.posts = response.data.map(function(post) {
                        post.likes_count = post.likes_count || 0;
                        post.is_liked = post.is_liked || false;
                        post.created_at = new Date(post.created_at);
                        post.editing = false; // Initialize editing state
                        post.showCommentBox = false;
                        post.user.profile_picture = post.user.profile_picture || '/logo/default.png';
                        return post;
                    });
                    // // Set the current user's profile picture
                    // if ($scope.posts.length > 0 && $scope.posts[0].user) {
                    //     $scope.userProfilePicture = $scope.posts[0].user.profile_picture;
                    // }
                })
                .catch(function(error) {
                    console.error('Error loading posts:', error);
                    $scope.showMessage('Failed to load posts. Please try again.', false);
                });
        };

        $scope.loadCurrentUserProfile();

        // Create post
        $scope.createPost = function() {
            PostService.createPost($scope.newPost)
                .then(function(response) {
                    var newPost = response.data;
                    newPost.editing = false;
                    newPost.likes_count = newPost.likes_count || 0;
                    newPost.is_liked = newPost.is_liked || false;
                    $scope.posts.unshift(newPost);
                    $scope.newPost = {}; // Reset input
                   
                    // Reload posts to update the profile picture and other data
                    $scope.loadPosts();
                    $scope.showMessage('Post created successfully!', true);
                })
                .catch(function(error) {
                    console.error('Error creating post:', error);
                    $scope.showMessage('Failed to create post. Please try again.', false);
                });
        };

        // Toggle editing mode
        $scope.editPost = function(post) {
            post.editing = !post.editing;
        };

        // Update post
        $scope.updatePost = function(post) {
            PostService.updatePost(post.id, post)
                .then(function(response) {
                    var index = $scope.posts.findIndex(p => p.id === post.id);
                    $scope.posts[index] = Object.assign({}, $scope.posts[index], response.data);
                    post.editing = false; // Exit editing mode after saving
                    $scope.showMessage('Post updated successfully!', true);
                })
                .catch(function(error) {
                    console.error('Error updating post:', error);
                    $scope.showMessage('Failed to update post. You may not have permission to edit this post.', false);
                });
        };

        // Delete post
        $scope.deletePost = function(post) {
            PostService.deletePost(post.id)
                .then(function() {
                    var index = $scope.posts.indexOf(post);
                    $scope.posts.splice(index, 1);
                    $scope.showMessage('Post deleted successfully!', true);
                })
                .catch(function(error) {
                    console.error('Error deleting post:', error);
                    $scope.showMessage('Failed to delete post. Please try again.', false);
                });
        };

        // Toggle the comment box visibility
        $scope.toggleCommentBox = function(post) {
            post.showCommentBox = !post.showCommentBox;
        };

        // Add comment
        $scope.addComment = function(post) {
            if (!post.newComment) return;
            CommentService.addComment(post.id, { content: post.newComment })
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

        // Delete comment
        $scope.deleteComment = function(post, comment) {
            console.log('Deleting comment with ID:', comment.id);
            CommentService.deleteComment(comment.id)
                .then(function() {
                    var index = post.comments.indexOf(comment);
                    post.comments.splice(index, 1);
                    $scope.showMessage('Comment deleted successfully!', true); // Show success message
                })
                .catch(function(error) {
                    console.error('Error deleting comment:', error);
                    $scope.showMessage('Failed to delete comment. Please try again.', false); // Show error message
                });
        };

        // Toggle like
        $scope.toggleLike = function(post) {
            LikeService.toggleLike(post.id)
                .then(function(response) {
                    post.likes_count = response.data.likes_count;
                    post.is_liked = response.data.is_liked;
                })
                .catch(function(error) {
                    console.error('Error toggling like:', error);
                    $scope.showMessage('Failed to toggle like. Please try again.', false);
                });
        };

        // Load posts on init
        $scope.loadPosts();
    });
