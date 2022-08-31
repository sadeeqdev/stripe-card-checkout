import React, { useState } from 'react'
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js'
import StatusMessages, {useMessages} from '../components/StatusMessages';
import { SpinnerCircular } from 'spinners-react';
import FeedbackModal from '../components/Feedback';

const Card = () => {
    const elements = useElements()
    const stripe = useStripe()
    const [messages, addMessage] = useMessages();
    const [amount, setAmount] = useState();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState()
    const [loader, setLoader] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        if(!stripe || !elements){
            addMessage('Stripe.js has not yet loaded.');
            return;
        }

        const {error: backendError, clientSecret} = await fetch(
            'http://localhost:4242/create-payment-intent',
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodType: 'card',
                    currency: 'usd',
                    amount:  (amount*100)
                }),
            }
        ).then((r) => r.json());

        if (backendError) {
            addMessage(backendError.message);
            setLoader(false)
            return;
        }

        addMessage('Client secret returned');


        const {error: stripeError, paymentIntent} = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: fullName,
                        email:email
                    },
                },
            }
        );

        if (stripeError) {
            // Show error to your customer (e.g., insufficient funds)
            addMessage(stripeError.message);
            setLoader(false)
            return;
        }

        addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
        setSuccess(true)
        setLoader(false)

    }

  return (
    <>    
   {success && <FeedbackModal/>}
    <div className='w-screen h-screen bg-sub-white flex justify-center items-center'>
        <div className='bg-white rounded-lg w-4/5 h-auto xl:w-3/6 xl:auto 2xl:w-2/6 2xl:h-auto p-10'>
            <h2 className='text-5xl font-meduim'>Card</h2>
            <form onSubmit={handleSubmit}>
                <div className='mt-5'>
                    <input type="text" className='border border-sub-dark py-4 rounded my-2 w-full px-2' placeholder='Full Name' onChange={(e) => setFullName(e.target.value)}/>
                    <input type="text" className='border border-sub-dark py-4 rounded my-2 w-full px-2' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" className='border border-sub-dark py-4 rounded my-2 w-full px-2' placeholder='Amount' onChange={(e) => setAmount(e.target.value)}/>
                    <CardElement className='border border-sub-dark rounded py-5 px-2 my-2'/>
                </div>
                <button disabled={loader || !email || !fullName || !amount || !(elements.getElement(CardElement)) }className='px-8 py-3 bg-green text-white text-xl rounded hover:bg-dark my-5 flex justify-center w-full disabled:bg-sub-green disabled:hover:bg-sub-green'>{loader ? <SpinnerCircular size="30" /> : "Buy Now"}</button>
            </form>
            <StatusMessages messages={messages} />
        </div>
    </div>
    </>

  )
}

export default Card