<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plantao extends Model
{
    protected $table = 'plantoes';

    protected $fillable = [
        'user_id',
        'data',
        'hora_inicio',
        'hora_fim',
        'setor',
        'status'
    ];

    protected $casts = [
        'data' => 'date:Y-m-d',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
