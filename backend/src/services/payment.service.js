require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../api/v1/utils/AppError');

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

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

    async createCheckoutSession(data) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: data.customer.email,
                client_reference_id: data.customer.id,
                line_items: data.items.map(item => ({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name,
                            description: item.description,
                            images: item.images
                        },
                        unit_amount: Math.round(item.price * 100)
                    },
                    quantity: item.quantity
                })),
                shipping_options: [
                    {
                        shipping_rate_data: {
                            type: 'fixed_amount',
                            fixed_amount: {
                                amount: Math.round(data.shipping.cost * 100),
                                currency: 'inr',
                            },
                            display_name: 'Standard shipping',
                            delivery_estimate: {
                                minimum: {
                                    unit: 'business_day',
                                    value: 3,
                                },
                                maximum: {
                                    unit: 'business_day',
                                    value: 5,
                                },
                            }
                        }
                    }
                ],
                success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`
            });

            return session;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async verifySession(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent', 'shipping']
            });
            return session;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async verifyWebhookSignature(payload, signature) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            return event;
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
