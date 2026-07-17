<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cargos', function (Blueprint $table) {
            $table->id();
            $table->string('nome')->unique();
            $table->timestamps();
        });

        DB::table('cargos')->insert([
            ['nome' => 'Médico(a)',      'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Enfermeiro(a)',  'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Técnico(a)',     'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('cargos');
    }
};
