<?php

namespace App\Listeners;

use App\Events\NewPost;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateNewPostNotification
{
    public function handle(NewPost $event)
    {
        Notification::create([
            'user_id' => $event->post->user_id,
            'post_id' => $event->post->id,
            'type' => 'post',
            'is_read' => false,
        ]);

        // Broadcast the event to the user
        broadcast(new NewPost($event->post));
    }
}
