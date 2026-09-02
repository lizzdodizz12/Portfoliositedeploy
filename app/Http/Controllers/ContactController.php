<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $contact = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        try {
            Mail::to(config('contact.recipient'))->send(new ContactMessage($contact));
        } catch (Throwable $exception) {
            Log::error('Portfolio contact email could not be sent.', [
                'exception' => $exception,
            ]);

            return back()
                ->withInput()
                ->with('contact_error', 'Sorry, your message could not be sent. Please try again later.');
        }

        return back()->with('contact_success', 'Thanks! Your message has been sent successfully.');
    }
}
