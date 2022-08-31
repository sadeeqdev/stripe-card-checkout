
const FeedbackModal = ({error, success, message, closeModal}) => {

    const handleClose = () => {
        closeModal(false)
    }

    return (
    <div className='w-screen h-screen bg-black absolute top-0 left-0 z-50 backdrop-filter backdrop-blur-sm bg-opacity-60 flex justify-center items-center'>
        <div className='bg-white rounded-lg w-4/5 h-auto xl:w-3/6 xl:auto 2xl:w-2/6 2xl:h-auto p-10 shadow-xl'>
            <div className={`text-4xl ${error ? 'text-red' : 'text-green'} font meduim`}>
                {error ? 'Purchase Error' : success ? 'Purchase Successful' : ""}
            </div>
            <div className='text-xl font meduim mt-5'>
                {message}     
            </div>
            { error &&
            <div className='text-xl font meduim mt-5 flex justify-end'>
                <button className="text-red text-xl justify-end hover:text-maroon" onClick={handleClose}> Close</button>
            </div>
            }
            
        </div>
    </div>
    )
}

export default FeedbackModal