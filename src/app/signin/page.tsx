
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignInFormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    startTransition(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast({ title: 'Success!', description: 'You are now signed in.' });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Sign In Failed',
        description: (error as Error).message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      startTransition(false);
    }
  };

   const handleGoogleSignIn = async () => {
    startTransition(true);
    try {
      await signInWithGoogle();
      toast({ title: "Success!", description: "You are now signed in with Google." });
      router.push("/");
    } catch (error) {
      toast({
        title: "Google Sign-In Failed",
        description: (error as Error).message || "Could not sign in with Google.",
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Sign in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">OR</span>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isPending}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
