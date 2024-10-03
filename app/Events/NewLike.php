<?php

namespace App\Events;

use App\Models\Like;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NewLike implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $like;

    public function __construct(Like $like)
    {
        $this->like = $like;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('private-user.' . $this->like->post->user->id);
    }

    public function broadcastWith()
    {
        return [
            'like' => $this->like,
            'message' => 'Your post was liked!'
        ];
    }
}
