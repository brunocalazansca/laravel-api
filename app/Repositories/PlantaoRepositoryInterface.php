<?php

namespace App\Repositories;

use App\Models\Plantao;
use Illuminate\Database\Eloquent\Collection;

interface PlantaoRepositoryInterface
{
    public function create(array $dados): Plantao;
    public function all(): Collection;
    public function findById(int $id): ?Plantao;
    public function update(int $id, array $dados): ?Plantao;
    public function delete(int $id): bool;
    public function existeChoqueHorario(int $userId, string $data, string $horaInicio, string $horaFim): bool;
    public function getPorPeriodo(string $dataInicio, string $dataFim): Collection;
    public function getPorUsuario(int $userId): Collection;
}
