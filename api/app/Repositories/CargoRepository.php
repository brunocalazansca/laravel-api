<?php

namespace App\Repositories;

use App\Models\Cargo;
use Illuminate\Database\Eloquent\Collection;

class CargoRepository implements CargoRepositoryInterface
{
    public function all(): Collection
    {
        return Cargo::all();
    }

    public function create(array $dados): Cargo
    {
        return Cargo::create($dados);
    }

    public function update(int $id, array $dados): Cargo
    {
        $cargo = Cargo::findOrFail($id);
        $cargo->update($dados);
        return $cargo;
    }

    public function delete(int $id): void
    {
        Cargo::findOrFail($id)->delete();
    }
}
