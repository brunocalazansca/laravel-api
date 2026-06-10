<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(protected UserService $userService){}

    public function store(StoreUserRequest $request){
        $user = $this->userService->register($request->validated());

        return new UserResource($user);
    }

    public function getAll(){
        $users = $this->userService->getAll();

        return UserResource::collection($users);
    }
}
