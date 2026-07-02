<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlantaoResource extends JsonResource
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
            'data' => $this->data ? $this->data->format('Y-m-d') : null,
            'hora_inicio' => $this->hora_inicio ? date('H:i', strtotime($this->hora_inicio)) : null,
            'hora_fim' => $this->hora_fim ? date('H:i', strtotime($this->hora_fim)) : null,
            'setor' => $this->setor,
            'status' => $this->status,
            'medico' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
