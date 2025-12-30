'use client';

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

interface RateAppDialogProps {
  children: React.ReactNode;
}

export default function RateAppDialog({ children }: RateAppDialogProps) {
  return (
    <Dialog>
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
            <p className="text-lg">Thank you for your support!</p>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button>Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
