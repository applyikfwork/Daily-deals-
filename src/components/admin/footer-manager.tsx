
'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateFooterSettingsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { FooterSettings } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const urlOrHash = z.string().refine(val => val === '#' || z.string().url().safeParse(val).success, {
  message: "Must be a valid URL or '#'",
});

const footerSettingsSchema = z.object({
  privacyPolicyUrl: urlOrHash,
  termsOfServiceUrl: urlOrHash,
  twitterUrl: urlOrHash,
  githubUrl: urlOrHash,
  linkedinUrl: urlOrHash,
  youtubeUrl: urlOrHash,
});

type FooterFormValues = z.infer<typeof footerSettingsSchema>;

type FooterManagerProps = {
  settings: FooterSettings;
}

export function FooterManager({ settings }: FooterManagerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: FooterFormValues) => {
    startTransition(async () => {
      const result = await updateFooterSettingsAction(data);
      if (result.success) {
        toast({ title: 'Success!', description: 'Footer settings have been updated.' });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Links</CardTitle>
        <CardDescription>Update the legal and social media links in your site's footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h4 className="font-medium text-sm mb-2">Legal Links</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="termsOfServiceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Service URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/terms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacyPolicyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Policy URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/privacy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            <div>
                <h4 className="font-medium text-sm mb-2">Social Media Links</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="twitterUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
