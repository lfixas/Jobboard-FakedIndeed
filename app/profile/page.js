"use client"

import EditProfile from './EditProfile'
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export default function page() {
  const email = Cookies.get('CookieUser');
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState("");
  const [companiesList, setCompaniesList] = useState([]);
  const [editProfileKey, setEditProfileKey] = useState(0);

  const getUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading users: ", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            
            const data = await getUsers();
            const matchingUsers = data.find(item => item.email === email);
            
            if (matchingUsers) {
              setUser(matchingUsers);
              setUserType(matchingUsers.userType);
            }

            if (data && data.length) {
              const usersEmail = data.map((user) => user.email);
      
              setCompaniesList(usersEmail);
            }

        } catch (error) {
            console.error("Error fetching ads: ", error);
        }
    };

    fetchUsers();
  }, [email]);

  const handleUserChange = (newUser) => {
    setUsers(newUser);
    const fetchUsers = async () => {
      try {
          
          const data = await getUsers();
          const matchingUsers = data.find(item => item.email === users);
          
          if (matchingUsers) {
            setUser(matchingUsers);
          }

      } catch (error) {
          console.error("Error fetching ads: ", error);
      }
    };

    fetchUsers();
    setEditProfileKey((prevKey) => prevKey + 1);
  };

  if (user === null) {
      return <p className="text-2xl font-light">Loading your Profile...</p>;
  }

  console.log(user)

  return (
    <div>
      {userType === 'admin' && (
        <div className="p-6">
            <h1 className="text-2xl pt-3 font-bold mb-4">See users</h1>
            <div>
                <label>Select a user email:</label>
                <select
                    value={users}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="border border-slate-500 px-3 py-2 required-custom-input"
                >
                    <option value="">--- Select a user email ---</option>
                    {companiesList.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
            </div>
        </div>
      )}
      <div className="max-w-8xl mx-16 p-2 flex-1">
        <EditProfile key={editProfileKey} user={user} />
      </div>
    </div>
  )
}