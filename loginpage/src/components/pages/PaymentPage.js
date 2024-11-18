import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const filename = queryParams.get('filename');
    const price = parseFloat(queryParams.get('price'));

    const [paymentMethod, setPaymentMethod] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Retrieve student balance from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const studentId = userData.user._id;
    const [studentBalance, setStudentBalance] = useState(userData.user.balance);

    const generateTransactionId = () => {
        return `TRANS_${Date.now()}`;
    };

    const addTransaction = async (transactionData) => {
        try {
            const response = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error('Failed to add transaction log');
            }

            const data = await response.json();
            console.log('Transaction added:', data);
        } catch (error) {
            console.error('Error adding transaction log:', error);
        }
    };

    const onSubmit = async () => {
        if (paymentMethod === 'wallet') {
            if (studentBalance >= price) {
                try {
                    // Deduct the amount from balance
                    const response = await fetch(`http://localhost:5000/api/users/students/${studentId}/balance`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ action: 'subtract', amount: price }),
                    });

                    const data = await response.json();
                    alert('Payment Successful!');
                    setStudentBalance(data.balance); // Update balance in UI

                    // Update local storage balance
                    userData.user.balance = data.balance;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    // Generate transaction data
                    const transactionData = {
                        trans_id: generateTransactionId(),
                        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
                        time: new Date().toLocaleTimeString(), // Current time in HH:MM:SS
                        stud_id: studentId,
                        amount: price,
                    };

                    // Add transaction log
                    await addTransaction(transactionData);

                    // Set payment completed flag in local storage
                    localStorage.setItem('paymentCompleted', 'true');

                    // Redirect to Dashboard after payment
                    navigate('/userdashboard', { state: { paymentCompleted: true } });
                } catch (error) {
                    console.error('Error updating balance:', error);
                    alert('Failed to update balance.');
                }
            } else {
                alert('Insufficient balance.');
            }
        } else {
            alert('Currently, only Wallet payment is available.');
        }
    };

    return (
        <div className="payment-container">
            <h2>Make Payment</h2>
            {filename && <p>File: {filename}</p>}
            {price && <p>Total Price: ₹{price}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Payment Method</label>
                    <select {...register("paymentMethod", { required: true })} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select Payment Method</option>
                        <option value="wallet">Wallet</option>
                        <option value="card" disabled>Credit/Debit Card (Currently Unavailable)</option>
                        <option value="paypal" disabled>PayPal (Currently Unavailable)</option>
                        <option value="bank" disabled>Bank Transfer (Currently Unavailable)</option>
                        <option value="easypaisa" disabled>Easypaisa (Currently Unavailable)</option>
                    </select>
                    {errors.paymentMethod && <p className="error-message">Please select a payment method</p>}
                </div>

                {paymentMethod === 'wallet' && (
                    <div className="form-group">
                        <p>Current Balance: ₹{studentBalance}</p>
                        <p>Remaining Balance after Payment: ₹{studentBalance - price >= 0 ? studentBalance - price : 'Insufficient funds'}</p>
                    </div>
                )}

                <button type="submit">Submit Payment</button>
            </form>
        </div>
    );
};

export default PaymentPage;

