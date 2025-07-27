'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { DealForm } from './deal-form';

type AddDealDialogProps = {
  categories: string[];
}

export function AddDealDialog({ categories }: AddDealDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add a New Deal</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new deal. Click 'Add Deal' when you're done.
          </DialogDescription>
        </DialogHeader>
        <DealForm categories={categories} onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
