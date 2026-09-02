<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Volt::route('settings/profile', 'settings.profile')->name('settings.profile');
    Volt::route('settings/password', 'settings.password')->name('settings.password');
    Volt::route('settings/appearance', 'settings.appearance')->name('settings.appearance');
});

require __DIR__.'/auth.php';
