"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function EditAdForm({ ad }) {

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

    const {
        id,
        title,
        company,
        location,
        description,
        jobTypes,
        minSalary,
        maxSalary,
        positionLocation,
        advantages
    } = ad;

    const jobTypesOptions = ["Full Time", "Part Time", "CDI", "CDD"];

    const positionLocationOptions = ["On-Site Work", "Semi-Remote Work", "Full-Remote Work"];

    const [newTitle, setNewTitle] = useState(title);
    const [newCompany, setNewCompany] = useState(company);
    const [newLocation, setNewLocation] = useState(location);
    const [newDescription, setNewDescription] = useState(description);
    const [newSelectedTypes, setNewSelectedTypes] = useState('');
    const [newMinSalary, setNewMinSalary] = useState(minSalary);
    const [newMaxSalary, setNewMaxSalary] = useState(maxSalary);
    const [newPositionLocation, setNewPositionLocation] = useState(positionLocation);
    const [newAdvantages, setNewAdvantages] = useState(advantages);

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newTitle || !newDescription || newSelectedTypes.length === 0) {
            alert("Title, description, and at least one job type are required.");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:3000/api/ads`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },

                body: JSON.stringify({
                    "id": id,
                    "title": newTitle,
                    "company": newCompany,
                    "location": newLocation,
                    "description": newDescription,
                    "jobTypes": JSON.stringify(newSelectedTypes),
                    "minSalary": newMinSalary,
                    "maxSalary": newMaxSalary,
                    "positionLocation": newPositionLocation,
                    "advantages": newAdvantages,
                  }),
            });

            if (!res.ok) {
                throw new Error("Failed to update ad");
            }

            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleTypeChange = (type) => {
        if (newSelectedTypes.includes(type)) {
          setNewSelectedTypes(newSelectedTypes.filter((t) => t !== type));
        } else {
          setNewSelectedTypes([...newSelectedTypes, type]);
        };
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label>Job Title: <span className="text-red-600">*</span></label>
            <input
                onChange={(e) => setNewTitle(e.target.value)}
                value={newTitle}
                className="border border-slate-500 px-8 py-2 required-custom-input"
                type="text"
                minlength="5"
                maxlength="100"
                required
                placeholder="Job Title"
            />

            <label>Company name: <span className="text-red-600">*</span></label>
            <select
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="border border-slate-500 px-3 py-2 required-custom-input"
            >
                {matchingNames.map((option) => (
                <option key={option.id} value={option}>
                    {option}
                </option>
                ))}
            </select>

            <label>Company Location: <span className="text-red-600">*</span></label>
            <input
                onChange={(e) => setNewLocation(e.target.value)}
                value={newLocation}
                className="border border-slate-500 px-8 py-2 required-custom-input"
                type="text"
                required
                placeholder="67000 Strasbourg"
            />

            <label>Job Description: <span className="text-red-600">*</span></label>
            <textarea
                onChange={(e) => setNewDescription(e.target.value)}
                value={newDescription}
                className="border border-slate-500 px-8 py-2 required-custom-input"
                type="text"
                minlength="20"
                maxlength="5000"
                required
                placeholder="Job Description"
            />

            <label>Job Type(s): <span className="text-red-600">*</span></label>
            <div className="border border-slate-500 px-8 py-2 required-custom-input">
                {jobTypesOptions.map((type) => (
                    <label key={type} className="block">
                        <input
                            type="checkbox"
                            checked={newSelectedTypes.includes(type)}
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
                onChange={(e) => setNewMinSalary(e.target.value)}
                value={newMinSalary}
                className="border border-slate-500 px-8 py-2 required-custom-input"
                type="number"
                min="1"
                required
                placeholder="2500€"
                />
                <br></br>
                
                <label>Maximum Salary</label>
                <input
                onChange={(e) => setNewMaxSalary(e.target.value)}
                value={newMaxSalary}
                className="border border-slate-500 px-8 py-2 required-custom-input"
                type="number"
                min="1"
                placeholder="5000€"
                />
            </div>

            <label>Job Location: <span className="text-red-600">*</span></label>
            <select
                value={newPositionLocation}
                onChange={(e) => setNewPositionLocation(e.target.value)}
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
                onChange={(e) => setNewAdvantages(e.target.value)}
                value={newAdvantages}
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
                    {isLoading ? 'Loading...' : 'Update Job Ad'}
                    </button>
                </div>
            </div>
        </form>
    )
}