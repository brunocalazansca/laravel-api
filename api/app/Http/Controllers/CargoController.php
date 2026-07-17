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
}
