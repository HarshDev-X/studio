'use client';

import Link from 'next/link';
import {
  getAuth,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function UserNav() {
  const { auth, user } = useFirebase();
  const router = useRouter();
  const avatarImage = PlaceHolderImages.find((p) => p.id === 'user-avatar-1');

  const handleSignOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {user?.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || ''} />
            ) : (
              avatarImage && (
                <AvatarImage
                  src={avatarImage.imageUrl}
                  alt="@shadcn"
                  data-ai-hint={avatarImage.imageHint}
                />
              )
            )}
            <AvatarFallback>
              {user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
