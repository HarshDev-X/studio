import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "@/components/logo"
import GoogleIcon from "@/components/google-icon"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Logo />
                    <h1 className="text-2xl font-headline font-bold text-primary">VERMA & CO.</h1>
                </div>
                <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account or sign in with a provider.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 h-4 w-4"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Guest
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">
                                <GoogleIcon className="mr-2 h-4 w-4" />
                                Google
                            </Link>
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="full-name">Full name</Label>
                        <Input id="full-name" placeholder="Max Robinson" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <Button type="submit" className="w-full" asChild>
                        <Link href="/dashboard">Create an account</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/">Back to Home</Link>
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
