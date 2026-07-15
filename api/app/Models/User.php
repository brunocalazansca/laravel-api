<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'users';

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'tipo',
        'cargo',
        'registro_profissional',
        'especialidade',
        'carga_horaria_maxima',
        'ativo'
    ];

    protected $hidden = [
        'senha',
        'remember_token',
    ];

    protected $casts = [
        'senha' => 'hashed',
        'ativo' => 'boolean',
        'carga_horaria_maxima' => 'integer',
    ];

    public function scopeAtivos($query)
    {
        return $query->where('ativo', true);
    }
}
