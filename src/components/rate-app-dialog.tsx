'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';

interface RateAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RateAppDialog({ open, onOpenChange }: RateAppDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value: number) => {
    setRating(value);
    setSubmitted(true);
  };

  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Rate Your Experience</DialogTitle>
          <DialogDescription className="text-center">
            Aapka feedback humare liye bahut important hai!
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 space-y-2">
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              Thank you for rating us! ❤️
            </p>
            <p className="text-sm text-muted-foreground">
              Aapne humein {rating} out of 5 stars diye hain.
            </p>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hover || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium text-emerald-600">
                Selected: {rating} / 5 Stars
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
