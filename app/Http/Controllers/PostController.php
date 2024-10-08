<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\NewPost;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        return Post::with(['user', 'comments.user', 'likes'])
            ->withCount('likes', 'comments')
            ->latest()
            ->get()
            ->map(function ($post) {
                $post->is_liked = $post->likes->contains('user_id', auth()->id());
                $post->can_edit = $post->user_id === auth()->id();
                $post->can_delete = $post->user_id === auth()->id(); 
                $post->user->profile_picture = $this->getProfilePictureUrl($post->user->profile_picture);
                $post->picture = $this->getPostPictureUrl($post->picture);
                $post->comments->each(function ($comment) {
                    $comment->user->profile_picture = $this->getProfilePictureUrl($comment->user->profile_picture);
                });
                return $post;
            });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'picture' => 'nullable|image|max:2048',
        ]);

        $post = new Post($validated);
        $post->user_id = $request->user()->id;

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('post_pictures', 'public');
            $post->picture = $path;
        }

        $post->save();

        //$post = $request->user()->posts()->create($validated);

        // Trigger the NewPost event
        //event(new NewPost($post));

        // Load the post with its relations and add necessary flags
        $post = Post::with('user')
            ->withCount('likes')
            ->findOrFail($post->id);

        $post->can_edit = true; // The creator can always edit their new post
        $post->can_delete = true; // The creator can also delete their new post
        $post->is_liked = false; // A new post is not liked by default

        return $post;
    }

    private function getPostPictureUrl($picture)
    {
        if (!$picture) {
            return null;
        }

        $fullPath = 'post_pictures/' . basename($picture);

        if (Storage::disk('public')->exists($fullPath)) {
            return Storage::disk('public')->url($fullPath);
        }

        return null;
    }

    public function show(Post $post)
    {
        return $post->load('user');
    }

    public function update(Request $request, Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $post->update($validated);

        return $post;
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
         
        if ($post->picture) {
            Storage::disk('public')->delete($post->picture);
        }

        $post->delete();
        return response()->noContent();
    }

    public function getCurrentUserProfile()
    {
        $user = Auth::user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'profile_picture' => $this->getProfilePictureUrl($user->profile_picture)
        ]);
    }

    private function getProfilePictureUrl($profilePicture)
    {
        if (!$profilePicture) {
            return asset('logo/default.png');
        }

        $fullPath = 'profile_pictures/' . basename($profilePicture);

        if (Storage::disk('public')->exists($fullPath)) {
            return Storage::disk('public')->url($fullPath);
        }

        return asset('logo/default.png');
    }

    public function getComments($postId)
    {
        $post = Post::with(['comments.user' => function($query) {
            $query->select('id', 'name', 'profile_picture');
        }])->findOrFail($postId);

        if ($post) {
            $comments = $post->comments->map(function ($comment) {
                $comment->user->profile_picture = $this->getProfilePictureUrl($comment->user->profile_picture);
                return $comment;
            });
            return response()->json(['comments' => $comments]);
        } else {
            return response()->json(['message' => 'Post not found'], 404);
        }
    }

}
