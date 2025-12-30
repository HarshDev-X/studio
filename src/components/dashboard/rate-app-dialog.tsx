'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface RateAppDialogProps {
  children: React.ReactNode;
}

export default function RateAppDialog({ children }: RateAppDialogProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'No rating selected',
        description: 'Please select a rating from 1 to 5.',
      });
      return;
    }
    // Here you would typically send the rating to your backend
    toast({
      title: 'Feedback Submitted',
      description: `Thank you for rating our app ${rating} out of 5 stars!`,
    });
    setOpen(false);
    setRating(0);
    setHover(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Our App</DialogTitle>
          <DialogDescription>
            If you're enjoying VERMA & CO., please take a moment to rate it.
            Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    'h-8 w-8 cursor-pointer transition-colors',
                    starValue <= (hover || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              </button>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
