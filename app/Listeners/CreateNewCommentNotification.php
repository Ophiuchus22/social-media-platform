<?php

namespace App\Listeners;

use App\Events\NewComment;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateNewCommentNotification
{
    public function handle(NewComment $event)
    {
        Notification::create([
            'user_id' => $event->comment->post->user_id,
            'post_id' => $event->comment->post_id,
            'type' => 'comment',
            'is_read' => false,
        ]);

        // Broadcast the event to the user
        broadcast(new NewComment($event->comment));
    }
}
