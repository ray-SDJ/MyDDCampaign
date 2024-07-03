const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function geminiRun(formData: { nation: any; city: any; monster: any; category: any; reward: any; weather: any; timeOfDay: any; }) {

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = `Create a Dungeons and Dragons Campaign taking place in the city of ${formData.city} in ${formData.nation}. Make this campaign a ${formData.category} mission, and toward the end of the mission the players will fight ${formData.monster}. The reward will be ${formData.reward}. The weather will be ${formData.weather}. The time of day will be ${formData.timeOfDay}. Make sure to add puzzles and traps throughout the campaign`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

