"use client"

import JobList from "../components/jobs/JobList";
import { useState, useEffect } from "react";

export default function EditandViewAds() {
    const [company, setCompany] = useState("");
    const [companiesList, setCompaniesList] = useState([]);

    const handleCompanyChange = (newCompany) => {
        setCompany(newCompany);
    };

    const getCompany = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/company", {
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
        async function fetchCompany() {
          const data = await getCompany();
    
          if (data && data.length) {
            const companyNames = data.map((company) => company.name);
    
            setCompaniesList(companyNames);
          }
        }
    
        fetchCompany();
      }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl pt-3 font-bold mb-4">See ads</h1>
            <div>
                <label>Select a company name:</label>
                <select
                    value={company}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="border border-slate-500 px-3 py-2 required-custom-input"
                >
                    <option value="">--- Select a company ---</option>
                    {companiesList.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
            </div>
            <JobList selectedCompany={company} />
        </div>
    )
}