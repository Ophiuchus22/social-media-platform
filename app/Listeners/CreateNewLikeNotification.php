<?php

namespace App\Listeners;

use App\Events\NewLike;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateNewLikeNotification
{
    public function handle(NewLike $event)
    {
        Notification::create([
            'user_id' => $event->like->post->user_id,
            'post_id' => $event->like->post_id,
            'type' => 'like',
            'is_read' => false,
        ]);

        // Broadcast the event to the user
        broadcast(new NewLike($event->like));
    }
}
