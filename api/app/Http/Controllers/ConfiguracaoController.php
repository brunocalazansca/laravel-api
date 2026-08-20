<?php

namespace App\Http\Controllers;

use App\Models\Configuracao;
use Illuminate\Http\Request;

class ConfiguracaoController extends Controller
{
    public function getShiftHours()
    {
        $config = Configuracao::where('chave', 'shift_hours')->first();

        if (!$config) {
            return response()->json(null); // Retorna null para o frontend saber que deve usar o default
        }

        return response()->json($config->valor);
    }

    public function updateShiftHours(Request $request)
    {
        $validated = $request->validate([
            'manha' => 'required|array',
            'tarde' => 'required|array',
            'noite' => 'required|array',
        ]);

        $config = Configuracao::updateOrCreate(
            ['chave' => 'shift_hours'],
            ['valor' => $validated]
        );

        return response()->json($config->valor);
    }
}
