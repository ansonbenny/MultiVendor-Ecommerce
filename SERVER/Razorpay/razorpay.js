import Razorpay from 'razorpay'
import crypto from 'crypto'

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECREt
})

export default instance

export const paymentVery = (razorpayRes) => {
    return new Promise((resolve, reject) => {
        let body = razorpayRes.razorpay_order_id + "|" + razorpayRes.razorpay_payment_id;

        let expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECREt)
            .update(body.toString())
            .digest('hex')

        if (expectedSignature === razorpayRes.razorpay_signature) {
            resolve(true)
        } else {
            reject()
        }

    })
}

export const refundPayment = ({ payId, price }) => {
    return new Promise((resolve, reject) => {
        instance.payments.refund(payId, {
            "amount": price * 100,
            "speed": "normal",
        }).then((done) => {
            resolve()
        }).catch((err) => {
            reject()
        })
    })
}

export const generateRazorpay = (amount, callback) => {
    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: `${Date.now() + Math.random()}`
    };
    instance.orders.create(options, function (err, order) {
        if (!err) {
            callback(order.id)
        } else {
            callback(null)
        }
    });
}

export const fetchPayment = (paymentId, callback) => {
    instance.payments.fetch(paymentId, { "expand[]": "card" }, (err, done) => {
        if (!err) {
            callback(done.amount)
        } else {
            callback(null)
        }
    })
}