import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './PaymentPage.css';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        alert('Payment Successful!');
    };

    return (
        <div className="payment-container">
            <h2>Make Payment</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Payment Method</label>
                    <select {...register("paymentMethod", { required: true })} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select Payment Method</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="easypaisa">Easypaisa</option>
                    </select>
                    {errors.paymentMethod && <p>Please select a payment method</p>}
                </div>

                {paymentMethod === 'card' && (
                    <div>
                        <div className="form-group">
                            <label>Card Number</label>
                            <input type="text" {...register("cardNumber", { required: true })} />
                            {errors.cardNumber && <p>Card number is required</p>}
                        </div>
                        <div className="form-group">
                            <label>Expiry Date</label>
                            <input type="text" {...register("expiryDate", { required: true })} />
                            {errors.expiryDate && <p>Expiry date is required</p>}
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <input type="text" {...register("cvv", { required: true })} />
                            {errors.cvv && <p>CVV is required</p>}
                        </div>
                    </div>
                )}

                {paymentMethod === 'paypal' && (
                    <div className="form-group">
                        <label>PayPal Email</label>
                        <input type="email" {...register("paypalEmail", { required: true })} />
                        {errors.paypalEmail && <p>PayPal email is required</p>}
                    </div>
                )}

                {paymentMethod === 'bank' && (
                    <div>
                        <div className="form-group">
                            <label>Account Number</label>
                            <input type="text" {...register("accountNumber", { required: true })} />
                            {errors.accountNumber && <p>Account number is required</p>}
                        </div>
                        <div className="form-group">
                            <label>Routing Number</label>
                            <input type="text" {...register("routingNumber", { required: true })} />
                            {errors.routingNumber && <p>Routing number is required</p>}
                        </div>
                    </div>
                )}
                {paymentMethod === 'easypaisa' && (
                    <div>
                       <img src="easypaisaqr.jpeg" alt="Payment Method"/>

                    </div>
                )}

                <button type="submit">Submit Payment</button>
            </form>
        </div>
    );
};

export default PaymentPage;