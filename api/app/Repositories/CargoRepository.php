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
}
