<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'tipo' => $this->tipo,
            'registro_profissional' => $this->registro_profissional,
            'especialidade' => $this->especialidade,
            'carga_horaria_maxima' => $this->carga_horaria_maxima,
            'ativo' => $this->ativo,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
