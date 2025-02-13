"use client"

import React, { useEffect, useState } from 'react';

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

export default function JobList() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    async function fetchAds() {
      const data = await getAds();

      if (data && data.length) {
        setAds(data.reverse());
      }
    }

    fetchAds();
  }, []);

  return (
    <>
      {ads.map((ad) => (
        <div key={ad.id} className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start">
          <h1>{ad.id}</h1>
          {ad.title}
          {ad.description}
        </div>
      ))}
    </>
  );
}
