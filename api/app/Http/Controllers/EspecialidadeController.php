<?php

namespace App\Http\Controllers;

use App\Services\EspecialidadeService;
use Illuminate\Http\Request;

class EspecialidadeController extends Controller
{
    public function __construct(protected EspecialidadeService $especialidadeService) {}

    public function getAll()
    {
        return response()->json(['data' => $this->especialidadeService->getAll()]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->tipo !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $request->validate(['nome' => 'required|string|max:100|unique:especialidades,nome']);

        $especialidade = $this->especialidadeService->create($request->only('nome'));

        return response()->json(['data' => $especialidade], 201);
    }

    public function update(Request $request, int $id)
    {
        if ($request->user()->tipo !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $request->validate(['nome' => 'required|string|max:100|unique:especialidades,nome,' . $id]);

        $especialidade = $this->especialidadeService->update($id, $request->only('nome'));

        return response()->json(['data' => $especialidade]);
    }

    public function destroy(Request $request, int $id)
    {
        if ($request->user()->tipo !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $this->especialidadeService->delete($id);

        return response()->json(null, 204);
    }
}
