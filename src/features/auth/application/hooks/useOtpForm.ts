import { useState, useEffect } from 'react';
import { UseOtpFormReturn } from '../../domain/types/otp.types';
import { AuthService } from '../../infrastructure/services/AuthService';
import { AuthValidator } from '../../domain/validators/auth.validator';

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


  const resendOtp = async () => {
    setTimer(30);
    await AuthService.sendOtp(phoneNumber);
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

  const handleContinue = async () => {
    if (step === 'PHONE') {
      if (AuthValidator.validatePhone(phoneNumber)) {
        const exists = await AuthService.checkUserExists(phoneNumber);
        if (exists) {
          setStep('PASSWORD');
        } else {
          setStep('OTP');
          await AuthService.sendOtp(phoneNumber);
        }
      }
    } else if (step === 'OTP') {
      if (AuthValidator.validateOtp(otp)) {
        const success = await AuthService.verifyOtp(phoneNumber, otp);
        if (success && onLoginSuccess) onLoginSuccess();
      }
    } else if (step === 'PASSWORD') {
      if (AuthValidator.validatePassword(password)) {
        const success = await AuthService.loginWithPassword(phoneNumber, password);
        if (success && onLoginSuccess) onLoginSuccess();
      }
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

