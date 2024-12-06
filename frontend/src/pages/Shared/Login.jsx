import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import ForgotPassword from "../../components/Shared/LoginForgotPassword";
import VerifyEmail from "../../components/Shared/LoginVerifyEmail";
import ResetPassword from "../../components/Shared/LoginResetPassword";


const Login = () => {
    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                console.log('Login successful');
                // Handle successful login (e.g., redirect or update UI)
            } else {
                console.error('Login failed');
                // Handle login error (e.g., show error message)
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle any network or other errors
        }
    };

    const handleForgotPassword = async (forgotEmail) => {
        // try {
        //     const response = await fetch('/api/forgot-password', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ email: forgotEmail }),
        //     });

        //     if (response.ok) {
        //         console.log('Password reset email sent');
        //         setView('verify');
        //     } else {
        //         console.error('Password reset request failed');
        //         // Handle password reset error (e.g., show error message)
        //     }
        // } catch (error) {
        //     console.error('An error occurred:', error);
        //     // Handle any network or other errors
        // }
        // for debugging purposes ,Directly navigate to VerifyEmail for testing
        console.log(`Simulating password reset for: ${forgotEmail}`); // Debug log
        setView('verify'); // remove if we start handling backend 
    };


    const handleVerifyEmail = async (code) => {
        // try {
        //     const response = await fetch('/api/verify-email', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ email, code }),
        //     });

        //     if (response.ok) {
        //         console.log('Email verified successfully');
        //         setView('reset');
        //     } else {
        //         console.error('Email verification failed');
        //         // Handle verification error (e.g., show error message)
        //     }
        // } catch (error) {
        //     console.error('An error occurred:', error);
        //     // Handle any network or other errors
        // }
        // for debugging purposes ,Directly navigate to reset view for testing
        console.log('Simulating email verification for code:', code); // Debug log
        setView('reset'); // remove if we start handling backend 
    };

    const handleResetPassword = async (newPassword) => {
        // try {
        //     const response = await fetch('/api/reset-password', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ email, newPassword }),
        //     });

        //     if (response.ok) {
        //         console.log('Password reset successful');
        //         setView('login');
        //     } else {
        //         console.error('Password reset failed');
        //         // Handle reset error (e.g., show error message)
        //     }
        // } catch (error) {
        //     console.error('An error occurred:', error);
        //     // Handle any network or other errors
        // }
        // for debugging purposes ,Directly navigate to login view for testing
        alert(`Simulating password reset successfull`);
        setView('login') // remove if we start handling backend
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex items-center justify-center">
                <div className="max-w-md w-full px-8 -mr-64 -mt-20">
                    {view === 'login' && (
                        <>
                            <h2 className="text-3xl font-bold mb-6">Please Sign In</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot')}
                                            className="font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none"
                                        >
                                            Forgot your password?
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {view === 'forgot' && <ForgotPassword onSend={handleForgotPassword} />}
                    {view === 'verify' && <VerifyEmail onVerify={handleVerifyEmail} />}
                    {view === 'reset' && <ResetPassword onReset={handleResetPassword} />}
                </div>
            </div>
            <div
                className="w-1/2 bg-gradient-to-br from-emerald-400 to-emerald-600 flex flex-col justify-center px-8"
                style={{
                    backgroundImage: `url('/SakuBackground.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute max-w-md mx-auto text-flex text-black -mt-60">
                    <h2 className="text-4xl font-bold mb-1">Welcome to</h2>
                    <h1 className='text-6xl font-bold mb-1'>SAKU</h1>
                    <p className="text-lg mb-1">Welcome to SAKU, your car parts companion.</p>
                    <p className="text-sm">© 2024 SAKU. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};
export default Login;

