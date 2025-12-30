'use client';

import { useToast } from '@/hooks/use-toast';
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
import { useState } from 'react';
import { Copy } from 'lucide-react';

interface ShareAppDialogProps {
  children: React.ReactNode;
}

export default function ShareAppDialog({ children }: ShareAppDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'VERMA & CO.',
      text: 'Check out this awesome expense tracking app!',
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // This can happen if the user cancels the share sheet.
        // We don't need to show a toast or open the dialog in that case.
        console.log('Share was cancelled or failed', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setOpen(true);
    }
  };

  const handleCopyToClipboard = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(
      () => {
        toast({ title: 'Success', description: 'URL copied to clipboard!' });
        setOpen(false);
      },
      (err) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to copy URL.',
        });
        console.error('Could not copy text: ', err);
      }
    );
  };

  // We wrap the original trigger (children) and attach the share handler to it.
  // This ensures the share API is called from a direct user interaction.
  const Trigger = <div onClick={handleShare}>{children}</div>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share App</DialogTitle>
          <DialogDescription>
            Your browser doesn't support native sharing. You can copy the link
            instead.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={window.location.origin}
            className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
          />
          <Button onClick={handleCopyToClipboard} size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
