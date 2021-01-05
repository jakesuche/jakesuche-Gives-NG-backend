



const paystack = (request) => {


    const MySecretKey = 'Bearer sk_test_d9d005f5f5fa4ad859c44a87979f01ae3655e312';
    //replace the secret key with that from your paystack account


    const initializePayment = (form, mycallback) => {
        const options = {
            url : 'https://api.paystack.co/transaction/initialize',
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'    
            },
            form
        }

        // callback
        const callback = (error, response, body) => {
            return mycallback(error, body)
        }

        

        // send the API call with a callback
        request.post(options, callback)

    }


    const verifyPayment = (ref, mycallback) => {
        const options = {
            url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'    
            }
        }


        // callback
        const callback = (error, response, body) => {
            return mycallback(error, body)
        }


        // send the API call with a callback
        request(options, callback)


    }



    return {initializePayment, verifyPayment};
    
}

module.exports = paystack;