"use client"

import { useState } from 'react';
import Link from "next/link";
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');

    

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        
        Cookies.set('yourEmail', email);
        

        try {
            const response = await fetch(`/api/users`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.status === 200) {
              const userData = await response.json();
              const numberOfElement = userData.length;
              
              var match = false;
      
                
                for (let i = 0; i < numberOfElement; i++){
                if (
                  userData[i].email === email
                ){
                    match = true;
                }
            }          
                if ( match === true) 
                {                  
                    router.push('/account/login');
                    
                  } else {
                    router.push('/account/register');
                  }
                } else if (response.status === 401) {
                } else {
                }
              } catch (error) {
                console.error(error);
        
    };}

    return (
        <div>
            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-gray-100 bg-opacity-100">
            <Link className="fixed top-44" href={"/"}>
                <img className="h-16" src="fakedindeed.png" alt="FakedIndeed"/>
            </Link>
                <div className="bg-white rounded-lg p-4 shadow-lg w-96 flex flex-col justify-between">
                    <div>
                        <div className="text-xl font-semibold pb-3">
                            <h1>A job before January?</h1>
                        </div>
                        <div className="font-light">
                            <p>Create an account or log in.</p>
                        </div>
                        <div className="font-light text-xs py-6">
                            <p>By creating or logging into your account, you acknowledge and agree that the companies and advertisements on this site are fictitious and are solely included for the purpose of a study project.</p>
                        </div>
                        <hr className="h-px my-2 bg-gray-200" />
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label className="text-xl font-semibold">Email: <span className="text-red-600">*</span></label>
                                <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="border border-slate-500 px-8 py-2 required-custom-input"
                                type="email"
                                required
                                placeholder="john.doe@example.com"
                                />
                                <div className="flex flex-col pt-8 items-center justify-center">
                                    <div className="w-full">
                                        <button
                                        type="submit"
                                        className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full flex items-center justify-center ${
                                            isLoading ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        disabled={isLoading}
                                        >
                                        {isLoading ? 'Loading...' : 'Continue'}
                                            <FaArrowRight className="pl-5" size={36} />
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