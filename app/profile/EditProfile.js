"use client"

import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function EditProfile({ user }) {

  const {
    id,
    email,
    password,
    name,
    lastname,
    phone,
    website
} = user;
  
    const [newEmail, setNewEmail] = useState(email);
    const [newPassword, setNewPassword] = useState(password);
    const [newName, setNewName] = useState(name);
    const [newLastname, setNewLastname] = useState(lastname);
    const [newPhone, setNewPhone] = useState(phone);
    const [newWebsite, setNewWebsite] = useState(website);

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:3000/api/users`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },

            body: JSON.stringify({
                "id": id,
                "email": newEmail,
                "password": newPassword,
                "name": newName,
                "lastname": newLastname,
                "phone": newPhone,
                "website": newWebsite,
              }),
        });

        if (!res.ok) {
            throw new Error("Failed to update user");
        }

        router.refresh();
        router.push("/");
      } catch (error) {
          console.log(error);
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label>Name: <span className="text-red-600">*</span></label>
            <input
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="text"
              required
              placeholder="Doe"
            />
            <label htmlFor="lastname">Lastname: <span className="text-red-600">*</span></label>
            <input
              onChange={(e) => setNewLastname(e.target.value)}
              value={newLastname}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="text"
              required
              placeholder="John"
            />
            <label>Email: <span className="text-red-600">*</span></label>
            <input
              onChange={(e) => setNewEmail(e.target.value)}
              value={newEmail}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="email"
              required
              placeholder="john.doe@example.com"
            />
            <label>Password: <span className="text-red-600">*</span></label>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="password"
              required
              placeholder="password"
            />
            <label>Phone:</label>
            <input
              onChange={(e) => setNewPhone(e.target.value)}
              value={newPhone}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="tel"
              minlength="12"
              maxlength="12"
              placeholder="+33612345678"
            />
            <label>Website:</label>
            <input
              onChange={(e) => setNewWebsite(e.target.value)}
              value={newWebsite}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="url"
              pattern="http.*"
              placeholder="https://johndoe.com"
            />
            <label>Upload CV:</label>
            <input
              onChange={(e) => setNewCvFile(e.target.files[0])}
              className="border border-slate-500 px-8 py-2 required-custom-input"
              type="file"
              accept=".pdf,.doc,.docx"
            />
            <label className="text-sm text-gray-600" >PDF, DOC, DOCX (5 Mo)</label>
            <div className="flex flex-col py-8 items-center justify-center">
                <div className="w-1/2">
                    <button
                    type="submit"
                    className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={isLoading}
                    >
                    {isLoading ? 'Loading...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </form>
      </div>
    );
  };