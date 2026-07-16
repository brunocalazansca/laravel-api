<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
        $id = $this->route('id');

        return [
            'nome' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'senha' => 'sometimes|required|string|min:8',
            'tipo' => 'sometimes|required|string|in:admin,medico,enfermeiro',
            'cargo' => 'sometimes|nullable|string|max:100',
            'registro_profissional' => 'sometimes|nullable|string|max:50',
            'especialidade' => 'sometimes|nullable|string|max:100',
            'carga_horaria_maxima' => 'sometimes|required|integer|min:1|max:168',
            'ativo' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este e-mail já está em uso por outro usuário.',
            'email.required' => 'O campo de e-mail é obrigatório.',
            'email.email' => 'Por favor, insira um endereço de e-mail válido.',
            'nome.required' => 'O nome não pode ficar em branco.',
            'senha.min' => 'A senha deve ter pelo menos 8 caracteres.',
            'tipo.in' => 'O tipo de usuário deve ser: admin, medico ou enfermeiro.',
            'carga_horaria_maxima.max' => 'A carga horária máxima permitida na semana é de 168 horas.',
            'cargo.required' => 'O cargo é obrigatório.',
        ];
    }
}
