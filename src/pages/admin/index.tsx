// pages/admin/index.tsx
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import Navbar from "../../components/user/Navbar"; 

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar/>
      <div className="flex flex-col items-center justify-center bg-white flex-grow">
      <h1 className="text-4xl font-bold text-purple-700 mb-10">
          Welcome Admin - Menu
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
  
        <Link href="/admin/users">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 border border-gray-300 rounded-lg p-6 text-center text-white transition-transform transform hover:scale-105">
            Manage Users
          </div>
        </Link>
        <Link href="/admin/roles">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 border border-gray-300 rounded-lg p-6 text-center text-white transition-transform transform hover:scale-105">
            Assign Roles
          </div>
        </Link>
        <Link href="/admin/servers">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 border border-gray-300 rounded-lg p-6 text-center text-white transition-transform transform hover:scale-105">
            Manage Servers
          </div>
        </Link>
        <Link href="/admin/templates">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 border border-gray-300 rounded-lg p-6 text-center text-white transition-transform transform hover:scale-105">
            Manage Templates
          </div>
        </Link>
        <div
          className="bg-gradient-to-r from-red-500 to-red-700 border border-red-600 rounded-lg p-6 text-center text-white cursor-pointer transition-transform transform hover:scale-105"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminPage;
