'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserDashboard from "@/components/user-dashboard";
import { courses } from "@/lib/data";
import { ClientOnly } from "@/components/client-only";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // No default course selection - user will choose from dashboard

  useEffect(() => {
    // Check if the user is authenticated
    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    } else if (status === 'authenticated') {
      console.log('User authenticated:', session?.user?.name);
      setIsLoading(false);
    }
  }, [status, session, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // No need to check for a default course anymore

  return (
    <ClientOnly>
      <UserDashboard course={courses[0]} />
    </ClientOnly>
  );
}
