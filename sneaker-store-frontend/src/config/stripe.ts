// src/config/stripe.ts
import { loadStripe } from '@stripe/stripe-js';


const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY; 

if (!STRIPE_KEY) {

    console.error("Stripe Public Key is missing. Check your .env file and the VITE_STRIPE_PUBLISHABLE_KEY variable.");

}

// Cargar Stripe.js de forma asíncrona
export const stripePromise = loadStripe(STRIPE_KEY as string);