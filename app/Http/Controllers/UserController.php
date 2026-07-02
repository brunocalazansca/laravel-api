<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(protected UserService $userService){}

    public function store(StoreUserRequest $request)
    {
        $user = $this->userService->register($request->validated());

        return new UserResource($user);
    }

    public function getAll()
    {
        $users = $this->userService->getAll();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum usuário encontrado.'
            ], 404);
        }

        return UserResource::collection($users);
    }

    public function getById(int $id)
    {
        $user = $this->userService->getById($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        return new UserResource($user);
    }

    public function delete(int $id)
    {
        $deleted = $this->userService->delete($id);

        if (!$deleted) {
            return response()->json([
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        return response()->json([
            'message' => 'Usuário deletado com sucesso.'
        ]);
    }

    public function update(UpdateUserRequest $request, int $id)
    {
        $user = $this->userService->update($id, $request->validated());

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        return new UserResource($user);
    }

    public function getAtivos()
    {
        $users = $this->userService->getAtivos();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum usuário ativo encontrado.'
            ], 404);
        }

        return UserResource::collection($users);
    }

    public function getPorTipo(string $tipo)
    {
        $users = $this->userService->getPorTipo($tipo);

        if ($users->isEmpty()) {
            return response()->json([
                'message' => "Nenhum usuário do tipo '{$tipo}' encontrado."
            ], 404);
        }

        return UserResource::collection($users);
    }

    public function getPorEspecialidade(string $especialidade)
    {
        $users = $this->userService->getPorEspecialidade($especialidade);

        if ($users->isEmpty()) {
            return response()->json([
                'message' => "Nenhum usuário da especialidade '{$especialidade}' encontrado."
            ], 404);
        }

        return UserResource::collection($users);
    }
}
