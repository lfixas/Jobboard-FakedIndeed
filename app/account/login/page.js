"use client"

import { useState, useEffect} from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const email = Cookies.get('yourEmail');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);


        try {
            const response = await fetch(`/api/users`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.status === 200) {
              // Successful login
              const userData = await response.json();
              const numberOfElement = userData.length;
              console.log(numberOfElement);
              var match = false;
                
                for (let i = 0; i < numberOfElement; i++){
                if (
                  userData[i].email === email && userData[i].password === password
                ){
                    match = true;
                    Cookies.set('CookieUser', email);
                }
            }   
            
                
                if ( match === true) 
                {
                    router.push('/');
                    
                  } else {
                    alert('Wrong password');
                    setIsLoading(false);
                  }
                } else if (response.status === 401) {
                } else {
                }
              } catch (error) {
                console.error(error);
        
    }

    };

    const handleForget = (e) => {
        e.preventDefault();
        alert("c kon");

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
                            <h1>We're glad to see you again</h1>
                        </div>
                        <div className="font-light flex">
                            <p>Login as</p> <b className="pl-1">{ email }</b>.<Link className="text-blue-900 pl-1 underline" href="/account">It is not you?</Link>
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
                                <div className="flex flex-col pt-8 items-center justify-center">
                                    <div className="w-full">
                                        <button
                                        type="submit"
                                        className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full ${
                                            isLoading ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        disabled={isLoading}
                                        >
                                        {isLoading ? 'Loading...' : 'Login'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="flex flex-col pt-8 items-center justify-center">
                            <div className="w-full">
                                <button onClick={handleForget} className="text-blue-900 py-3 px-6 w-full">
                                    Forgot your password?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}