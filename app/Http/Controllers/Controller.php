<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:5000',
        ]);

        Mail::raw(
            "Name: {$validated['name']}\n" .
            "Email: {$validated['email']}\n\n" .
            "Message:\n{$validated['message']}",

            function ($mail) use ($validated) {
                $mail->to('romero.leechristian19@gmail.com')
                    ->replyTo($validated['email'], $validated['name'])
                    ->subject($validated['subject']);
            }
        );

        return back()->with('success', 'Your message has been sent successfully!');
    }
}