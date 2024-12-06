import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const ResetPassword = ({ onReset }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        setError('');
        onReset(newPassword);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <p className="text-sm text-gray-600">Password recovery</p>
                <h2 className="text-2xl font-semibold">Password reset</h2>
                <p className="text-sm text-gray-600">
                    Kindly enter a new password.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="new-password" className="block text-sm text-gray-600">New password</label>
                    <div className="relative">
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full mt-1 p-2 border rounded-md pr-10 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none"
                            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        >
                            {showNewPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirm-password" className="block text-sm text-gray-600">Confirm new password</label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full mt-1 p-2 border rounded-md pr-10 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
                type="submit"
                className="w-full py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
                Reset Password
            </button>
        </form>
    );
};

export default ResetPassword;

