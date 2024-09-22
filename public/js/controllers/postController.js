angular.module('socialMediaApp')
    .controller('PostController', function($scope, PostService, CommentService, LikeService) {
        $scope.posts = [];
        $scope.newPost = {};

        $scope.loadPosts = function() {
            PostService.getPosts()
                .then(function(response) {
                    $scope.posts = response.data.map(function(post) {
                        post.likes_count = post.likes_count || 0;
                        post.is_liked = post.is_liked || false;
                        return post;
                    });
                })
                .catch(function(error) {
                    console.error('Error loading posts:', error);
                    $scope.errorMessage = 'Failed to load posts. Please try again.';
                });
        };

        $scope.createPost = function() {
            console.log('Creating post with content:', $scope.newPost.content);
            PostService.createPost($scope.newPost)
                .then(function(response) {
                    $scope.posts.unshift(response.data);
                    $scope.newPost = {}; // Reset input
                })
                .catch(function(error) {
                    console.error('Error creating post:', error);
                    $scope.errorMessage = 'Failed to create post. Please try again.';
                });
        };

        $scope.updatePost = function(post) {
            PostService.updatePost(post.id, post)
                .then(function(response) {
                    var index = $scope.posts.findIndex(p => p.id === post.id);
                    $scope.posts[index] = response.data;
                });
        };

        $scope.deletePost = function(post) {
            PostService.deletePost(post.id)
                .then(function() {
                    var index = $scope.posts.indexOf(post);
                    $scope.posts.splice(index, 1);
                });
        };

        $scope.addComment = function(post) {
            if (!post.newComment) return; // Prevent adding empty comments
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
                    $scope.errorMessage = 'Failed to add comment. Please try again.';
                });
        };
        
        $scope.deleteComment = function(post, comment) {
            CommentService.deleteComment(comment.id)
                .then(function() {
                    var index = post.comments.indexOf(comment);
                    post.comments.splice(index, 1);
                })
                .catch(function(error) {
                    console.error('Error deleting comment:', error);
                });
        };
        

        $scope.errorMessage = '';

        $scope.toggleLike = function(post) {
            LikeService.toggleLike(post.id)
                .then(function(response) {
                    post.likes_count = response.data.likes_count;
                    post.is_liked = response.data.is_liked;
                    $scope.errorMessage = ''; // Clear error message on success
                })
                .catch(function(error) {
                    console.error('Error toggling like:', error);
                    $scope.errorMessage = 'Failed to toggle like. Please try again.'; // Set error message
                });
        };

        $scope.loadPosts();
    });