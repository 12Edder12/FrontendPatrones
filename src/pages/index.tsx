// src/pages/index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './login'; // Importa el componente de login

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
    }
  }, [user, router]);

  if (!user) {
    return <Login />; // Muestra el componente de login si no hay usuario
  }

  return <div>Loading...</div>; // Muestra un mensaje de carga mientras se redirige
};

export default HomePage;
