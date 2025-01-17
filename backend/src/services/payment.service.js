const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../api/v1/utils/AppError');

class PaymentService {
    async createPaymentIntent(amount, currency = 'inr', paymentMethodTypes = ['card']) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to smallest currency unit
                currency,
                payment_method_types: paymentMethodTypes,
                metadata: {
                    integration_check: 'accept_a_payment'
                }
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
            if (paymentIntent.status === 'succeeded') {
                return {
                    success: true,
                    paymentId: paymentIntent.id,
                    paymentMethod: paymentIntent.payment_method_types[0],
                    amount: paymentIntent.amount / 100, // Convert back from smallest currency unit
                    currency: paymentIntent.currency,
                    status: paymentIntent.status
                };
            }

            throw new AppError('Payment not successful', 400);
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async createRefund(paymentIntentId, amount) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: Math.round(amount * 100) // Convert to smallest currency unit
            });

            return {
                success: true,
                refundId: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            };
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async createPaymentMethod(paymentMethodDetails) {
        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: paymentMethodDetails
            });

            return paymentMethod;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async listCustomerPaymentMethods(customerId) {
        try {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customerId,
                type: 'card'
            });

            return paymentMethods.data;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }
}

module.exports = new PaymentService();
