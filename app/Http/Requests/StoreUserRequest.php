<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'senha' => 'required|string|min:8',
            'tipo' => 'required|string|in:admin,medico,enfermeiro',
            'registro_profissional' => 'nullable|string|max:50',
            'especialidade' => 'nullable|string|max:100',
            'carga_horaria_maxima' => 'required|integer|min:1|max:168',
            'ativo' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'tipo.in' => 'O tipo de usuário deve ser: admin, medico ou enfermeiro.',
            'carga_horaria_maxima.max' => 'A carga horária máxima permitida na semana é de 168 horas.',
        ];
    }
}
