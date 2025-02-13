"use client"

import ApplyForm from "./applyFrom";
import Job from "../components/jobs/Job";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export default function ApplyJob() {
    const email = Cookies.get('CookieUser');
    const [user, setUser] = useState(null);
  
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
              } else {
              }
          } catch (error) {
              console.error("Error fetching user: ", error);
          }
      };
  
      fetchUsers();
    }, [email]);

    if (user === null) {
        const userEmpty = {
            "email": null,
            "name": null,
            "lastname": null,
            "phone": null,
            "website": null
        }
        return (
            <main className="lg:flex">
                <p>‎</p>
                <div className="lg:max-w-2xl mx-4 p-2 flex-1">
                <ApplyForm user={userEmpty} />
                </div>
                <div className="max-w-6xl overflow-y-auto h-screen mx-4 p-2 flex-1">
                <Job />
                </div>
            </main>
        )
    }

    return (
        <main className="lg:flex">
            <div className="lg:max-w-2xl mx-4 p-2 flex-1">
            <ApplyForm user={user} />
            </div>
            <div className="max-w-6xl overflow-y-auto h-screen mx-4 p-2 flex-1">
            <Job />
            </div>
        </main>
    )
}