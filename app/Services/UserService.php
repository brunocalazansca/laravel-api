<?php

namespace App\Services;

use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(protected UserRepositoryInterface $userRepository){}

    public function register($dados)
    {
        $dados['senha'] = Hash::make($dados['senha']);

        return $this->userRepository->create($dados);
    }

    public function getAll()
    {
        return $this->userRepository->all();
    }

    public function getById($id)
    {
        return $this->userRepository->findById($id);
    }

    public function delete($id)
    {
        return $this->userRepository->delete($id);
    }

    public function update(int $id, array $dados)
    {
        if(isset($dados['senha'])) {
            $dados['senha'] = Hash::make($dados['senha']);
        }

        return $this->userRepository->update($id, $dados);
    }
}
