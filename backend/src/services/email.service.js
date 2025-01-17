const nodemailer = require('nodemailer');
const AppError = require('../api/v1/utils/AppError');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(options) {
        try {
            await this.transporter.sendMail({
                from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
                to: options.email,
                subject: options.subject,
                html: options.html
            });
        } catch (error) {
            throw new AppError('Error sending email', 500);
        }
    }

    async sendOrderConfirmationEmail(email, order) {
        const subject = `Order Confirmation - Order #${order._id}`;
        const html = `
            <h1>Thank you for your order!</h1>
            <p>Your order has been confirmed and is being processed.</p>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
            <h3>Items</h3>
            <ul>
                ${order.items.map(item => `
                    <li>
                        ${item.product.name} x ${item.quantity}
                        - ₹${item.price.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
            <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ₹${order.shippingCost.toFixed(2)}</p>
            <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
            <h3>Shipping Address</h3>
            <p>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                ${order.shippingAddress.country} - ${order.shippingAddress.zipCode}
            </p>
            <p>
                We'll send you another email when your order ships.
                If you have any questions, please contact our support team.
            </p>
            <p>Best regards,<br>EasyShop Team</p>
        `;

        await this.sendEmail({ email, subject, html });
    }

    async sendOrderShippedEmail(email, order, trackingInfo) {
        const subject = `Your Order #${order._id} Has Been Shipped`;
        const html = `
            <h1>Your Order Has Been Shipped!</h1>
            <p>Great news! Your order is on its way.</p>
            <h2>Tracking Information</h2>
            <p><strong>Tracking Number:</strong> ${trackingInfo.trackingNumber}</p>
            <p><strong>Carrier:</strong> ${trackingInfo.carrier}</p>
            <p><strong>Estimated Delivery:</strong> ${trackingInfo.estimatedDelivery}</p>
            <p>
                Track your package: <a href="${trackingInfo.trackingUrl}">Click here</a>
            </p>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <h3>Shipping Address</h3>
            <p>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                ${order.shippingAddress.country} - ${order.shippingAddress.zipCode}
            </p>
            <p>
                If you have any questions about your delivery,
                please don't hesitate to contact our support team.
            </p>
            <p>Best regards,<br>EasyShop Team</p>
        `;

        await this.sendEmail({ email, subject, html });
    }

    async sendOrderDeliveredEmail(email, order) {
        const subject = `Your Order #${order._id} Has Been Delivered`;
        const html = `
            <h1>Your Order Has Been Delivered!</h1>
            <p>Your order has been successfully delivered.</p>
            <p>
                We hope you're happy with your purchase!
                If you have any issues or concerns, please contact our support team.
            </p>
            <p>
                Don't forget to rate and review your purchase to help other shoppers.
            </p>
            <p>Best regards,<br>EasyShop Team</p>
        `;

        await this.sendEmail({ email, subject, html });
    }

    async sendPasswordResetEmail(email, resetToken, resetUrl) {
        const subject = 'Password Reset Request';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 10 minutes.</p>
            </div>
        `;

        await this.sendEmail({
            email,
            subject,
            html
        });
    }

    async sendEmailVerification(email, verificationUrl) {
        const subject = 'Verify Your Email Address';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to EasyShop!</h2>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>If you didn't create an account with us, please ignore this email.</p>
            </div>
        `;

        await this.sendEmail({
            email,
            subject,
            html
        });
    }
}

module.exports = new EmailService();
