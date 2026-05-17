import { GoogleGenAI } from "@google/genai";

export async function getLoanAdvice(query: string, userProfile: any) {
  try {
    const response = await fetch("/api/loan-advisor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, userProfile }),
    });
    
    if (!response.ok) throw new Error("Failed to fetch advice");
    
    const data = await response.json();
    return data.advice;
  } catch (error) {
    console.error("Error getting advice:", error);
    return "I'm having trouble connecting to my financial brain. Please try again later!";
  }
}
