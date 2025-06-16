const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);

admin.initializeApp();

const YOUR_PRICE_ID = "price_XXXXXXXXXXXXXX";

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in to subscribe.");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: context.auth.token.email,
      line_items: [{ price: YOUR_PRICE_ID, quantity: 1 }],
      success_url: `${data.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/cancel`
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
