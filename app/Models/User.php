<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // Allow mass assignment for these attributes.
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'type',
    ];

    // Hide sensitive attributes when serializing.
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Getter for the first_name attribute.
    public function getFirstName(): ?string
    {
        return $this->attributes['first_name'] ?? null;
    }

    // Getter for the last_name attribute.
    public function getLastName(): ?string
    {
        return $this->attributes['last_name'] ?? null;
    }

    // Getter for the username attribute.
    public function getUsername(): ?string
    {
        return $this->attributes['username'] ?? null;
    }

    // Getter for the email attribute.
    public function getEmail(): ?string
    {
        return $this->attributes['email'] ?? null;
    }

    // Getter for the phone attribute.
    public function getPhone(): ?string
    {
        return $this->attributes['phone'] ?? null;
    }

    // Getter for the hashed password.
    public function getPassword(): ?string
    {
        return $this->attributes['password'] ?? null;
    }

    // Getter for the type attribute.
    public function getType(): ?string
    {
        return $this->attributes['type'] ?? null;
    }
}
