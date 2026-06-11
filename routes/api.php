<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => 'Funcionando']);
});

Route::post('/user', [UserController::class, 'store']);

Route::get('/user', [UserController::class, 'getAll']);

Route::get('/user/{id}', [UserController::class, 'getById']);

Route::delete('/user/{id}', [UserController::class, 'delete']);

Route::put('/user/{id}', [UserController::class, 'update']);
