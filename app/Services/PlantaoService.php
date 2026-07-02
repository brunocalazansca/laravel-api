<?php

namespace App\Services;

use App\Models\Plantao;
use App\Repositories\PlantaoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PlantaoService
{
    public function __construct(protected PlantaoRepositoryInterface $plantaoRepository){}

    public function create(array $dados): Plantao
    {
        $temChoque = $this->plantaoRepository->existeChoqueHorario(
            $dados['user_id'],
            $dados['data'],
            $dados['hora_inicio'],
            $dados['hora_fim']
        );

        if ($temChoque) {
            throw new \Exception('Operação negada: O profissional já possui um plantão neste horário.');
        }

        return $this->plantaoRepository->create($dados);
    }

    public function getAll(): Collection
    {
        return $this->plantaoRepository->all();
    }

    public function getById(int $id): ?Plantao
    {
        return $this->plantaoRepository->findById($id);
    }

    public function update(int $id, array $dados): ?Plantao
    {
        if (isset($dados['data']) || isset($dados['hora_inicio']) || isset($dados['hora_fim']) || isset($dados['user_id'])) {

            $plantaoAtual = $this->plantaoRepository->findById($id);

            if (!$plantaoAtual) {
                throw new \Exception('Plantão não encontrado.');
            }

            $userId = $dados['user_id'] ?? $plantaoAtual->user_id;
            $data = $dados['data'] ?? $plantaoAtual->data->format('Y-m-d');
            $horaInicio = $dados['hora_inicio'] ?? $plantaoAtual->hora_inicio;
            $horaFim = $dados['hora_fim'] ?? $plantaoAtual->hora_fim;

            $temChoque = $this->plantaoRepository->existeChoqueHorario(
                $userId,
                $data,
                $horaInicio,
                $horaFim,
            );

            if ($temChoque) {
                throw new \Exception('Operação negada: O profissional já possui um plantão neste horário.');
            }
        }

        return $this->plantaoRepository->update($id, $dados);
    }

    public function delete(int $id): bool
    {
        return $this->plantaoRepository->delete($id);
    }

    public function getPlantoesPorPeriodo(string $dataInicio, string $dataFim): Collection
    {
        return $this->plantaoRepository->getPorPeriodo($dataInicio, $dataFim);
    }

    public function getPlantoesDoUsuario(int $userId): Collection
    {
        return $this->plantaoRepository->getPorUsuario($userId);
    }
}
