import React, { useState } from 'react';


const ForgotPassword = ({ onSend }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(email);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <p className="text-sm text-gray-600 ">Password recovery</p>
                <h2 className="text-2xl font-semibold mb-4">Forgot your password?</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Kindly enter the email address linked to this account and
                    we will send you a code to enable you change your password.
                </p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm text-gray-600">Email address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full mt-1 p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
                Send
            </button>
        </form>
    );
};

export default ForgotPassword;

