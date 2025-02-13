"use client"

import { useState, useEffect} from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function RegisterPage() {
    const accountOptions = ["individual", "company"];   
    const router = useRouter();
    
    const [userType, setUserType] = useState(accountOptions[0]);
    const [isLoading, setIsLoading] = useState(false);
    
    const email = Cookies.get('yourEmail');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

    try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ 
                email,
                password,
                userType
            }),
        });
  
        if (res.ok) {
            if (userType === 'company'){
                router.refresh();
                window.open('http://localhost:3001/send-email', '_blank');

                router.push("/profile");}
            else {
                router.refresh();
                router.push("/profile");
            }
            
            Cookies.set('CookieUser', email);
            router.refresh();
        } else {
            throw new Error("Failed to create an user");
        }
    } catch (error) {
        console.log(error);
    }

}


    return (
        <div>
            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-gray-100 bg-opacity-100">
            <Link className="fixed top-44" href={"/"}>
                <img className="h-16" src="fakedindeed.png" alt="FakedIndeed"/>
            </Link>
                <div className="bg-white rounded-lg p-4 shadow-lg w-96 flex flex-col justify-between">
                    <div>
                        <div className="text-xl font-semibold pb-3">
                            <h1>Welcome!</h1>
                        </div>
                        <div className="font-light flex">
                            <p>Create an account as</p> <b className="pl-1">{ email }</b>.<Link className="text-blue-900 pl-1 underline" href="/account">It is not you?</Link>
                        </div>
                        <hr className="h-px my-2 bg-gray-200" />
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label className="text-xl font-semibold">Password: <span className="text-red-600">*</span></label>
                                <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="border border-slate-500 px-8 py-2 required-custom-input"
                                type="password"
                                required
                                />
                                <label className="text-xl font-semibold">Create an account as: <span className="text-red-600">*</span></label>
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="border border-slate-500 px-3 py-2 required-custom-input"
                                >
                                    {accountOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </select>
                                <div className="font-light text-xs py-6">
                                    <p>By creating your account, you acknowledge and agree that the companies and advertisements on this site are fictitious and are solely included for the purpose of a study project.</p>
                                </div>
                                <div className="flex flex-col pt-8 items-center justify-center">
                                    <div className="w-full">
                                        <button
                                        type="submit"
                                        className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full ${
                                            isLoading ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        disabled={isLoading}
                                        >
                                        {isLoading ? 'Loading...' : 'Create an account'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
