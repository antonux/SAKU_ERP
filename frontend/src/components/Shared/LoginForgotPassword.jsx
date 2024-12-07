import React, { useState } from 'react';

const ForgotPassword = ({ onSend }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(email);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col w-[23rem] gap-6">
                <div>
                    <p className="text-sm text-gray-600">Password recovery</p>
                    <h2 className="text-2xl font-semibold mb-4">Forgot your password?</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Kindly enter the email address linked to this account and we will send you a code to enable you to change your password.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-600">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="mt-1 block w-full px-3 py-4 text-center text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-normal text-white bg-[#56cc73] hover:bg-[#48af62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
