<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('especialidades', function (Blueprint $table) {
            $table->id();
            $table->string('nome')->unique();
            $table->timestamps();
        });

        $especialidades = [
            'Clínica Geral', 'Cardiologia', 'Neurologia',
            'Ortopedia', 'Cirurgia Geral', 'Pediatria',
            'Ginecologia', 'Obstetrícia', 'Anestesiologia',
            'Pronto-Socorro', 'Gastroenterologia', 'Urologia',
            'Oftalmologia',
        ];

        $now = now();
        DB::table('especialidades')->insert(
            array_map(fn($nome) => ['nome' => $nome, 'created_at' => $now, 'updated_at' => $now], $especialidades)
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('especialidades');
    }
};
