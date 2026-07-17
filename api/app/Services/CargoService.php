<?php

namespace App\Services;

use App\Repositories\CargoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CargoService
{
    public function __construct(protected CargoRepositoryInterface $cargoRepository) {}

    public function getAll(): Collection
    {
        return $this->cargoRepository->all();
    }

    public function create(array $dados): \App\Models\Cargo
    {
        return $this->cargoRepository->create($dados);
    }
}
