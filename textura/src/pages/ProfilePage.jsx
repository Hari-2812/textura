import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProfilePage.css";

export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",

  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli & Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const DISTRICTS = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Tirupati",
  ],
  "Arunachal Pradesh": ["Itanagar"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
  Goa: ["Panaji", "Margao"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Manali"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangalore", "Hubli"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima", "Dimapur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": [
    "Tiruppur",
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Erode",
    "Dindigul",
  ],
  Telangana: ["Hyderabad", "Warangal", "Karimnagar"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Noida",
    "Varanasi",
    "Agra",
    "Ghaziabad",
  ],
  Uttarakhand: ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri"],

  // Union Territories
  "Andaman and Nicobar Islands": ["Port Blair"],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli & Daman and Diu": ["Daman", "Silvassa"],
  Delhi: ["New Delhi", "South Delhi", "North Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Ladakh: ["Leh", "Kargil"],
  Lakshadweep: ["Kavaratti"],
  Puducherry: ["Puducherry", "Karaikal"],
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
    landmark: "",
  });

  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("userToken");

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);

      setForm({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        phone: res.data.user.phone || "",
        address: res.data.user.address || "",
        state: res.data.user.state || "",
        district: res.data.user.district || "",
        pincode: res.data.user.pincode || "",
        landmark: res.data.user.landmark || "",
      });
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "state") {
      setStateSuggestions(
        STATES.filter((st) => st.toLowerCase().startsWith(value.toLowerCase()))
      );
    }

    if (name === "district") {
      const districts = DISTRICTS[form.state] || [];
      setDistrictSuggestions(
        districts.filter((dt) =>
          dt.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    }
  };

  const selectState = (st) => {
    setForm({ ...form, state: st, district: "" });
    setStateSuggestions([]);
  };

  const selectDistrict = (dt) => {
    setForm({ ...form, district: dt });
    setDistrictSuggestions([]);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.put("http://localhost:5000/api/users/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="profile-avatar-small"
          />
          <div className="profile-info">
            <h2>{form.name}</h2>
            <p>{form.email}</p>
          </div>
        </div>

        {/* DETAILS SECTION */}
        {!isEditing ? (
          <div className="profile-details">
            <p>
              <b>Phone:</b> {form.phone || "Not added"}
            </p>
            <p>
              <b>Address:</b> {form.address || "Not added"}
            </p>
            <p>
              <b>State:</b> {form.state || "Not added"}
            </p>
            <p>
              <b>District:</b> {form.district || "Not added"}
            </p>
            <p>
              <b>Pincode:</b> {form.pincode || "Not added"}
            </p>
            <p>
              <b>Landmark:</b> {form.landmark || "Not added"}
            </p>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-section">
            <input name="name" value={form.name} onChange={handleChange} />
            <input name="email" value={form.email} disabled />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />

            {/* STATE DROPDOWN */}
            <div className="dropdown-container">
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />
              {stateSuggestions.length > 0 && (
                <ul className="dropdown-list">
                  {stateSuggestions.map((st, i) => (
                    <li key={i} onClick={() => selectState(st)}>
                      {st}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* DISTRICT DROPDOWN */}
            <div className="dropdown-container">
              <input
                name="district"
                placeholder="District"
                value={form.district}
                onChange={handleChange}
              />
              {districtSuggestions.length > 0 && (
                <ul className="dropdown-list">
                  {districtSuggestions.map((dt, i) => (
                    <li key={i} onClick={() => selectDistrict(dt)}>
                      {dt}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
            />

            <input
              name="landmark"
              placeholder="Landmark (Optional)"
              value={form.landmark}
              onChange={handleChange}
            />

            <button className="save-btn" onClick={saveChanges}>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
