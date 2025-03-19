<?php

namespace App\Http\Controllers\Api;
use App\Factories\ApiResponseFactory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    /**
     * Login endpoint that verifies credentials against the token-authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request) : JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        /** @var User $user */
        $user = Auth::user();

        if ($user->getEmail() !== $request->input('email')) {
            return ApiResponseFactory::error('Unauthorized. Email does not match the authenticated user.',401);
        }

        if (!Hash::check($request->input('password'), $user->getPassword())) {
            return ApiResponseFactory::error('Unauthorized. Password does not match the authenticated user.',401);
        }

        return ApiResponseFactory::success($user);
    }
}
