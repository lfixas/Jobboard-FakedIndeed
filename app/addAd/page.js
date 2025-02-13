"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function AddAd() {

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

    const jobTypes = ["Full Time", "Part Time", "CDI", "CDD"];

    const positionLocationOptions = ["On-Site Work", "Semi-Remote Work", "Full-Remote Work"];

    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [positionLocation, setPositionLocation] = useState(positionLocationOptions[0]);
    const [advantages, setAdvantages] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || company === "" || !description || selectedTypes.length === 0) {
            alert("Title, company, description, and at least one job type are required. \nIf you don't have a company, contact an Admin.");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch("http://localhost:3000/api/ads", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ 
                    title,
                    company,
                    location,
                    description, 
                    jobTypes: selectedTypes,
                    minSalary,
                    maxSalary,
                    positionLocation,
                    advantages,
                 }),
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                throw new Error("Failed to create an ad");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleTypeChange = (type) => {
        if (selectedTypes.includes(type)) {
          setSelectedTypes(selectedTypes.filter((t) => t !== type));
        } else {
          setSelectedTypes([...selectedTypes, type]);
        };
    };

    return (
        <div className="max-w-8xl mx-16 p-2 flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label>Job Title: <span className="text-red-600">*</span></label>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className="border border-slate-500 px-8 py-2 required-custom-input"
                    type="text"
                    minlength="5"
                    maxlength="100"
                    required
                    placeholder="Job Title"
                />

                <label>Company name: <span className="text-red-600">*</span></label>
                <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="border border-slate-500 px-3 py-2 required-custom-input"
                >
                    <option value="">--- Select your company ---</option>
                    {matchingNames.map((option) => (
                    <option key={option.id} value={option}>
                        {option}
                    </option>
                    ))}
                </select>

                <label>Company Location: <span className="text-red-600">*</span></label>
                <input
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    className="border border-slate-500 px-8 py-2 required-custom-input"
                    type="text"
                    required
                    placeholder="67000 Strasbourg"
                />

                <label>Job Description: <span className="text-red-600">*</span></label>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="border border-slate-500 px-8 py-2 required-custom-input"
                    type="text"
                    minlength="20"
                    maxlength="5000"
                    required
                    placeholder="Job Description"
                />

                <label>Job Type(s): <span className="text-red-600">*</span></label>
                <div className="border border-slate-500 px-8 py-2 required-custom-input">
                    {jobTypes.map((type) => (
                        <label key={type} className="block">
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeChange(type)}
                            />
                            ‎ {type}
                        </label>
                    ))}
                </div>

                <label>Job Salary: </label>
                <div>
                    <label>Minimum Salary <span className="text-red-600">*</span></label>
                    <input
                    onChange={(e) => setMinSalary(e.target.value)}
                    value={minSalary}
                    className="border border-slate-500 px-8 py-2 required-custom-input"
                    type="number"
                    min="1"
                    required
                    placeholder="2500€"
                    />
                    <br></br>
                    
                    <label>Maximum Salary <span className="text-red-600">*</span></label>
                    <input
                    onChange={(e) => setMaxSalary(e.target.value)}
                    value={maxSalary}
                    className="border border-slate-500 px-8 py-2 required-custom-input"
                    type="number"
                    min="1"
                    required
                    placeholder="5000€"
                    />
                </div>

                <label>Job Location: <span className="text-red-600">*</span></label>
                <select
                    value={positionLocation}
                    onChange={(e) => setPositionLocation(e.target.value)}
                    className="border border-slate-500 px-3 py-2 required-custom-input"
                >
                    {positionLocationOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </select>

                <label>Job Advantages: </label>
                <textarea
                    onChange={(e) => setAdvantages(e.target.value)}
                    value={advantages}
                    className="border border-slate-500 px-8 py-2 required-custom-input"
                    type="text"
                    minlength="20"
                    maxlength="500"
                    placeholder="Job Advantages"
                />
                <div className="flex flex-col py-8 items-center justify-center">
                    <div className="w-1/2">
                        <button
                        type="submit"
                        className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full ${
                            isLoading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        disabled={isLoading}
                        >
                        {isLoading ? 'Loading...' : 'Add Job Ad'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
