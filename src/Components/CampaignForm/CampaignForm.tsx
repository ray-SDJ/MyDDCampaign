"use client";
import axios from "axios";
import { useState } from "react";

interface Monster {
  name: string;
  index: string;
  url: string;
  // ... other properties
}

export default function CampaignForm() {
  const [monsterName, setMonsterName] = useState("");
  const [monsterData, setMonsterData] = useState<Monster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setErrorMessage("");  // Clear previous errors

    try {
      const encodedMonsterName = encodeURIComponent(monsterName.toLowerCase());
      const response = await axios.get(
        `https://www.dnd5eapi.co/api/monsters/${encodedMonsterName}`
      );
      setMonsterData(response.data); // Directly set the monster data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setErrorMessage("Monster not found.");
        } else {
          setErrorMessage("Error fetching monster data.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
    
    return (
        <div className="w-96 mx-auto bg-white rounded shadow-md p-6">
            <div>
                    <h1>Create Campaign</h1>
                </div>
            <form className="">
                <div className="form-group">
                    <label htmlFor="campaignName">Choose Location</label>
                    <input type="text" className="form-control" id="campaignName" />
                </div>
                <div className="form-group">
                    <label htmlFor="monsterInput">Search Monster</label>
                    <input type="text" id="monsterInput" placeholder="Enter a monster name" value={monsterName} onChange={(e) => setMonsterName(e.target.value)} />
                    <button id="searchButton" onClick={handleSearch} disabled={isLoading || !monsterName}>{isLoading ? 'Searching...' : 'Search'}</button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <div id="monsterResult">{monsterData && <div>{monsterData.name}</div>}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="campaignName">Campaign Name</label>
                    <input type="text" className="form-control" id="campaignName" />
                </div>
                <div className="form-group">
                    <label htmlFor="campaignName">Campaign Name</label>
                    <input type="text" className="form-control" id="campaignName" />
                </div>
                <div className="form-group">
                    <label htmlFor="campaignName">Campaign Name</label>
                    <input type="text" className="form-control" id="campaignName" />
                </div>
                <div className="form-group">
                    <label htmlFor="campaignName">Campaign Name</label>
                    <input type="text" className="form-control" id="campaignName" />
                </div>
            </form>
        </div>
    )
}