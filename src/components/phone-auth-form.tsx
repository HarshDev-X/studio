
'use client';

import { FormEvent, useState, useEffect } from 'react';
import {
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function PhoneAuthForm() {
  const { auth } = useFirebase();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // This effect ensures the reCAPTCHA container is ready.
  useEffect(() => {
    if (!isOtpSent && !document.getElementById('recaptcha-container-div')) {
      const container = document.createElement('div');
      container.id = 'recaptcha-container-div';
      document.getElementById('recaptcha-container-parent')?.appendChild(container);
    }
  }, [isOtpSent]);

  const setupRecaptcha = (authInstance: Auth) => {
    // Ensure the container is clean before creating a new verifier
    const recaptchaContainer = document.getElementById('recaptcha-container-div');
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = '';
    }

    // Always create a new verifier instance on each attempt
    window.recaptchaVerifier = new RecaptchaVerifier(authInstance, 'recaptcha-container-div', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  };

  const handleSendOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth) {
      toast({ variant: 'destructive', title: 'Authentication service not available.' });
      return;
    }
    setIsLoading(true);

    try {
      setupRecaptcha(auth);
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Please check your phone for the code.' });
    } catch (error: any) {
      console.error('SMS not sent', error);
      toast({
        variant: 'destructive',
        title: 'Failed to send OTP',
        description: error.message || 'Please check your browser console for details.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (!window.confirmationResult) {
      toast({ variant: 'destructive', title: 'Please request an OTP first.' });
      return;
    }
    setIsLoading(true);
    try {
      await window.confirmationResult.confirm(otp);
      // onAuthStateChanged will handle the redirect to dashboard
      toast({ title: 'Success!', description: 'You are now signed in.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div id="recaptcha-container-parent"></div>
      {!isOtpSent ? (
        <form onSubmit={handleSendOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="123456"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              pattern="\d{6}"
              title="OTP must be 6 digits"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP & Sign In'}
          </Button>
           <Button variant="link" onClick={() => setIsOtpSent(false)}>
            Back
          </Button>
        </form>
      )}
    </div>
  );
}
