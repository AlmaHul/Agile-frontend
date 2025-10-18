import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getAuthHeaders } from "../auth/authService";
import "../css/CreateAvatar.css";
import { API_URL } from "../utils/api";
import {
  hairOptions,
  accessoriesOptions,
  hairColorOptions,
  clotheOptions,
  clotheColorOptions,
  eyeOptions,
  eyebrowOptions,
  facialHairOptions,
  mouthOptions,
  skinOptions
} from "../constants/avatarOptions";

const CreateAvatarPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); // user = { id: '5' }

  const [avatar, setAvatar] = useState({
    top_type: "ShortHairShortFlat",
    accessories_type: "Blank",
    hair_color: "BrownDark",
    facial_hair_type: "Blank",
    clothe_type: "Hoodie",
    clothe_color: "Gray02",
    eye_type: "Default",
    eyebrow_type: "Default",
    mouth_type: "Smile",
    skin_color: "Light",
  });

  const handleChange = (field, value) => {
    setAvatar((prev) => ({ ...prev, [field]: value }));
  };

  const getAvatarUrl = () => {
    const params = new URLSearchParams({
      topType: avatar.top_type,
      accessoriesType: avatar.accessories_type,
      hairColor: avatar.hair_color,
      facialHairType: avatar.facial_hair_type,
      clotheType: avatar.clothe_type,
      clotheColor: avatar.clothe_color,
      eyeType: avatar.eye_type,
      eyebrowType: avatar.eyebrow_type,
      mouthType: avatar.mouth_type,
      skinColor: avatar.skin_color,
    });
    return `https://avataaars.io/?${params.toString()}`;
  };

  const handleSave = async () => {
    try {
      console.log("Skickar till backend:", { user_id: user.id, ...avatar });
      const res = await fetch(`${API_URL}avatar/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id: user.id, ...avatar }),
      });

      if (res.ok) {
        alert("Avatar sparad!");
        navigate("/profile");
      } else {
        const data = await res.json();
        console.error("Backend fel:", data);
        alert("Fel vid sparande av avatar");
      }
    } catch (err) {
      console.error("Fel vid fetch:", err);
      alert("Fel vid sparande av avatar");
    }
  };

  return (
    <div className="create-avatar-page">
      <h1>Skapa din avatar 🎨</h1>

      <div className="avatar-preview">
        <img src={getAvatarUrl()} alt="Avatar Preview" style={{ width: "200px" }} />
      </div>

      <div className="avatar-options">
        <label>
          Hårtyp:
          <select value={avatar.top_type} onChange={(e) => handleChange("top_type", e.target.value)}>
            {hairOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Accessoarer:
          <select value={avatar.accessories_type} onChange={(e) => handleChange("accessories_type", e.target.value)}>
            {accessoriesOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Hårfärg:
          <select value={avatar.hair_color} onChange={(e) => handleChange("hair_color", e.target.value)}>
            {hairColorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Kläder:
          <select value={avatar.clothe_type} onChange={(e) => handleChange("clothe_type", e.target.value)}>
            {clotheOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Färg på kläder:
          <select value={avatar.clothe_color} onChange={(e) => handleChange("clothe_color", e.target.value)}>
            {clotheColorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Ögon:
          <select value={avatar.eye_type} onChange={(e) => handleChange("eye_type", e.target.value)}>
            {eyeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Skägg/mustasch:
          <select value={avatar.facial_hair_type} onChange={(e) => handleChange("facial_hair_type", e.target.value)}>
            {facialHairOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Ögonbryn:
          <select value={avatar.eyebrow_type} onChange={(e) => handleChange("eyebrow_type", e.target.value)}>
            {eyebrowOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Mun:
          <select value={avatar.mouth_type} onChange={(e) => handleChange("mouth_type", e.target.value)}>
            {mouthOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label>
          Hudfärg:
          <select value={avatar.skin_color} onChange={(e) => handleChange("skin_color", e.target.value)}>
            {skinOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>
      </div>

      <button onClick={handleSave}>Spara avatar</button>
    </div>
  );
};

export default CreateAvatarPage;
