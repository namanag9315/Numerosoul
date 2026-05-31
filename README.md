# NumeroSoul

NumeroSoul is a Next.js booking, numerology, invoicing, and customer-care app for Uma Rastogi in Badaun, Uttar Pradesh.

## Customer Journey Automation

After a successful Razorpay payment, the app now:

- creates a confirmed booking in Supabase
- creates a Google Calendar event and Google Meet link when Calendar credentials are configured
- generates an invoice number and public invoice link
- sends the booking details, video link, and invoice by email and WhatsApp
- supports reminder cron jobs before the session
- lets the admin send post-session notes, report links, and follow-up dates
- supports due follow-up reminders and promotional broadcasts by email or WhatsApp

## Key Routes

- `/book` - customer booking and payment flow
- `/booking-confirmed` - post-payment summary with invoice and video links
- `/invoice/[bookingId]` - printable branded invoice
- `/api/send-reminder` - cron endpoint for next-day session reminders
- `/api/send-followups` - cron endpoint for due follow-up reminders
- `/admin/dashboard` - bookings, client notes, post-session care, invoicing, and campaigns

## Environment Variables

Core:

```bash
NEXT_PUBLIC_SITE_URL=https://numerasoul.in
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
CRON_SECRET=your-cron-secret
```

Payments:

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Email:

```bash
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=numerosoul6@gmail.com
```

WhatsApp Business API:

```bash
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_TEMPLATE_BOOKING_CONFIRMATION=...
WHATSAPP_TEMPLATE_SESSION_REMINDER=...
WHATSAPP_TEMPLATE_POST_SESSION=...
WHATSAPP_TEMPLATE_FOLLOW_UP=...
```

Optional Twilio WhatsApp fallback:

```bash
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Google Calendar and Meet:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CALENDAR_ID=...
```

If Google Meet is not configured, set a default video link:

```bash
SESSION_VIDEO_URL=https://meet.google.com/...
```

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.
