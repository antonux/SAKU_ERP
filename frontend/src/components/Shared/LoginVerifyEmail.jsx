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
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col w-[23rem] gap-6">
                <div>
                    <p className="text-sm text-gray-600">Password recovery</p>
                    <h2 className="text-2xl font-semibold mb-4">Email verification</h2>
                    <p className="text-sm text-gray-600 mt-4 mb-6">
                        Kindly enter the 6-digit code that has been sent to your email address.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-center gap-4">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-normal text-white bg-[#56cc73] hover:bg-[#48af62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
