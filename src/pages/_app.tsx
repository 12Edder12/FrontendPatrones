// src/pages/_app.tsx
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import { useRouter } from 'next/router';

const noAuthRequired = ['/login'];

function MyApp({ Component, pageProps }: any) {
  const router = useRouter();

  return (
    <AuthProvider>
      {noAuthRequired.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}

export default MyApp;
