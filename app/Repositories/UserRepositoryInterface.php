<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function create(array $dados): User;
    public function all(): Collection;
    public function findById($id): ?User;
    public function delete($id): bool;
    public function update(int $id, array $dados): ?User;
}
