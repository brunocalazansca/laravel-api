<?php

namespace App\Repositories;

use App\Models\Cargo;
use Illuminate\Database\Eloquent\Collection;

interface CargoRepositoryInterface
{
    public function all(): Collection;
    public function create(array $dados): Cargo;
}
