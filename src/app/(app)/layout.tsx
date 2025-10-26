'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex min-h-screen w-full bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <Skeleton className='h-full w-full' />
        </aside>
        <div className="flex flex-1 flex-col sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Skeleton className='h-8 w-8 sm:hidden' />
                <div className='ml-auto flex items-center gap-4'>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-8 w-8 rounded-full' />
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6">
                <Skeleton className='h-full w-full' />
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <SidebarNav />
      <div className="flex flex-1 flex-col sm:pl-14">
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
