'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { useFirebase } from '@/firebase';

export default function PhoneAuthForm() {
  const { auth } = useFirebase();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // 1. Send OTP via API
  const handleSendOtp = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          otp: newOtp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsOtpSent(true);
        toast({
          title: 'OTP Sent!',
          description: 'Please check your phone for the verification code.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to send OTP',
          description: data.error || 'Something went wrong.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reach OTP service. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP & Anonymous Firebase Login
  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (otp.trim() === generatedOtp) {
      try {
        if (auth) {
          await signInAnonymously(auth);
        }

        localStorage.setItem('user_verified', 'true');
        localStorage.setItem('user_phone', phoneNumber);

        toast({
          title: 'Success!',
          description: 'Redirecting to dashboard...',
        });

        window.location.href = '/dashboard';
      } catch (err: any) {
        localStorage.setItem('user_verified', 'true');
        localStorage.setItem('user_phone', phoneNumber);
        window.location.href = '/dashboard';
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
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
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
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
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP & Login
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setIsOtpSent(false)}
            className="w-full text-xs"
          >
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  );
}
