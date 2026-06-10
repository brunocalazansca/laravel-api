<?php

namespace App\Services;

use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(protected UserRepositoryInterface $userRepository){}

    public function register(array $dados) {
        $dados['senha'] = Hash::make($dados['senha']);

        return $this->userRepository->create($dados);
    }

    public function getAll() {
        return $this->userRepository->all();
    }
}
