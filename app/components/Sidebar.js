"use client"

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaAngleRight } from "react-icons/fa"
import Cookies from 'js-cookie';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [userType, setUserType] = useState(null);

  const email = Cookies.get('CookieUser');

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

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
              setUserType(matchingUsers.userType);
            } else {
            }
        } catch (error) {
            console.error("Error fetching ads: ", error);
        }
    };

    fetchUsers();
  }, [email]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button onClick={openSidebar}>
        <FaBars size={24} />
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-black backdrop-blur-sm bg-opacity-60">
          <div ref={sidebarRef} className="bg-white rounded-lg p-4 shadow-lg w-96 h-3/5 flex flex-col justify-between">
            <div>
              <div className="text-right">
                <button onClick={closeSidebar} className="close-button">
                  <FaTimes size={24} />
                </button>
              </div>
              <ul>
                {userType !== null && (
                  <div>
                    <li>
                      <Link onClick={closeSidebar} className="p-2 flex justify-between items-center hover:text-blue-900" href="/profile">
                        Edit Profile
                        <FaAngleRight className="ml-4" />
                      </Link>
                    </li>
                    <hr className="h-px my-2 bg-gray-200" />
                  </div>
                )}

                {userType === 'company' && (
                  <div>
                    <li>
                      <Link onClick={closeSidebar} className="p-2 flex justify-between items-center hover:text-blue-900" href="/addAd">
                        Post a Job Offer
                        <FaAngleRight className="ml-4" />
                      </Link>
                    </li>
                    <hr className="h-px my-2 bg-gray-200" />
                    <li>
                      <Link onClick={closeSidebar} className="p-2 flex justify-between items-center hover:text-blue-900" href="/applicants">
                        Job Applicants
                        <FaAngleRight className="ml-4" />
                      </Link>
                    </li>
                    <hr className="h-px my-2 bg-gray-200" />
                  </div>
                )}
  
                {userType === 'admin' && (
                  <div>
                    <li>
                      <Link onClick={closeSidebar} className="p-2 flex justify-between items-center hover:text-blue-900" href="/addAd">
                        Post a Job Offer
                        <FaAngleRight className="ml-4" />
                      </Link>
                    </li>
                    <hr className="h-px my-2 bg-gray-200" />
                    <li>
                      <Link onClick={closeSidebar} className="p-2 flex justify-between items-center hover:text-blue-900" href="/applicants">
                        Job Applicants
                        <FaAngleRight className="ml-4" />
                      </Link>
                    </li>
                    <hr className="h-px my-2 bg-gray-200" />
                    <li>
                      <Link onClick={closeSidebar} className="p-2 flex justify-between items-center hover:text-blue-900" href="/admin">
                        Admin Page
                        <FaAngleRight className="ml-4" />
                      </Link>
                    </li>
                    <hr className="h-px my-2 bg-gray-200" />
                  </div>
                )}

              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}