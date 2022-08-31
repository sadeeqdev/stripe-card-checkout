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
        <div className='bg-white rounded-lg w-4/5 h-auto xl:w-3/6 xl:auto 2xl:w-1/4 2xl:h-auto p-10'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-3xl font-meduim'>Checkout</h2>
                <div className='flex justify between'>
                    <p className='mt-2 text-sm mr-1'>Powered by</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className='float-right w-9 text-red' style={{color:'red'}}><path d="M165 144.7l-43.3 9.2-.2 142.4c0 26.3 19.8 43.3 46.1 43.3 14.6 0 25.3-2.7 31.2-5.9v-33.8c-5.7 2.3-33.7 10.5-33.7-15.7V221h33.7v-37.8h-33.7zm89.1 51.6l-2.7-13.1H213v153.2h44.3V233.3c10.5-13.8 28.2-11.1 33.9-9.3v-40.8c-6-2.1-26.7-6-37.1 13.1zm92.3-72.3l-44.6 9.5v36.2l44.6-9.5zM44.9 228.3c0-6.9 5.8-9.6 15.1-9.7 13.5 0 30.7 4.1 44.2 11.4v-41.8c-14.7-5.8-29.4-8.1-44.1-8.1-36 0-60 18.8-60 50.2 0 49.2 67.5 41.2 67.5 62.4 0 8.2-7.1 10.9-17 10.9-14.7 0-33.7-6.1-48.6-14.2v40c16.5 7.1 33.2 10.1 48.5 10.1 36.9 0 62.3-15.8 62.3-47.8 0-52.9-67.9-43.4-67.9-63.4zM640 261.6c0-45.5-22-81.4-64.2-81.4s-67.9 35.9-67.9 81.1c0 53.5 30.3 78.2 73.5 78.2 21.2 0 37.1-4.8 49.2-11.5v-33.4c-12.1 6.1-26 9.8-43.6 9.8-17.3 0-32.5-6.1-34.5-26.9h86.9c.2-2.3.6-11.6.6-15.9zm-87.9-16.8c0-20 12.3-28.4 23.4-28.4 10.9 0 22.5 8.4 22.5 28.4zm-112.9-64.6c-17.4 0-28.6 8.2-34.8 13.9l-2.3-11H363v204.8l44.4-9.4.1-50.2c6.4 4.7 15.9 11.2 31.4 11.2 31.8 0 60.8-23.2 60.8-79.6.1-51.6-29.3-79.7-60.5-79.7zm-10.6 122.5c-10.4 0-16.6-3.8-20.9-8.4l-.3-66c4.6-5.1 11-8.8 21.2-8.8 16.2 0 27.4 18.2 27.4 41.4.1 23.9-10.9 41.8-27.4 41.8zm-126.7 33.7h44.6V183.2h-44.6z"/></svg>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='mt-5'>
                    <input type="text" className='border border-sub-dark py-4 rounded my-2 w-full px-2' placeholder='Full Name' onChange={(e) => setFullName(e.target.value)}/>
                    <input type="text" className='border border-sub-dark py-4 rounded my-2 w-full px-2' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" className='border border-sub-dark py-4 rounded my-2 w-full px-2' placeholder='Amount' onChange={(e) => setAmount(e.target.value)}/>
                    <CardElement className='border border-sub-dark rounded py-5 px-2 my-2'/>
                </div>
                <button disabled={loader || !email || !fullName || !amount || !(elements.getElement(CardElement)) }className='px-8 py-3 bg-green text-white text-xl rounded hover:bg-dark my-5 flex justify-center w-full disabled:bg-sub-green disabled:hover:bg-sub-green'>{loader ? <SpinnerCircular size="30" /> : "Proceed"}</button>
            </form>
        </div>
    </div>
    </>

  )
}

export default Card