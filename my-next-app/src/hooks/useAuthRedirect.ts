
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '@/firebaseinit';

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home');
      }
    });

    return () => unsubscribe();
  }, [router]);
};
