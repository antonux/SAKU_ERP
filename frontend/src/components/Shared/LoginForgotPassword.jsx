import React from 'react';

const ForgotPassword = ({ onSend }) => {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-600">Password recovery</p>
                <h2 className="text-2xl font-semibold">Forgot your password?</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Kindly enter the email address linked to this account and
                    we will send you a code to enable you change your password.
                </p>
            </div>

            <div>
                <label className="text-sm text-gray-600">Email address</label>
                <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full mt-1 p-2 border rounded-md"
                />
            </div>

            <button
                onClick={onSend}
                className="w-full py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
                Send
            </button>
        </div>
    );
};

export default ForgotPassword;

