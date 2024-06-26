// src/pages/index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
 
const HomePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return <div>Loading...</div>;
};

export default HomePage;
