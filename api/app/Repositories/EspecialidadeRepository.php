<?php

namespace App\Repositories;

use App\Models\Especialidade;
use Illuminate\Database\Eloquent\Collection;

class EspecialidadeRepository implements EspecialidadeRepositoryInterface
{
    public function all(): Collection
    {
        return Especialidade::all();
    }

    public function create(array $dados): Especialidade
    {
        return Especialidade::create($dados);
    }
}
