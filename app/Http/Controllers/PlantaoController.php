<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlantaoRequest;
use App\Http\Requests\UpdatePlantaoRequest;
use App\Http\Resources\PlantaoResource;
use App\Services\PlantaoService;
use Illuminate\Http\Request;

class PlantaoController extends Controller
{
    public function __construct(protected PlantaoService $plantaoService){}

    public function createPlantao(StorePlantaoRequest $request)
    {
        try {
            $plantao = $this->plantaoService->create($request->validated());

            return response()->json(new PlantaoResource($plantao), 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }

    public function getAll()
    {
        $plantoes = $this->plantaoService->getAll();

        if ($plantoes->isEmpty()) {
            return response()->json(['message' => 'Nenhum plantão encontrado.'], 404);
        }

        return PlantaoResource::collection($plantoes);
    }

    public function getById(int $id)
    {
        $plantao = $this->plantaoService->getById($id);

        if (!$plantao) {
            return response()->json(['message' => 'Plantão não encontrado.'], 404);
        }

        return new PlantaoResource($plantao);
    }

    public function update(UpdatePlantaoRequest $request, int $id)
    {
        try {
            $plantao = $this->plantaoService->update($id, $request->validated());

            if (!$plantao) {
                return response()->json(['message' => 'Plantão não encontrado.'], 404);
            }

            return new PlantaoResource($plantao);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }

    public function delete(int $id)
    {
        $deleted = $this->plantaoService->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Plantão não encontrado.'], 404);
        }

        return response()->json(['message' => 'Plantão deletado com sucesso.']);
    }

    public function getPorPeriodo(Request $request)
    {
        $dataInicio = $request->query('inicio');
        $dataFim = $request->query('fim');

        if (!$dataInicio || !$dataFim) {
            return response()->json([
                'message' => 'As datas de início e fim são obrigatórias.'
            ], 400);
        }

        $plantoes = $this->plantaoService->getPlantoesPorPeriodo($dataInicio, $dataFim);

        if($plantoes->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum plantão encontrado para o período informado.'
            ], 404);
        }

        return PlantaoResource::collection($plantoes);
    }

    public function getPorUsuario(int $userId)
    {
        $plantoes = $this->plantaoService->getPlantoesDoUsuario($userId);

        if ($plantoes->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum plantão encontrado para este usuário.'
            ], 404);
        }

        return PlantaoResource::collection($plantoes);
    }
}
