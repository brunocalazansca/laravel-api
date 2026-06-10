<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function create(array $dados): User
    {
        return User::create($dados);
    }

    public function all(): Collection
    {
        return User::all();
    }
}
