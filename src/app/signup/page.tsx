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

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Logo />
                    <h1 className="text-2xl font-headline font-bold text-primary">ExpenseWise</h1>
                </div>
                <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
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
