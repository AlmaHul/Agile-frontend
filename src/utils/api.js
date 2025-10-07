// src/utils/api.js

// Lokal backend (när du kör npm run dev)
const LOCAL_URL = "http://127.0.0.1:5000/api/";

// Render backend (när appen körs i production)
const PROD_URL = "https://agile-project-4.onrender.com/api/";

// Välj rätt URL beroende på om appen körs i development eller production
export const API_URL = import.meta.env.PROD ? PROD_URL : LOCAL_URL;

/**
 * Gemensam funktion för API-anrop.
 * Lägger till headers, skickar cookies (JWT) och hanterar fel automatiskt.
 */
async function request(path, options = {}) {
  const fullUrl = API_URL + path.replace(/^\//, "");

  const res = await fetch(fullUrl, {
    credentials: "include", // skickar med JWT-cookie (för autentisering)
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}), // behåll eventuella extra headers
    },
    ...options, // t.ex. method, body
  });

  // Om servern svarar med ett fel (t.ex. 400 eller 500)
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }

  // Försök tolka svaret som JSON (returnera null om inget JSON finns)
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Skapar en ny challenge i databasen.
 * payload innehåller t.ex. { title, todo, start_date, duration, invites }
 */
export function createChallenge(payload) {
  return request("challenges", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
