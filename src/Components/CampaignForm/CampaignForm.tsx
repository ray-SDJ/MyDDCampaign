"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { locationData } from "@/resources/Locations/locations";
import geminiRun from "../../utils/google";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string | null>(
    null
  );
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const rewardRef = useRef<HTMLInputElement>(null);

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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };
  const handleWeatherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWeather(event.target.value);
  };
  const handleTimeOfDayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedTimeOfDay(event.target.value);
  };

  const formData = {
    nation: selectedNation,
    city: selectedCity,
    monster: monsterData?.name || "",
    category: selectedCategory,
    reward: rewardRef.current?.value || "",
    weather: selectedWeather,
    timeOfDay: selectedTimeOfDay,
  };
  const handleSearch = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const encodedMonsterName = encodeURIComponent(monsterName.toLowerCase());
      const response = await axios.get(`https://www.dnd5eapi.co/api/monsters/`);
      const resultMonsterList = response.data.results;
      const matchedMonster = resultMonsterList.find(
        (monster: any) => monster.name.toLowerCase() === encodedMonsterName
      );

      if (matchedMonster) {
        setMonsterData(matchedMonster);
      } else {
        setErrorMessage("Monster not found.");
      }
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const prompt = await geminiRun(formData);
    setGeneratedPrompt(prompt);
  };

  return (
    <div className="rounded-lg shadow-md mx-auto bg-gray-50 p-6">
      <div className="flex justify-center font-MedievalSharp-Regular font-extrabold text-2xl">
        <h1>Create Campaign</h1>
      </div>
      <form className="flex flex-col my-2">
        <div className="my-2">
          <label htmlFor="nationSelect" className="mr-2 font-bold text-lg">
            Choose Nation:
          </label>
          <select
            id="nationSelect"
            value={selectedNation}
            onChange={handleNationChange}
            className="border-4 rounded-lg border-red-600 "
          >
            {Object.keys(locationData).map((nation) => (
              <option key={nation} value={nation}>
                {nation}
              </option>
            ))}
          </select>
        </div>
        <div className="my-2">
          <label htmlFor="citySelect" className="font-bold text-lg">
            Choose City:{" "}
          </label>
          <select
            id="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border-4 rounded-lg border-red-600 "
          >
            {selectedNation &&
              Object.keys(locationData[selectedNation]).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
        <div className="my-2">
          <label htmlFor="monsterInput" className="font-bold text-lg">
            Choose Main Boss
          </label>
          <br />
          <input
            className="border-4 rounded-lg border-red-600 "
            type="text"
            id="monsterInput"
            placeholder="Enter a monster name"
            value={monsterName}
            onChange={(e) => setMonsterName(e.target.value)}
          />
          <br />
          <div className="flex justify-center mt-3 shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            <button
              id="searchButton"
              onClick={handleSearch}
              disabled={isLoading || !monsterName}
            >
              {isLoading ? "Searching..." : "Search"}ing for Monster
            </button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div id="monsterResult">
            {monsterData && <div> Chosen Monster:{monsterData.name}</div>}
          </div>
        </div>
        <div className="my-2">
          <h1 className="font-bold text-lg">Choose Category</h1>
          <input
            type="radio"
            className="form-control my-2"
            id="campaignCategoryHeist"
            value="Heist"
            checked={selectedCategory === "Heist"}
            onChange={handleCategoryChange}
          />
          <label htmlFor="campaignCategoryHeist">Heist</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="campaignCategoryExploration"
            value="Exploration"
            checked={selectedCategory === "Exploration"}
            onChange={handleCategoryChange}
          />
          <label htmlFor="campaignCategoryExploration">Exploration</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="campaignCategoryJob"
            value="Hired Job"
            checked={selectedCategory === "Hired Job"}
            onChange={handleCategoryChange}
          />
          <label htmlFor="campaignCategoryJob">Hired Job</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="campaignCategoryBounty"
            value="Bounty"
            checked={selectedCategory === "Bounty"}
            onChange={handleCategoryChange}
          />
          <label htmlFor="campaignCategoryBounty">Bounty</label>
        </div>
        <div className="my-2">
          <h1 className="font-bold text-lg">Choose Reward</h1>
          <input
            type="text"
            id="reward"
            ref={rewardRef}
            placeholder="Rewards can be gold, revenge,spells, treasure and relic"
            className="rounded-lg border-red-600 w-4/5"
          />
        </div>
        <div className="my-2">
          <h1 className="font-bold text-lg">Choose Weather</h1>
          <input
            type="radio"
            className="form-control "
            id="clear-skies"
            value="Clear Skies"
            checked={selectedWeather === "Clear Skies"}
            onChange={handleWeatherChange}
          />
          <label htmlFor="clear-skies">Clear Skies</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="cloudy-skies"
            value="Cloudy"
            checked={selectedWeather === "Cloudy"}
            onChange={handleWeatherChange}
          />
          <label htmlFor="cloudy-skies">Cloudy</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="heavy-snowfall"
            value="Heavy Snowfall"
            checked={selectedWeather === "Heavy Snowfall"}
            onChange={handleWeatherChange}
          />
          <label htmlFor="heavy-snowfall">Heavy Snowfall</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="heavy-rain"
            value="Heavy Rainfall"
            checked={selectedWeather === "Heavy Rainfall"}
            onChange={handleWeatherChange}
          />
          <label htmlFor="heavy-rain">Heavy Rainfall</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="light-fog"
            value="Light Fog"
            checked={selectedWeather === "Light Fog"}
            onChange={handleWeatherChange}
          />
          <label htmlFor="light-fog">Light Fog</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="heavy-fog"
            value="Heavy Fog"
            checked={selectedWeather === "Heavy Fog"}
            onChange={handleWeatherChange}
          />
          <label htmlFor="heavy-fog">Heavy Fog</label>
          <br />
        </div>
        <div className="my-2">
          <h1 className="font-bold text-lg">Choose Time of Day</h1>
          <input
            type="radio"
            className="form-control"
            id="day"
            value="Day"
            checked={selectedTimeOfDay === "Day"}
            onChange={handleTimeOfDayChange}
          />
          <label htmlFor="day">Day</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="afternoon"
            value="Afternoon"
            checked={selectedTimeOfDay === "Afternoon"}
            onChange={handleTimeOfDayChange}
          />
          <label htmlFor="afternoon">Afternoon</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="night"
            value="Afternoon"
            checked={selectedTimeOfDay === "Afternoon"}
            onChange={handleTimeOfDayChange}
          />
          <label htmlFor="night">Night</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="solar-eclipse"
            value="Solar Eclipse"
            checked={selectedTimeOfDay === "Solar Eclipse"}
            onChange={handleTimeOfDayChange}
          />
          <label htmlFor="solar-eclipse">Solar Eclipse</label>
          <br />
          <input
            type="radio"
            className="form-control"
            id="lunar-eclipse"
            value="Lunar Eclipse"
            checked={selectedTimeOfDay === "Lunar Eclipse"}
            onChange={handleTimeOfDayChange}
          />
          <label htmlFor="lunar-eclipse">Lunar Eclipse</label>
          <br />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            type="submit"
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Submit
            </span>
          </button>
        </div>
      </form>
      {generatedPrompt && (
        <div className="rounded-lg shadow-md mx-auto bg-gray-50 p-6 my-2  ">
          <div>
            <h2 className="font-bold text-lg ">Generated Prompt:</h2>
            <pre>{generatedPrompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
