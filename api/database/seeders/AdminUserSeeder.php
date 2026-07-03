<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@hospital.com'],
            [
                'nome' => 'Administrador Geral',
                'senha' => Hash::make('admin123'),
                'tipo' => 'admin',
                'registro_profissional' => 'ADM-001',
                'especialidade' => 'Gestão Hospitalar',
                'carga_horaria_maxima' => 40,
                'ativo' => true
            ]
        );
    }
}
