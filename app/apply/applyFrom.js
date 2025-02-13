"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ApplyForm({ user }) {

  const {
    email,
    name,
    lastname,
    phone,
    website
  } = user;

  // Ad

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

  const [ad, setAd] = useState();

  useEffect(() => {
    const lastAdViewId = Number(Cookies.get("LastAdView"));

    getAds().then(data => {
      const matchingAd = data.find(item => item.id === lastAdViewId);

      if (matchingAd) {
        setAd(matchingAd);
        setAdId(matchingAd.id);
        setCompany(matchingAd.company);
      } else {
        setAd(null);
        setAdId(null);
        setCompany('');
      }
    });
    
  }, []);

  ///

    const [emailForm, setEmailForm] = useState(email);
    const [nameForm, setNameForm] = useState(name);
    const [lastnameForm, setLastnameForm] = useState(lastname);
    const [phoneForm, setPhoneForm] = useState(phone);
    const [websiteForm, setWebsiteForm] = useState(website);
    const [motivationsForm, setMotivationsForm] = useState('');

    const [ad_id, setAdId] = useState(null);
    const [company, setCompany] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
  
    const sendMail = async () => {
      try {
        const res = await fetch('http://localhost:3001/send-email', {
          method: 'GET',
        });
    
        if (!res.ok) {
          throw new Error('Failed to send email');
        }
    
        const data = await res.json();
        console.log('Email sent:', data);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };    

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:3000/api/apply`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },

            body: JSON.stringify({
                "ad_id": ad_id,
                "company_name": company,
                "name": nameForm,
                "lastname": lastnameForm,
                "email": emailForm,
                "phone": phoneForm,
                "motivations": motivationsForm,
                "website": websiteForm
              }),
        });

        if (!res.ok) {
            throw new Error("Failed to update user");
        }

        router.refresh();
        router.push("/");
      } catch (error) {
          console.log(error);
      }

    const confirmed = confirm("Are you sure you want to apply for this job? Make sure all the informations are correct");
      if (confirmed) {
          setIsLoading(true);
          alert("You successfully applied for this job!");
          sendMail();
          router.push('/');
      } else {
          setIsLoading(false);
      }
    };
    if (ad) {

      return (
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label>Name: <span className="text-red-600">*</span></label>
                <input
                  onChange={(e) => setNameForm(e.target.value)}
                  value={nameForm}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="text"
                  required
                  placeholder="Doe"
                  disabled={name !== null}
                />
                <label htmlFor="lastname">Lastname: <span className="text-red-600">*</span></label>
                <input
                  onChange={(e) => setLastnameForm(e.target.value)}
                  value={lastnameForm}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="text"
                  required
                  placeholder="John"
                  disabled={lastname !== null}
                />
                <label>Email: <span className="text-red-600">*</span></label>
                <input
                  onChange={(e) => setEmailForm(e.target.value)}
                  value={emailForm}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  disabled={email !== null}
                />
                <label>Phone:</label>
                <input
                  onChange={(e) => setPhoneForm(e.target.value)}
                  value={phoneForm}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="tel"
                  minlength="12"
                  maxlength="12"
                  placeholder="+33612345678"
                  disabled={phone !== null}
                />
                <label>Your Motivations: </label>
                <textarea
                  onChange={(e) => setMotivationsForm(e.target.value)}
                  value={motivationsForm}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="text"
                  minlength="20"
                  maxlength="200"
                  placeholder="I really want to have this job."
                />
                <label>Website:</label>
                <input
                  onChange={(e) => setWebsiteForm(e.target.value)}
                  value={websiteForm}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="url"
                  pattern="http.*"
                  placeholder="https://johndoe.com"
                  disabled={website !== null}
                />
                <label>Upload CV:</label>
                <input
                  onChange={(e) => setCvFile(e.target.files[0])}
                  className="border border-slate-500 px-8 py-2 required-custom-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                />
                <label className="text-sm text-gray-600" >PDF, DOC, DOCX (5 Mo)</label>
                <div className="flex flex-col py-8 items-center justify-center">
                    <div className="w-1/2">
                        <button
                        type="submit"
                        className={`bg-blue-500 rounded-lg font-semibold text-white py-3 px-6 w-full ${
                            isLoading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        disabled={isLoading}
                        >
                        {isLoading ? 'Loading...' : 'ApplyJob'}
                        </button>
                    </div>
                </div>
            </form>
          </div>
      );
    } else {
      return <p className="text-2xl font-light">Loading your Profile...</p>;
    }
};