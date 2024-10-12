import React, { useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";

const CustomAvatar = () => {
  const [sex, setSex] = useState("man");
  const [hairStyle, setHairStyle] = useState("normal");
  const [eyeStyle, setEyeStyle] = useState("circle");
  const [mouthStyle, setMouthStyle] = useState("smile");
  const [glassesStyle, setGlassesStyle] = useState("none");

  const sexes = ["man", "woman"];
  const hairStyles = ["normal", "thick", "mohawk", "womanLong", "womanShort"];
  const eyeStyles = ["circle", "oval", "smile"];
  const mouthStyles = ["laugh", "smile", "peace"];
  const glassesStyles = ["none", "round", "square"];

  // Generate avatar config based on selected options
  const config = genConfig({
    sex,
    hairStyle,
    eyeStyle,
    mouthStyle,
    glassesStyle,
  });

  return (
    <div>
      {/* Avatar Display */}
      <Avatar style={{ width: "8rem", height: "8rem" }} {...config} />

      {/* Option Selectors */}
      <div>
        <label>Gender:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)}>
          {sexes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Hair Style:</label>
        <select
          value={hairStyle}
          onChange={(e) => setHairStyle(e.target.value)}
        >
          {hairStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Eye Style:</label>
        <select value={eyeStyle} onChange={(e) => setEyeStyle(e.target.value)}>
          {eyeStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Mouth Style:</label>
        <select
          value={mouthStyle}
          onChange={(e) => setMouthStyle(e.target.value)}
        >
          {mouthStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Glasses Style:</label>
        <select
          value={glassesStyle}
          onChange={(e) => setGlassesStyle(e.target.value)}
        >
          {glassesStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomAvatar;
