import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-functions.js";

// ✅ Your Firebase config — DO NOT wrap in <script> tags
const firebaseConfig = {
  apiKey: "AIzaSyDHrw8JqI5AWYDwwvJvkFv0zSzH5ZnLqDM",
  authDomain: "image-storage-8307f.firebaseapp.com",
  projectId: "image-storage-8307f",
  storageBucket: "image-storage-8307f.appspot.com",
  messagingSenderId: "994051321306",
  appId: "1:994051321306:web:108f863ed64aa24fb124e3"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// 🔐 Sign In with Google
window.signIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch(console.error);
};

// 🔐 Sign Out
window.signOut = () => {
  signOut(auth);
};

// 💳 Start Stripe Subscription
window.startSubscription = async () => {
  const createCheckout = httpsCallable(functions, 'createCheckoutSession');
  const result = await createCheckout({ origin: window.location.origin });
  const stripe = Stripe("YOUR_STRIPE_PUBLISHABLE_KEY"); // Replace this!
  stripe.redirectToCheckout({ sessionId: result.data.sessionId });
};

// 👤 Handle UI on Auth Change
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
