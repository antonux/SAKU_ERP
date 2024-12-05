import React from 'react';

const VerifyEmail = ({ verificationCode, handleCodeChange, onSend }) => {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-600">Password recovery</p>
                <h2 className="text-2xl font-semibold">Email verification</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Kindly enter the 6 digit code that has been sent to your
                    email address.
                </p>
            </div>

            <div className="flex gap-2">
                {verificationCode.map((digit, index) => (
                    <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        className="w-12 h-12 text-center border rounded-md"
                    />
                ))}
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

export default VerifyEmail;

