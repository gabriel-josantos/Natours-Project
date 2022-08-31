import axios from 'axios';
import { showAlert } from './alerts';

export async function bookTour(tourId) {
  try {
    const stripe = Stripe(
      `pk_test_51LbvrLIQ9JLSLncHwj8qc0wJzHbyjAc6TRemIYM41zX0qrcERsVhLRNE9uAuOH4PbHaqnQ4NlYKftBh7VULFO7U2008BuUUsBM`
    );
    // 1) Get session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form+charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
}
