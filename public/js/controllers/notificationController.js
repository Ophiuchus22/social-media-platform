angular.module('socialMediaApp')
    .controller('NotificationController', function($scope, NotificationService, $pusher) {
        $scope.notifications = [];

        $scope.loadNotifications = function() {
            NotificationService.getNotifications()
                .then(function(response) {
                    $scope.notifications = response.data;
                });
        };

        $scope.markAsRead = function(notification) {
            NotificationService.markAsRead(notification.id)
                .then(function() {
                    notification.is_read = true;
                });
        };

        $scope.deleteNotification = function(notification) {
            NotificationService.deleteNotification(notification.id)
                .then(function() {
                    var index = $scope.notifications.indexOf(notification);
                    $scope.notifications.splice(index, 1);
                });
        };

        // Initialize Pusher
        var pusher = $pusher(new Pusher('8a5955dbdf2f0cd9eeb5', {
            cluster: 'ap1'
        }));

        var channel = pusher.subscribe('private-user.' + userId);

        channel.bind('new-notification', function(data) {
            $scope.notifications.unshift(data.notification);
            $scope.$apply();
        });

        $scope.loadNotifications();
    });