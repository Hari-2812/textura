import React from "react";
import "../styles/SizeGuideModal.css";

const SIZE_CHART = [
  { age: "2–3Y", height: "92–98 cm", chest: "52–54 cm", waist: "50–52 cm" },
  { age: "3–4Y", height: "98–104 cm", chest: "54–56 cm", waist: "52–53 cm" },
  { age: "4–5Y", height: "104–110 cm", chest: "56–58 cm", waist: "53–54 cm" },
  { age: "5–6Y", height: "110–116 cm", chest: "58–60 cm", waist: "54–55 cm" },
  { age: "6–7Y", height: "116–122 cm", chest: "60–62 cm", waist: "55–56 cm" },
  { age: "7–8Y", height: "122–128 cm", chest: "62–64 cm", waist: "56–57 cm" },
  { age: "9–10Y", height: "134–140 cm", chest: "68–72 cm", waist: "58–60 cm" },
  { age: "11–12Y", height: "146–152 cm", chest: "72–76 cm", waist: "60–62 cm" },
  { age: "13–14Y", height: "158–164 cm", chest: "76–82 cm", waist: "62–64 cm" },
  { age: "14–15Y", height: "164–170 cm", chest: "82–86 cm", waist: "64–66 cm" },
];

const SizeGuideModal = ({ onClose }) => {
  return (
    <div className="sg-overlay">
      <div className="sg-modal">
        <div className="sg-header">
          <h3>Size Guide</h3>
          <button className="sg-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sg-table">
          <div className="sg-row sg-head">
            <span>Age</span>
            <span>Height</span>
            <span>Chest</span>
            <span>Waist</span>
          </div>

          {SIZE_CHART.map((row, idx) => (
            <div className="sg-row" key={idx}>
              <span>{row.age}</span>
              <span>{row.height}</span>
              <span>{row.chest}</span>
              <span>{row.waist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
