<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gadget extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'name',
        'description',
        'price',
        'created_by',
        // Add other fillable fields here
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
