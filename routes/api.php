<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PlantaoController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => 'Funcionando']);
});

// --- Rotas do quadro ---
Route::get('/user/ativos', [UserController::class, 'getAtivos']);
Route::get('/user/tipo/{tipo}', [UserController::class, 'getPorTipo']);
Route::get('/user/especialidade/{especialidade}', [UserController::class, 'getPorEspecialidade']);

// --- Rotas de usuário ---
Route::post('/user', [UserController::class, 'store']);
Route::get('/user', [UserController::class, 'getAll']);
Route::get('/user/{id}', [UserController::class, 'getById']);
Route::delete('/user/{id}', [UserController::class, 'delete']);
Route::put('/user/{id}', [UserController::class, 'update']);

// Rotas de plantões
Route::post('/plantao', [PlantaoController::class, 'createPlantao']);
Route::get('/plantao', [PlantaoController::class, 'getAll']);
Route::get('/plantao/periodo', [PlantaoController::class, 'getPorPeriodo']);
Route::get('/plantao/usuario/{userId}', [PlantaoController::class, 'getPorUsuario']);
Route::get('/plantao/{id}', [PlantaoController::class, 'getById']);
Route::put('/plantao/{id}', [PlantaoController::class, 'update']);
Route::delete('/plantao/{id}', [PlantaoController::class, 'delete']);
