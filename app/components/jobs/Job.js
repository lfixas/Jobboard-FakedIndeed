"use client"

import React, { useEffect, useState } from 'react';
import { FaMoneyBillAlt, FaBriefcase, FaMapMarkedAlt } from "react-icons/fa";
import Cookies from 'js-cookie';
import ApplyJobBtn from '../ApplyJobBtn';
import LikeJobBtn from '../LikeJobBtn';
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

export default function Job() {
  const [ad, setAd] = useState();
  const pathname = usePathname()

  useEffect(() => {
    const lastAdViewId = Number(Cookies.get("LastAdView"));

    getAds().then(data => {
      const matchingAd = data.find(item => item.id === lastAdViewId);

      if (matchingAd) {
        setAd(matchingAd);
      } else {
        setAd(null);
      }
    });
    
  }, []);  

  if (ad) {

    const jobTypesArray = JSON.parse(ad.jobTypes);

    return (
      <div>
        <div key={ad.id} className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start">
           
            {/* Header */}

              <div>
                <h2 className="font-bold text-new-2xl break-words">{ad.title}</h2>
                <div className="p-2" />
                <div className="text-new-xl font-light">{ad.company}</div>
                {ad.location && <div className="text-gray-500 text-new-base font-light">{ad.location}</div>}
                <div className="font-light">
                  {ad.minSalary && <div className="flex text-new-base items-center">
                      {ad.minSalary}€
                      {ad.maxSalary && <div>‎ – {ad.maxSalary}€</div>}
                      <div className="font-light">‎ - {jobTypesArray.join(', ')}</div>
                  </div>}
                </div>
                {pathname !== '/apply' && (
                  <div className="flex items-center text-new-base justify-between">
                    <div className="flex items-center mt-4">
                      <ApplyJobBtn />
                    </div>
                    {/* <div className="flex items-center pl-5 mt-4">
                      <LikeJobBtn />
                    </div> */}
                </div>
                )}
                <hr className="h-px my-8 bg-gray-200" />

                {/* Details */}

                <h3 className="font-bold text-new-2xl">Details</h3>
                <div className="p-2" />
                <div className="flex items-center text-new-base font-bold">
                    <FaMoneyBillAlt className="mr-2" />
                    Salary:
                </div>
                {ad.minSalary && <div className="flex items-center text-new-sm pl-6">
                {ad.minSalary}€
                {ad.maxSalary && <div>‎ – {ad.maxSalary}€</div>}
              </div>}
              <div className="p-2" />
              <div className="flex text-new-base items-center font-bold">
                    <FaBriefcase className="mr-2" />
                    Post Type:
              </div>
              {jobTypesArray && jobTypesArray.length > 0 && (
              <div className="flex text-new-base items-center text-new-sm">
                <div className="pl-6" />
                {jobTypesArray.map((jobType, index) => (
                  <span
                    key={index}
                    className={`bg-gray-200 rounded-lg p-2 text-new-sm ${
                      index > -1 ? 'mr-2' : ''
                    }`}
                  >
                    {jobType}
                  </span>
                ))}
              </div>
            )}
                <div className="p-2" />
                <div className="flex text-new-base items-center font-bold">
                    <FaMapMarkedAlt className="mr-2" />
                    Position Location:
              </div>
              <div className="flex items-center text-new-sm">
                <div className="pl-6" />
                  <div className="bg-gray-200 rounded-lg p-2 text-new-sm">
                    {ad.positionLocation}
                  </div>
                </div>

                <hr className="h-px my-8 bg-gray-200" />

                {/* Advantages */}

                <h3 className="font-bold text-new-2xl">Advantages</h3>
                <div className="p-2" />
                <div className="text-gray-800 text-new-sm" style={{ whiteSpace: 'pre-line' }}>{ad.advantages}</div>

                {/* Description */}

                <hr className="h-px my-8 bg-gray-200" />
                <div className="text-gray-800 text-new-sm" style={{ whiteSpace: 'pre-line' }}>{ad.description}</div>
                <div className="p-2" />
                <div className="text-gray-600 text-new-xs">{getTimeDifference(ad.createdAt, ad.updatedAt)}</div>
            </div>
        </div>
      </div>
    );
  }
};