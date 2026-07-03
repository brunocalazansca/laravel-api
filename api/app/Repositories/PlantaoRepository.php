<?php

namespace App\Repositories;

use App\Models\Plantao;
use Illuminate\Database\Eloquent\Collection;

class PlantaoRepository implements PlantaoRepositoryInterface
{
    public function create(array $dados): Plantao
    {
        return Plantao::create($dados);
    }

    public function all(): Collection
    {
        return Plantao::with('user')->get();
    }

    public function findById(int $id): ?Plantao
    {
        return Plantao::with('user')->find($id);
    }

    public function update(int $id, array $dados): ?Plantao
    {
        $plantao = Plantao::find($id);

        if (!$plantao) {
            return null;
        }

        $plantao->update($dados);

        return $plantao;
    }

    public function delete(int $id): bool
    {
        return Plantao::destroy($id) > 0;
    }

    public function existeChoqueHorario(int $userId, string $data, string $horaInicio, string $horaFim): bool
    {
        return Plantao::where('user_id', $userId)
            ->where('data', $data)
            ->where(function ($query) use ($horaInicio, $horaFim) {
                $query->where('hora_inicio', '<', $horaFim)
                    ->where('hora_fim', '>', $horaInicio);
            })
            ->exists();
    }

    public function getPorPeriodo(string $dataInicio, string $dataFim): Collection
    {
        return Plantao::with('user')
            ->whereBetween('data', [$dataInicio, $dataFim])
            ->orderBy('data', 'asc')
            ->orderBy('hora_inicio', 'asc')
            ->get();
    }

    public function getPorUsuario(int $userId): Collection
    {
        return Plantao::with('user')
            ->where('user_id', $userId)
            ->orderBy('data', 'desc')
            ->orderBy('hora_inicio', 'desc')
            ->get();
    }
}
