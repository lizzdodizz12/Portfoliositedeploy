<h1>New portfolio contact message</h1>

<p><strong>Name:</strong> {{ $contact['name'] }}</p>
<p><strong>Email:</strong> {{ $contact['email'] }}</p>
<p><strong>Subject:</strong> {{ $contact['subject'] }}</p>

<p><strong>Message:</strong></p>
<p>{!! nl2br(e($contact['message'])) !!}</p>
