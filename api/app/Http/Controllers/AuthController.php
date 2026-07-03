<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService){}

    public function login(LoginRequest $request)
    {
        try {
            $resultado = $this->authService->login($request->validated());

            return response()->json([
                'message' => 'Login realizado com sucesso',
                'access_token' => $resultado['token'],
                'token_type' => 'Bearer',
                'user' => new UserResource($resultado['user'])
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }
    }
}
