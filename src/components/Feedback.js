import React from 'react'

const FeedbackModal = ({error, success, message}) => {
    return (
    <div className='w-screen h-screen bg-black absolute top-0 left-0 z-50 backdrop-filter backdrop-blur-sm bg-opacity-60 flex justify-center items-center'>
        <div className='bg-white rounded-lg w-4/5 h-auto xl:w-3/6 xl:auto 2xl:w-2/6 2xl:h-auto p-10 shadow-xl'>
            <div className='text-4xl text-green font meduim'>
                Purchase Successful
            </div>
            <div className='text-xl font meduim mt-5'>
                Redirecting you back to website...
            </div>
        </div>
    </div>
    )
}

export default FeedbackModal