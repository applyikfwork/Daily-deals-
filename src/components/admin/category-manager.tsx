
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCategoryAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters.'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryManagerProps = {
  initialCategories: string[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const onSubmit = (data: CategoryFormValues) => {
    startTransition(async () => {
      const result = await addCategoryAction(data);
      if (result.success) {
        toast({ title: 'Success!', description: 'New category has been added.' });
        setCategories(prev => [...prev, data.name].sort());
        form.reset();
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
        <CardTitle>Categories</CardTitle>
        <CardDescription>Add new categories or view existing ones.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>New Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Home & Kitchen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <div className="space-y-2">
            <h4 className="font-medium text-sm">Existing Categories</h4>
            <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                    categories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)
                ) : (
                    <p className="text-sm text-muted-foreground">No categories found.</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
