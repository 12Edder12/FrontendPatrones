import { useEffect, useState } from "react";
import { IUser } from "../types/IUser";
import Cookies from 'js-cookie';

export function useUsers() {
  const [Users, setUsers] = useState<IUser[]>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:3000/Users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      setUsers(jsonResponse as IUser[]);
    }
  };

  const createUser = async (User: Partial<IUser>) => {
    const token = Cookies.get('token');
    const response = await fetch(`http://localhost:3000/Users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer ${Cookie.get}"
      },
      body: JSON.stringify(User),
    });

    if (response.ok) {
      fetchUsers();
    }
  };

  const deleteUser = async (id: number) => {
    const response = await fetch(`http://localhost:3000/Users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchUsers();
    }
  };
  const updateUser = async (User: Partial<IUser>) => {
    const response = await fetch(
      "http://localhost:3000/Users/" + User.id_user,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...User, id: undefined }),
      }
    );

    if (response.ok) {
      await fetchUsers();
    }
  };

  return {
    Users,
    deleteUser,
    fetchUsers,
    updateUser,
    createUser,
  };
}
