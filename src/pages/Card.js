import React, { useState } from 'react'
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js'
import { SpinnerCircular } from 'spinners-react';
import FeedbackModal from '../components/Feedback';

const Card = () => {
    const elements = useElements()
    const stripe = useStripe()
    const [amount, setAmount] = useState();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState()
    const [loader, setLoader] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        if(!stripe || !elements){
            setMessage('Payment unsuccessful. Try again')
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
            setLoader(false)
            setError(true)
            setMessage(backendError.message)
            return;
        }



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
            setMessage(stripeError.message)
            setLoader(false)
            setError(true)
            return;
        }

        setMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}\n Redirecting in 5s...`);
        // setMessage('Payment Sucessful. Redirecting you to you site....')
        setSuccess(true)
        setLoader(false)

    }


    function closeModal(data){
        setError(data)
    }

  return (
    <>    
   {success && <FeedbackModal success={true} error={false} message={message} />}
   {error && <FeedbackModal success={false} error={true} closeModal={closeModal}  message={message}/>}
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
        </div>
    </div>
    </>

  )
}

export default Card