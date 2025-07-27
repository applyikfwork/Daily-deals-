'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { addDealAction, categorizeDealAction } from '@/lib/actions';
import { Wand2 } from 'lucide-react';

const dealSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  originalPrice: z.coerce.number().positive('Original price must be a positive number.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  link: z.string().url('Please enter a valid deal link.'),
  category: z.string().min(1, 'Category is required.'),
  expireAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date"}),
  isHotDeal: z.boolean(),
});

type DealFormValues = z.infer<typeof dealSchema>;

type DealFormProps = {
  categories: string[];
  onFormSubmit: () => void;
}

export function DealForm({ categories, onFormSubmit }: DealFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [isCategorizing, startCategorizingTransition] = React.useTransition();

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      imageUrl: 'https://placehold.co/600x400.png',
      link: 'https://example.com',
      category: '',
      expireAt: addDays(new Date(), 15).toISOString().split('T')[0], // Default to 15 days from now
      isHotDeal: false,
    },
  });

  const handleCategorize = async () => {
    const title = form.getValues('title');
    const description = form.getValues('description');

    if (!title || !description) {
      toast({
        title: 'Title and Description needed',
        description: 'Please fill in the title and description before using AI categorization.',
        variant: 'destructive',
      });
      return;
    }

    startCategorizingTransition(async () => {
      const result = await categorizeDealAction({ title, description });
      if (result.success && result.category) {
        form.setValue('category', result.category, { shouldValidate: true });
        toast({
          title: 'AI Categorization Complete',
          description: `Deal categorized as "${result.category}".`,
        });
      } else {
        toast({
          title: 'AI Categorization Failed',
          description: result.error || 'Could not categorize the deal.',
          variant: 'destructive',
        });
      }
    });
  };

  const onSubmit = (data: DealFormValues) => {
    startTransition(async () => {
      const result = await addDealAction(data);
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'New deal has been added.',
        });
        form.reset();
        onFormSubmit();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="e.g., OnePlus Nord CE 3 5G" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe the deal..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discounted Price (₹)</FormLabel>
                <FormControl><Input type="number" placeholder="19999" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price (₹)</FormLabel>
                <FormControl><Input type="number" placeholder="24999" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Link</FormLabel>
                  <FormControl><Input type="url" placeholder="https://amzn.in/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormItem>
          <FormLabel>Category</FormLabel>
          <div className="flex gap-2 items-center">
            <FormControl>
                <Input placeholder="e.g., Mobile" {...form.register('category')} />
            </FormControl>
            <Button type="button" variant="outline" size="icon" onClick={handleCategorize} disabled={isCategorizing}>
              <Wand2 className="h-4 w-4" />
              <span className="sr-only">Categorize with AI</span>
            </Button>
          </div>
          <FormDescription>Enter a category or use the AI to suggest one based on title/description.</FormDescription>
          <FormMessage {...form.getFieldState('category')} />
        </FormItem>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expireAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="isHotDeal"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                    <FormLabel>Hot Deal?</FormLabel>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                </FormItem>
              )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Adding Deal...' : 'Add Deal'}
        </Button>
      </form>
    </Form>
  );
}
