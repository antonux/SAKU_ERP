import React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const ResetPassword = ({ showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, onReset }) => {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-600">Password recovery</p>
                <h2 className="text-2xl font-semibold">Password reset</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Kindly enter a new password.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">New password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full mt-1 p-2 border rounded-md pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {showNewPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-600">Confirm new password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full mt-1 p-2 border rounded-md pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={onReset}
                className="w-full py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
                Reset
            </button>
        </div>
    );
};

export default ResetPassword;

