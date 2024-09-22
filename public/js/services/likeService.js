angular.module('socialMediaApp')
    .service('LikeService', function($http) {
        this.toggleLike = function(postId) {
            return $http.post('/api/posts/' + postId + '/toggle-like');
        };
    });