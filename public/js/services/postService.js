angular.module('socialMediaApp')
    .service('PostService', function($http) {
        this.getPosts = function() {
            return $http.get('/api/posts').then(function(response) {
                // Process the posts to ensure picture URLs are correct
                response.data = response.data.map(function(post) {
                    if (post.picture && !post.picture.startsWith('http')) {
                        post.picture = '/storage/' + post.picture;
                    }
                    return post;
                });
                return response;
            });
        };

        this.createPost = function(post) {
            var formData = new FormData();
            formData.append('content', post.content);
            
            if (post.picture) {
                formData.append('picture', post.picture);
            }

            return $http.post('/api/posts', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        this.updatePost = function(postId, post) {
            return $http.put('/api/posts/' + postId, post);
        };

        this.deletePost = function(postId) {
            return $http.delete('/api/posts/' + postId);
        };

        this.getCurrentUserProfile = function() {
            return $http.get('/api/current-user-profile');
        };



        this.toggleLike = function(postId) {
            return $http.post('/api/posts/' + postId + '/toggle-like');
        };
    
        this.getComments = function(postId) {
            return $http.get('/api/posts/' + postId + '/comments')
                .then(function(response) {
                    console.log('Raw response from server:', response);
                    return response.data.comments;  // Make sure we're returning the comments array
                });
        };
        
    
        this.addComment = function(postId, comment) {
            return $http.post('/api/posts/' + postId + '/comments', comment);
        };
    
        this.deleteComment = function(commentId) {
            return $http.delete('/api/comments/' + commentId);
        };
    });