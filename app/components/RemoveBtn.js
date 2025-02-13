"use client"

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveBtn({ id }) {
    const router = useRouter();
    const removeAd = async() => {
        const confirmed = confirm("Are you sure you want to delete this?");

        if (confirmed) {
            const res = await fetch(`http://localhost:3000/api/ads`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id }),
            });

            if (res.ok) {
                router.refresh();
            }
        }
    };

    return (
      <>
        <div className="relative group">
          <button onClick={removeAd} className="group-hover:opacity-100 opacity-80 text-red-500">
            <HiOutlineTrash size={24} />
          </button>
          <div className={`tooltip group-hover:opacity-100 opacity-0 bg-gray-800 text-white px-2 py-1 text-sm rounded absolute top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 pointer-events-none`}>
            Delete
          </div>
        </div>
      </>
    );
}