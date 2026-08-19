<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCargoRequest;
use App\Services\CargoService;
use Illuminate\Http\Request;

class CargoController extends Controller
{
    public function __construct(protected CargoService $cargoService) {}

    public function getAll()
    {
        return response()->json(['data' => $this->cargoService->getAll()]);
    }

    public function store(StoreCargoRequest $request)
    {
        $user = $request->user();

        if ($user->tipo !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $cargo = $this->cargoService->create($request->validated());

        return response()->json(['data' => $cargo], 201);
    }

    public function update(Request $request, int $id)
    {
        if ($request->user()->tipo !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $request->validate(['nome' => 'required|string|max:100|unique:cargos,nome,' . $id]);

        $cargo = $this->cargoService->update($id, $request->only('nome'));

        return response()->json(['data' => $cargo]);
    }

    public function destroy(Request $request, int $id)
    {
        if ($request->user()->tipo !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $this->cargoService->delete($id);

        return response()->json(null, 204);
    }
}
