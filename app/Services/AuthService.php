<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(array $credenciais)
    {
        $user = User::where('email', $credenciais['email'])->first();

        if (!$user || !Hash::check($credenciais['senha'], $user->senha)) {
            throw new \Exception('Email ou senha incorretos.');
        }

        if (!$user->ativo) {
            throw new \Exception('Este usuário está desativado no sistema.');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}
