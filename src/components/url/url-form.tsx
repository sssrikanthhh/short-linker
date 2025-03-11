'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UrlFormData, urlSchema } from '@/lib/schemas';

export default function UrlForm() {
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: ''
    }
  });
  return (
    <>
      <div className='w-full max-w-2xl mx-auto'>
        <Form {...form}>
          <form className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-2'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder='Place your long url here...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>Shorten</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
