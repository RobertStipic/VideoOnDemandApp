import Stripe from "stripe";
import { constants } from "./consants/general.js";
export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: constants.stripeAPIversion,
});
