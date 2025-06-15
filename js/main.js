import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-functions.js";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

window.signIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch(console.error);
};

window.signOut = () => {
  signOut(auth);
};

window.startSubscription = async () => {
  const createCheckout = httpsCallable(functions, 'createCheckoutSession');
  const result = await createCheckout({ origin: window.location.origin });
  const stripe = Stripe("YOUR_STRIPE_PUBLISHABLE_KEY");
  stripe.redirectToCheckout({ sessionId: result.data.sessionId });
};

onAuthStateChanged(auth, user => {
  const userSection = document.getElementById('user-section');
  const subscribeSection = document.getElementById('subscribe-section');
  const emailSpan = document.getElementById('user-email');
  
  if (user) {
    userSection.style.display = 'none';
    subscribeSection.style.display = 'block';
    emailSpan.textContent = user.email;
  } else {
    userSection.style.display = 'block';
    subscribeSection.style.display = 'none';
  }
});
