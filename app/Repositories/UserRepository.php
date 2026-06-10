<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function create(array $dados): User
    {
        return User::create($dados);
    }
}
