const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);
admin.initializeApp();

const YOUR_PRICE_ID = "price_1RaMRgLe5mN8hyn8cBEOX3v7"; // Replace with actual price ID from Stripe Dashboard

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Please sign in first.");
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: context.auth.token.email,
      line_items: [{ price: YOUR_PRICE_ID, quantity: 1 }],
      success_url: `${data.origin}/success`,
      cancel_url: `${data.origin}/cancel`
    });
    return { sessionId: session.id };
  } catch (err) {
    console.error("Stripe error:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});
