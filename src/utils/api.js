const LOCAL_URL = "http://127.0.0.1:5000/api/";
const PROD_URL = "https://agile-project-4.onrender.com/api/";

  // Välj automatiskt beroende på miljö (process.env.NODE_ENV)
export const API_URL =
  process.env.NODE_ENV === "production" ? PROD_URL : LOCAL_URL;


  //https://jora-backend.onrender.com/api/