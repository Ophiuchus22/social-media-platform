<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Post;

class UserController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $posts = Post::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();

        // Ensure full URL for the profile picture if it exists
        if ($user->profile_picture) {
            $user->profile_picture = asset('storage/profile_pictures/' . $user->profile_picture);
        } else {
            // Provide a default profile picture if none is available
            $user->profile_picture = asset('storage/profile_pictures/default.png');
        }

        return response()->json([
            'user' => $user,
            'posts' => $posts
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'bio' => 'nullable|string|max:1000',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->bio = $request->bio;

        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_picture) {
                Storage::delete('public/profile_pictures/' . $user->profile_picture);
            }

            $fileName = time() . '.' . $request->profile_picture->extension();
            $request->profile_picture->storeAs('public/profile_pictures', $fileName);
            $user->profile_picture = $fileName;
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'picture' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $post = new Post($request->only(['content']));
        $post->user_id = auth()->id();

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('post_pictures', 'public');
            $post->picture = $path;
        }

        $post->save();

        return response()->json($post->load('user'), 201);
    }
}