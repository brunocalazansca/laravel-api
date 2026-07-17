<?php

namespace App\Services;

use App\Repositories\EspecialidadeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EspecialidadeService
{
    public function __construct(protected EspecialidadeRepositoryInterface $especialidadeRepository) {}

    public function getAll(): Collection
    {
        return $this->especialidadeRepository->all();
    }

    public function create(array $dados): \App\Models\Especialidade
    {
        return $this->especialidadeRepository->create($dados);
    }
}
