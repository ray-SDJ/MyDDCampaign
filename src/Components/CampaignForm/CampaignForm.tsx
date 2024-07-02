"use client";
import axios from "axios";
import { useState } from "react";

interface Monster {
    name: string;
    index: string;
    url: string;
  }
  


export default function CampaignForm() {
    const [monsterName, setMonsterName] = useState("");
    const [monsterData, setMonsterData] = useState<Monster | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [ errorMessage, setErrorMessage] = useState("");
    const setMonsterButton = document.getElementById("setMonsterButton"); 
    const monsterInput = document.getElementById("monsterInput") as HTMLInputElement;

    const handleSearch = async () => {
        setIsLoading(true);
        setError(false);
       try {
        const response = await axios.get(`https://www.dnd5eapi.co/api/monsters`);
        const monsters: Monster[] = response.data.results;
        const matchedMonster = monsters.find(
            (monster) => monster.name.toLowerCase() === monsterName.toLowerCase()
          );
          if (matchedMonster) {
            const monsterDetailsResponse = await axios.get(matchedMonster.url);
            setMonsterData(monsterDetailsResponse.data);
          } else {
            setErrorMessage('Monster not found.');
          }
        } catch (error) {
          setErrorMessage('Error fetching monster data.');
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
                    <button id="searchButton" onClick={handleSearch} disabled={isLoading}>{isLoading ? 'Searching...' : 'Search'}</button>
                    <div id="monsterResult">{monsterData && <div>{monsterData.name}</div>}</div>
                    <button id="setMonsterButton"></button>
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