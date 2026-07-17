<?php

namespace App\Repositories;

use App\Models\Especialidade;
use Illuminate\Database\Eloquent\Collection;

interface EspecialidadeRepositoryInterface
{
    public function all(): Collection;
    public function create(array $dados): Especialidade;
}
