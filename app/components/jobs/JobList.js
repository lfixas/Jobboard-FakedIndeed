"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import RemoveBtn from '../RemoveBtn'
import { HiPencilAlt} from "react-icons/hi"
import { FaMapMarkerAlt, FaMoneyBillAlt, FaBriefcase } from "react-icons/fa"
import LearnMoreBtn from '../LearnMoreBtn'
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation'

const getTimeDifference = (createdAt, updatedAt) => {
  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);

  if (updatedAt !== createdAt) {
    return `Updated ${getTimeAgo(updatedAtDate)}`;
  } else {
    return `Offer published ${getTimeAgo(createdAtDate)}`;
  }
};

const getTimeAgo = (date) => {
  const now = new Date();
  const timeDifference = now - date;
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  if (hoursDifference >= 24) {
    const daysDifference = Math.floor(hoursDifference / 24);
    return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
  } else {
    return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''} ago`;
  }
};


// CompanyOptions

const getUsersCompany = async () => {
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

///

const getAds = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/ads", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch ads");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading ads: ", error);
  }
};

export default function JobList({ reloadJobComponent, selectedCompany }) {

  const [ads, setAds] = useState([]);
  const pathname = usePathname()
  const [userType, setUserType] = useState(null);

  const truncateDescription = (description) => {
    if (description && description.length <= 100) {
      return description;
    }
    return description ? description.slice(0, 150) + '...' : '';
  };
  
  useEffect(() => {
    async function fetchAds() {
      const data = await getAds();

      if (data && data.length) {
        setAds(data.reverse());
      }
    }

    fetchAds();
  }, []);

  // CompanyOptions
  const email = Cookies.get('CookieUser');
  const [matchingNames, setMatchingNames] = useState([]);

  useEffect(() => {
    const fetchUsersCompany = async () => {
        try {
            const data = await getUsersCompany();

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

    fetchUsersCompany();
  }, [email]);

  ///

  /// Admin option

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

  ///
  
  return (
    <>

    {ads.map((ad) => {
        if (selectedCompany === '' || selectedCompany === ad.company) {
          return (
      <div key={ad.id} className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start">
        <div>
          {matchingNames.find(item => item === ad.company) && (
          <div>
            <div className="text-blue-800 text-new-xs">
                ad n°{ad.id}
            </div>
            <div className="p-2" />
          </div>
          )}
          <h2 className="font-bold text-new-2xl break-words">{ad.title}</h2>
          <div className="p-2" />
          <div className="text-new-xl">{ad.company}</div>
          <div className="p-1" />
          {ad.location && <div className="flex text-new-base items-center">
            <FaMapMarkerAlt className="mr-2" />
            {ad.location}
          </div>}
          {ad.minSalary && <div className="flex text-new-base items-center">
            <FaMoneyBillAlt className="mr-2" />
            {ad.minSalary}€
            {ad.maxSalary && <div>‎ – {ad.maxSalary}€</div>}
          </div>}
          {ad.jobTypes && Array.isArray(ad.jobTypes) && ad.jobTypes.length > 0 && (
            <div className="flex text-new-base items-center">
              <FaBriefcase className="mr-2" />
              {ad.jobTypes.map((jobType, index) => (
                <span key={index} className={`bg-gray-200 rounded-lg p-2 text-new-sm ${index > -1 ? 'mr-2' : ''}`}>
                  {jobType}
                </span>
              ))}
            </div>
          )}
          
          <div className="p-2" />

          <div className="text-gray-400 text-new-sm">{truncateDescription(ad.description)}</div>
          <div className="p-2" />
          <div className="text-gray-600 text-new-xs">{getTimeDifference(ad.createdAt, ad.updatedAt)}</div>
        </div>

        <div className="flex gap-2">
          {matchingNames.find(item => item === ad.company) && (
          <div className="flex gap-2">
            <RemoveBtn id={ad.id} />
            <Link href={`/editAd/${ad.id}`} passHref>
              <div className="relative group">
                <div className="group-hover:opacity-100 opacity-80 text-sky-600">
                  <HiPencilAlt size={24} />
                </div>
                <div className={`tooltip group-hover:opacity-100 opacity-0 bg-gray-800 text-white px-2 py-1 text-new-sm rounded absolute top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 pointer-events-none`}>
                  Edit
                </div>
              </div>
            </Link>
          </div>
          )}
          {userType === 'admin' && (
          <div className="flex gap-2">
            <RemoveBtn id={ad.id} />
            <Link href={`/editAd/${ad.id}`} passHref>
              <div className="relative group">
                <div className="group-hover:opacity-100 opacity-80 text-sky-600">
                  <HiPencilAlt size={24} />
                </div>
                <div className={`tooltip group-hover:opacity-100 opacity-0 bg-gray-800 text-white px-2 py-1 text-new-sm rounded absolute top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 pointer-events-none`}>
                  Edit
                </div>
              </div>
            </Link>
          </div>
          )}
          {pathname !== '/admin' && (
            <div>
            {pathname !== '/applicants' && (
              <LearnMoreBtn id={ad.id} reloadJobComponent={reloadJobComponent} />
            )}
            </div>
          )}
        </div>
      </div>
      );
    }
  })}
    </>
  );
}