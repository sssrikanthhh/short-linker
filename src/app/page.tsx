import { Button } from '@/components/ui/button';
import UrlForm from '@/components/url/url-form';

export default function Home() {
  return (
    <section className='flex flex-1 flex-col items-center justify-center p-6 md:p-24'>
      <div className='w-full max-w-3xl mx-auto text-center'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
          Shorten links in seconds with Short Linker
        </h1>
        <p className='text-base text-muted-foreground mb-8 max-w-2xl mx-auto text-justify'>
          The Ultimate URL Shortening Platform with Smart AI Protection.
          Effortlessly shorten and manage your links while ensuring safety and
          reliability with advanced AI-powered URL flagging. Transform long URLs
          into sleek, shareable links and keep them secure like never before.
        </p>

        <UrlForm />
      </div>
    </section>
  );
}
