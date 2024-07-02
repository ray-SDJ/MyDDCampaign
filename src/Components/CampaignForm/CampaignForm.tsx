"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { locationData } from "@/resources/Locations/locations"; 

interface Monster {
  name: string;
  index: string;
  url: string;
}

export default function CampaignForm() {
  const [monsterName, setMonsterName] = useState("");
  const [monsterData, setMonsterData] = useState<Monster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedNation, setSelectedNation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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
  useEffect(() => {
    const firstNation = Object.keys(locationData)[0];
    setSelectedNation(firstNation);
    setSelectedCity(Object.keys(locationData[firstNation])[0]);
  }, []); 

  const handleNationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNation = event.target.value;
    setSelectedNation(selectedNation);

    
    if (locationData[selectedNation]) {
      const firstCityInNation = Object.keys(locationData[selectedNation])[0];
      setSelectedCity(firstCityInNation);
    } else {
      setSelectedCity(""); 
    }
  };
    
    return (
        <div className="rounded shadow-md mx-auto bg-gray-50 p-6">
            <div>
                    <h1>Create Campaign</h1>
                </div>
            <form className="flex flex-col my-4">
                <div className="my-4">
                    <label htmlFor="nationSelect">Choose Nation:</label>
                    <select id="nationSelect" value={selectedNation} onChange={handleNationChange}>
                      {Object.keys(locationData).map((nation) => (
                        <option key={nation} value={nation}>
                          {nation}
                        </option>
                      ))}
                    </select>
                </div>
                <div className="my-4">
                  <label htmlFor="citySelect">Choose City:</label>
                  <select id="citySelect" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    {selectedNation &&
                      Object.keys(locationData[selectedNation]).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="my-4">
                    <label htmlFor="monsterInput">Main Boss</label>
                    <input type="text" id="monsterInput" placeholder="Enter a monster name" value={monsterName} onChange={(e) => setMonsterName(e.target.value)} />
                    <button id="searchButton" onClick={handleSearch} disabled={isLoading || !monsterName}>{isLoading ? 'Searching...' : 'Search'}</button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <div id="monsterResult">{monsterData && <div>{monsterData.name}</div>}</div>
                </div>
                <div className="my-4">
                  <h1>Choose Category</h1>
                    <input type="radio" className="form-control" id="campaignCategoryHeist" />
                    <label htmlFor="campaignCategoryHeist">Heist</label>
                    <input type="radio" className="form-control" id="campaignCategoryExploration" />
                    <label htmlFor="campaignCategoryExploration">Exploration</label>
                    <input type="radio" className="form-control" id="campaignCategoryJob" />
                    <label htmlFor="campaignCategoryJob">Hired Job</label>
                    <input type="radio" className="form-control" id="campaignCategoryBounty" />
                    <label htmlFor="campaignCategoryBounty">Bount</label>
                </div>
                <div className="my-4">
                  <h1>Choose Reward</h1>
                    <label htmlFor="reward">Reward</label>
                    <input type="text" className="form-control" id="reward" placeholder="Rewards can be gold, revenge,spells, treasure and relic"/>
                </div>
                <div className="my-4">
                  <h1>Choose Weather</h1>
                    <input type="radio" className="form-control" id="clear-skies" />
                    <label htmlFor="clear-skies">Clear Skies</label><br/>
                    <input type="radio" className="form-control" id="cloudy-skies" />
                    <label htmlFor="cloudy-skies">Cloudy</label><br/>
                    <input type="radio" className="form-control" id="heavy-snowfall" />
                    <label htmlFor="heavy-snowfall">Heavy Snowfall</label><br/>
                    <input type="radio" className="form-control" id="heavy-rain" />
                    <label htmlFor="heavy-rain">Heavy Rainfall</label><br/>
                    <input type="radio" className="form-control" id="light-fog" />
                    <label htmlFor="light-fog">Light Fog</label><br/>
                    <input type="radio" className="form-control" id="heavy-fog" />
                    <label htmlFor="heavy-fog">Heavy Fog</label><br/>
                </div>
                <div className="my-4">
                  <h1>Choose Time of Day</h1>
                    <input type="radio" className="form-control" id="day" />
                    <label htmlFor="day">Day</label><br/>
                    <input type="radio" className="form-control" id="afternoon" />
                    <label htmlFor="afternoon">Afternoon</label><br/>
                    <input type="radio" className="form-control" id="night" />
                    <label htmlFor="night">Night</label><br/>
                    <input type="radio" className="form-control" id="solar-eclipse" />
                    <label htmlFor="solar-eclipse">Solar Eclipse</label><br/>
                    <input type="radio" className="form-control" id="lunar-eclipse" />
                    <label htmlFor="lunar-eclipse">Lunar Eclipse</label><br/>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}