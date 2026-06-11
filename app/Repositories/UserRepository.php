<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function create($dados): User
    {
        return User::create($dados);
    }

    public function all(): Collection
    {
        return User::all();
    }

    public function findById($id): ?User
    {
        return User::find($id);
    }

    public function delete($id): bool
    {
        return User::destroy($id) > 0;
    }

    public function update(int $id, array $dados): ?User
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        $user->update($dados);

        return $user;
    }
}
