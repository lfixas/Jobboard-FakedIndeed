"use client"

import EditAdForm from "./EditAdForm";
import { useState, useEffect } from "react";

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

export default function EditAd({ params }) {
    const [ad, setAd] = useState(null);
    const id = +params.id;

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const data = await getAds();
                const matchingAd = data.find(item => item.id === id);
                
                if (matchingAd) {
                    setAd(matchingAd);
                } else {
                    setAd(null);
                }
            } catch (error) {
                console.error("Error fetching ads: ", error);
            }
        };

        fetchAd();
    }, [id]);

    if (ad === null) {
        return <p className="text-2xl font-light">Loading ad...</p>;
    }

    return (
        <div className="max-w-8xl mx-16 p-2 flex-1">
            <EditAdForm ad={ad}/>
        </div>
    );
}
