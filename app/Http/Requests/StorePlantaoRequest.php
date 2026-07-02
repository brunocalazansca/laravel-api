<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePlantaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'data' => 'required|date_format:Y-m-d',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fim' => 'required|date_format:H:i|after:hora_inicio',
            'setor' => 'required|string|max:100',
            'status' => 'nullable|string|in:agendado,concluido,cancelado,troca_solicitada',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'É obrigatório selecionar um profissional.',
            'user_id.exists' => 'O profissional selecionado não está cadastrado no sistema.',
            'data.date_format' => 'A data deve estar no formato AAAA-MM-DD.',
            'hora_inicio.date_format' => 'A hora de início deve estar no formato HH:MM (ex: 07:00).',
            'hora_fim.date_format' => 'A hora de fim deve estar no formato HH:MM (ex: 19:00).',
            'hora_fim.after' => 'A hora de término deve ser posterior à hora de início.',
            'status.in' => 'O status informado é inválido.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $primeiroErro = $validator->errors()->first();

        throw new HttpResponseException(response()->json([
            'message' => $primeiroErro
        ], 422));
    }
}
