"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { FaEnvelope, FaGlobe, FaPhone } from "react-icons/fa";
import JobList from "../components/jobs/JobList";

export default function Applicants() {

    const router = useRouter();

    // CompanyOptions

    const email = Cookies.get('CookieUser');
    const [matchingNames, setMatchingNames] = useState([]);
    const [companiesList, setCompaniesList] = useState([]);
    const [user, setUser] = useState(null);

    const getUsersOptions = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/companyOptions", {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            return res.json();
        } catch (error) {
            console.error("Error loading users: ", error);
        }
    };

    useEffect(() => {
        const fetchUsersOptions = async () => {
            try {
                const data = await getUsersOptions();

                const matchingUsers = data.filter(item => item.email === email);

                if (matchingUsers.length > 0) {
                    const names = matchingUsers.map(user => user.name).filter(Boolean);

                    if (names.length > 0) {
                        setMatchingNames(names);
                    }
                }
            } catch (error) {
                console.error("Error fetching user: ", error);
            }
        };

        fetchUsersOptions();
    }, [email]);

    ///

    // UserType

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
                setUser(matchingUsers.userType);
            } else {
            }
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    };

    fetchUsers();
    }, [email]);
    
    ///

    // All companies (only for admins)

    const getCompany = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/company", {
                cache: "no-store",
            });
    
            if (!res.ok) {
                throw new Error("Failed to fetch company");
            }
    
            return res.json();
        } catch (error) {
            console.error("Error loading company: ", error);
        }
        };
    
        useEffect(() => {
        if (user === 'admin') {
            async function fetchCompany() {
                const data = await getCompany();
        
                if (data && data.length) {
                const companyNames = data.map((company) => company.name);
        
                setCompaniesList(companyNames);
                }
            }
        
            fetchCompany();
            setMatchingNames(companiesList)
        }
        }, [user, companiesList, matchingNames]);

    ///

    const [applicants, setApplicants] = useState([]);

    const getApplicants = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/apply", {
            cache: "no-store",
          });
      
          if (!res.ok) {
            throw new Error("Failed to fetch applicants");
          }
      
          return res.json();
        } catch (error) {
          console.log("Error loading applicants: ", error);
        }
      };

      useEffect(() => {
        async function fetchApplicants() {
          const data = await getApplicants();
    
          if (data && data.length) {
            setApplicants(data);
          }
        }
    
        fetchApplicants();
      }, []);

    const [company, setCompany] = useState(".");

    const handleCompanyChange = (newCompany) => {
        setCompany(newCompany);
    };

    return (
        <div>
            <div>
                <label>Select your company name:</label>
                <select
                    value={company}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="border border-slate-500 px-3 py-2 required-custom-input"
                >
                    <option value=".">--- Select your company ---</option>
                    {matchingNames.map((option) => (
                    <option key={option.id} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
            </div>

            {/* Applicants */}
            <div className="lg:flex">
                <div className="lg:max-w-6xl text-new-base overflow-y-auto h-screen mx-4 p-2 flex-1">
                    {applicants.map((ap) => {
                        if (ap.company_name === company) {
                            const createdAtDate = new Date(ap.createdAt).toLocaleString();
                            return (
                            <div key={ap.id} className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start">
                                <div>
                                    <div className="text-blue-800 text-new-xs">
                                        Applied for the ad n°{ap.ad_id}
                                    </div>
                                    <div className="p-2" />
                                    <h2 className="font-bold text-new-2xl">{ap.name} {ap.lastname}</h2>
                                    <div className="p-2" />
                                    <div className="flex items-center text-new-xl font-light">
                                        <FaEnvelope className="mr-2" />
                                        {ap.email}
                                    </div>
                                    <div className="p-1" />
                                    <div className="flex items-center font-light">
                                        <FaPhone className="mr-2" />
                                        {ap.phone}
                                    </div>

                                    <hr className="h-px my-4 bg-gray-200" />
                                    
                                    <h3 className="font-bold text-new-2xl">Motivations</h3>
                                    <div className="text-gray-800 text-new-sm" style={{ whiteSpace: 'pre-line' }}>{ap.motivations}</div>

                                    <hr className="h-px my-4 bg-gray-200" />

                                    <div className="flex items-center font-light">
                                        <FaGlobe className="mr-2" />
                                        {ap.website}
                                    </div>

                                    <div className="p-2" />

                                    <div className="text-gray-600 text-new-xs">
                                        Applied the {createdAtDate}
                                    </div>
                                </div>
                            </div>
                            );
                        }
                    })}
                </div>
                <div className="lg:max-w-2xl overflow-y-auto h-screen mx-4 p-2 flex-1">
                    <JobList selectedCompany={company} />
                </div>
            </div>
        </div>
    )
}