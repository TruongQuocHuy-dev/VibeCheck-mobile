import { useState, useEffect } from 'react';
import { UseOtpFormReturn } from '../../types/presentation/auth/otp.types';

/**
 * Custom hook managing the state of the OtpScreen setup workflows.
 * @param onLoginSuccess - callback to execute upon completion setup steps.
 */
export const useOtpForm = (onLoginSuccess?: () => void): UseOtpFormReturn => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PASSWORD'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);


  const resendOtp = () => {
    setTimer(30);
    // Add API trigger here later
  };

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      if (step === 'PHONE') setPhoneNumber((prev) => prev.slice(0, -1));
      else if (step === 'OTP') setOtp((prev) => prev.slice(0, -1));
      else if (step === 'PASSWORD') setPassword((prev) => prev.slice(0, -1));
    } else {
      if (step === 'PHONE') {
        if (phoneNumber.length < 10) setPhoneNumber((prev) => prev + key);
      } else if (step === 'OTP') {
        if (otp.length < 4) setOtp((prev) => prev + key);
      } else if (step === 'PASSWORD') {
        if (password.length < 6) setPassword((prev) => prev + key); // Max 6 for password dots demo
      }
    }
  };

  const handleContinue = () => {
    if (step === 'PHONE' && phoneNumber.length >= 9) {
      // Simulate account layout: if 0987654321, go to PASSWORD, else OTP
      if (phoneNumber.replace(/\s/g, '') === '0987654321') {
        setStep('PASSWORD');
      } else {
        setStep('OTP');
      }
    } else if (step === 'OTP' && otp.length === 4) {
      if (onLoginSuccess) onLoginSuccess();
    } else if (step === 'PASSWORD' && password.length >= 4) {
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return {
    step,
    phoneNumber,
    otp,
    password,
    timer,
    setStep,
    handleKeyPress,
    handleContinue,
    resendOtp,
  };
};

