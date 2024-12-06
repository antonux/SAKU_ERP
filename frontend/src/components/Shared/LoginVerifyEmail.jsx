import React, { useState } from 'react';

const VerifyEmail = ({ onVerify }) => {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

    const handleCodeChange = (index, value) => {
        if (value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);

            if (value && index < 5) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = verificationCode.join('');
        if (code.length === 6) {
            onVerify(code);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <p className="text-sm text-gray-600">Password recovery</p>
                <h2 className="text-2xl font-semibold mb-4">Email verification</h2>
                <p className="text-sm text-gray-600 mt-4 mb-10">
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
                        className="w-12 h-12 text-center border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                ))}
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
                Verify
            </button>
        </form>
    );
};

export default VerifyEmail;

