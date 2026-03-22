import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingConfirmationEmail {
  to: string;
  guestName: string;
  bookingReference: string;
  hotelName: string;
  roomName: string;
  experienceTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  roomTotal: string;
}

export async function sendBookingConfirmation({
  to,
  guestName,
  bookingReference,
  hotelName,
  roomName,
  experienceTitle,
  checkIn,
  checkOut,
  nights,
  guestCount,
  roomTotal,
}: BookingConfirmationEmail) {
  try {
    await resend.emails.send({
      from: "PARISVASY <bookings@parisvasy.com>",
      to,
      subject: `Booking Confirmed — ${bookingReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Manrope', Arial, sans-serif; color: #111110; background: #FAFAF7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-size: 28px; font-weight: 700; color: #E8432A; letter-spacing: -0.5px; }
            .card { background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
            .ref { font-size: 14px; color: #757571; margin-bottom: 8px; }
            h2 { font-family: Georgia, serif; font-size: 24px; margin: 0 0 24px; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F0F0E8; }
            .label { color: #757571; font-size: 14px; }
            .value { font-weight: 600; font-size: 14px; }
            .free-badge { background: #EDF2ED; color: #5A7A5E; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .total-row { border-bottom: none; font-size: 16px; }
            .warranty { background: #FAF5E8; border-radius: 12px; padding: 16px; margin-top: 16px; font-size: 13px; color: #8A6F27; text-align: center; }
            .footer { text-align: center; color: #A3A3A0; font-size: 12px; margin-top: 32px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">PARISVASY</div>
            </div>
            <div class="card">
              <div class="ref">${bookingReference}</div>
              <h2>Booking Confirmed</h2>
              <p>Dear ${guestName},</p>
              <p>Your booking at <strong>${hotelName}</strong> has been confirmed. Here are your details:</p>
              <div class="row">
                <span class="label">Hotel</span>
                <span class="value">${hotelName}</span>
              </div>
              <div class="row">
                <span class="label">Room</span>
                <span class="value">${roomName}</span>
              </div>
              <div class="row">
                <span class="label">Experience</span>
                <span class="value">${experienceTitle} <span class="free-badge">Included free</span></span>
              </div>
              <div class="row">
                <span class="label">Check-in</span>
                <span class="value">${checkIn}</span>
              </div>
              <div class="row">
                <span class="label">Check-out</span>
                <span class="value">${checkOut}</span>
              </div>
              <div class="row">
                <span class="label">Duration</span>
                <span class="value">${nights} night${nights > 1 ? "s" : ""}</span>
              </div>
              <div class="row">
                <span class="label">Guests</span>
                <span class="value">${guestCount} adult${guestCount > 1 ? "s" : ""}</span>
              </div>
              <div class="row total-row">
                <span class="label" style="font-size:16px;">Room Total</span>
                <span class="value" style="font-size:16px;">${roomTotal}</span>
              </div>
              <div class="warranty">
                🔒 Your card is on file as warranty only — no charge has been made.
                Full payment will be collected at check-in. Free cancellation up to 48h before arrival.
              </div>
            </div>
            <div class="footer">
              <p>PARISVASY — Book a room, live an experience</p>
              <p>Questions? Reply to this email or call us at +33 1 42 60 00 00</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return { success: false, error };
  }
}
