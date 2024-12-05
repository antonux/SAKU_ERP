import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import ForgotPassword from './components/Shared/LoginForgotPassword';
import VerifyEmail from './components/Shared/LoginVerifyEmail';
import ResetPassword from './components/Shared/LoginResetPassword';

const Login = () => {
    const [view, setView] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    return (
        <div className="min-h-screen flex">
            {/* Left Section */}
            <div className="w-1/2 p-8">
                <div className="mb-4">
                    <h1 className="text-sm text-gray-600">
                        {view === 'login' ? 'Login' : 'Forgot Password'}
                    </h1>
                </div>

                <div className="max-w-md mx-auto mt-16">
                    {view === 'login' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold">Please Sign In</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="w-full mt-1 p-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full mt-1 p-2 border rounded-md pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Remember me</span>
                                    </label>
                                    <button
                                        onClick={() => setView('forgot')}
                                        className="text-sm text-emerald-500 hover:underline"
                                    >
                                        I forgot my password
                                    </button>
                                </div>

                                <button
                                    onClick={() => { }}
                                    className="w-full py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'forgot' && (
                        <ForgotPassword onSend={() => setView('verify')} />
                    )}

                    {view === 'verify' && (
                        <VerifyEmail
                            verificationCode={verificationCode}
                            handleCodeChange={handleCodeChange}
                            onSend={() => setView('reset')}
                        />
                    )}

                    {view === 'reset' && (
                        <ResetPassword
                            showNewPassword={showNewPassword}
                            setShowNewPassword={setShowNewPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            onReset={() => setView('login')}
                        />
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 bg-gradient-to-br from-emerald-300 to-emerald-500 p-8 flex flex-col justify-center">
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to SAKU</h2>
                    <p className="text-sm">Welcome to SAKU, your car parts companion.</p>
                    <p className="text-sm mt-4">© 2024 SAKU. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;

