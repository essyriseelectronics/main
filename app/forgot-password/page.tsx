'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requestPasswordResetOTP, resetPassword } from '@/lib/actions/reset';
import { Phone, Lock, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await requestPasswordResetOTP(phone);
      if (res.success) {
        setStep(2);
      } else {
        setError(res.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await resetPassword(phone, otp, newPassword);
      if (res.success) {
        setStep(3);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(res.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block outline-none select-none">
          <span className="text-3xl font-extrabold text-black tracking-tight leading-none">ESSYRISE</span>
          <span className="block text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">electronics</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          {step === 1 && 'Reset your password'}
          {step === 2 && 'Verify and create password'}
          {step === 3 && 'Password Reset Complete!'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 1 && 'Enter your phone number to receive a verification code.'}
          {step === 2 && `We sent a 6-digit code to ${phone}`}
          {step === 3 && 'Redirecting you to login...'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0076c0] hover:bg-blue-700 disabled:opacity-70 transition-colors"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Code'}
              </button>

              <div className="text-center mt-4 text-sm">
                <Link href="/login" className="font-medium text-gray-500 hover:text-gray-900">
                  Back to login
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">6-digit Code</label>
                <div className="relative flex justify-center">
                  <div className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full max-w-[250px] pl-12 pr-3 py-3 text-center text-2xl tracking-[0.5em] font-bold border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0]"
                    placeholder="------"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || newPassword.length < 6}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 transition-colors"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <p className="text-gray-900 font-medium">Your password has been successfully updated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
