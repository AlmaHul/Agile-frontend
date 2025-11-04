import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";
import { getAuthHeaders } from "../auth/authService";
import { API_URL } from "../utils/api";
import "../css/CreateAvatar.css";
import {
  hairOptions, hairLabels,
  accessoriesOptions,accessoriesLabels,
  hairColorOptions, hairColorLabels,
  clotheOptions, clotheLabels,
  clotheColorOptions, clotheColorLabels,
  eyeOptions, eyeLabels,
  eyebrowOptions, eyebrowLabels,
  facialHairOptions, facialHairLabels,
  mouthOptions, mouthLabels,
  skinOptions, skinLabels
} from "../constants/avatarOptions";

const UpdateAvatarPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); // user = { id: '5' }

  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hämta befintlig avatar
    const fetchAvatar = async () => {
      if (!user?.id) return;
      try {
        const res = await fetchWithAuth(`${API_URL}avatar/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setAvatar(data);
        } else if (res.status === 404) {
          alert("Ingen avatar hittades. Skapa en först!");
          navigate("/create-avatar");
        }
      } catch (err) {
        console.error(err);
        alert("Fel vid hämtning av avatar");
      } finally {
        setLoading(false);
      }
    };
    fetchAvatar();
  }, [user.id, navigate]);

  const handleChange = (field, value) => {
    setAvatar((prev) => ({ ...prev, [field]: value }));
  };

  const getAvatarUrl = () => {
    if (!avatar) return "";
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
      const res = await fetch(`${API_URL}avatar/${user.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(avatar),
      });

      if (res.ok) {
        alert("Avatar uppdaterad!");
        navigate("/profile"); // tillbaka till startsidan
      } else {
        alert("Fel vid uppdatering av avatar");
      }
    } catch (err) {
      console.error(err);
      alert("Fel vid uppdatering av avatar");
    }
  };

  if (loading || !avatar) return <p>Laddar avatar...</p>;

  return (
    <div className="create-avatar-page">
      <h1>Uppdatera din avatar 🎨</h1>

      <div className="avatar-preview">
        <img src={getAvatarUrl()} alt="Avatar Preview" style={{ width: "200px" }} />
      </div>

      <div className="avatar-options">
        <label>
          Hårtyp:
         <select
    value={avatar.top_type}
    onChange={(e) => handleChange("top_type", e.target.value)}
  >
    {hairOptions.map((opt) => (
      <option key={opt} value={opt}>
        {hairLabels[opt]}
      </option>
    ))}
  </select>
        </label>

        <label>
          Accessoarer:
          <select
    value={avatar.accessories_type}
    onChange={(e) => handleChange("accessories_type", e.target.value)}
  >
    {accessoriesOptions.map((opt) => (
      <option key={opt} value={opt}>
        {accessoriesLabels[opt]}
      </option>
    ))}
  </select>
        </label>

        <label>
          Hårfärg:
          <select
    value={avatar.hair_color}
    onChange={(e) => handleChange("hair_color", e.target.value)}
  >
    {hairColorOptions.map((opt) => (
      <option key={opt} value={opt}>
        {hairColorLabels[opt]}
      </option>
    ))}
  </select>
        </label>

        <label>
          Skägg/mustasch:
          <select value={avatar.facial_hair_type}
          onChange={(e) => handleChange("facial_hair_type", e.target.value)}
          >
            {facialHairOptions.map((opt) => (
                <option key={opt} value={opt}>
                    {facialHairLabels[opt]}</option>))}
          </select>
        </label>

        <label>
          Kläder:
          <select value={avatar.clothe_type}
          onChange={(e) => handleChange("clothe_type", e.target.value)}>
            {clotheOptions.map((opt) => (
                <option key={opt} value={opt}>{clotheLabels[opt]}</option>))}
          </select>
        </label>

        <label>
          Färg på kläder:
          <select value={avatar.clothe_color} onChange={(e) => handleChange("clothe_color", e.target.value)}>
            {clotheColorOptions.map((opt) => ( <option key={opt} value={opt}>{clotheColorLabels[opt]}</option>))}
          </select>
        </label>

        <label>
          Ögon:
          <select value={avatar.eye_type} onChange={(e) => handleChange("eye_type", e.target.value)}>
            {eyeOptions.map((opt) => ( <option key={opt} value={opt}>{eyeLabels[opt]}</option>))}
          </select>
        </label>

        <label>
          Ögonbryn:
          <select value={avatar.eyebrow_type} onChange={(e) => handleChange("eyebrow_type", e.target.value)}>
            {eyebrowOptions.map((opt) => ( <option key={opt} value={opt}>{eyebrowLabels[opt]}</option>))}
          </select>
        </label>

        <label>
          Mun:
          <select value={avatar.mouth_type} onChange={(e) => handleChange("mouth_type", e.target.value)}>
            {mouthOptions.map((opt) => ( <option key={opt} value={opt}>{mouthLabels[opt]}</option>))}
          </select>
        </label>

        <label>
          Hudfärg:
          <select value={avatar.skin_color} onChange={(e) => handleChange("skin_color", e.target.value)}>
            {skinOptions.map((opt) => ( <option key={opt} value={opt}>{skinLabels[opt]}</option>))}
          </select>
        </label>
      </div>

      <button onClick={handleSave}>Uppdatera avatar</button>
    </div>
  );
};

export default UpdateAvatarPage;
