<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\NewPost;
use App\Events\NewComment;
use App\Events\NewLike;
use App\Listeners\CreateNewPostNotification;
use App\Listeners\CreateNewCommentNotification;
use App\Listeners\CreateNewLikeNotification;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        NewPost::class => [
            CreateNewPostNotification::class,
        ],
        NewLike::class => [
            CreateNewLikeNotification::class,
        ],
        NewComment::class => [
            CreateNewCommentNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}