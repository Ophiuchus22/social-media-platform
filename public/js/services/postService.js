angular.module('socialMediaApp')
    .service('PostService', function($http) {
        this.getPosts = function() {
            return $http.get('/api/posts');
        };

        this.createPost = function(post) {
            return $http.post('/api/posts', post);
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

        

        this.likePost = function(postId) {
            return $http.post('/api/posts/' + postId + '/like');
        };
    
        this.getComments = function(postId) {
            return $http.get('/api/posts/' + postId + '/comments');
        };
    
        this.addComment = function(postId, comment) {
            return $http.post('/api/posts/' + postId + '/comments', comment);
        };
    
        this.deleteComment = function(postId, commentId) {
            return $http.delete('/api/posts/' + postId + '/comments/' + commentId);
        };
    });