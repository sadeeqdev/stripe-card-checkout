import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { loadStripe,  } from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js'

const root = ReactDOM.createRoot(document.getElementById('root'));

(async () => {
  const {publishableKey} = await fetch('http://localhost:4242/config').then(r=> r.json())
  const stripePromise = loadStripe(`${publishableKey}`)

root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);


})()

