import React, { useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { Modal, Button } from "react-bootstrap";

const CustomAvatar = ({ onSaveAvatar, avatarConfig }) => {
  const [showModal, setShowModal] = useState(false);
  const [sex] = useState("man");
  const [hairStyle, setHairStyle] = useState(
    avatarConfig?.hairStyle || "normal"
  );
  const [eyeStyle, setEyeStyle] = useState(avatarConfig?.eyeStyle || "circle");
  const [mouthStyle, setMouthStyle] = useState(
    avatarConfig?.mouthStyle || "smile"
  );
  const [glassesStyle, setGlassesStyle] = useState(
    avatarConfig?.glassesStyle || "none"
  );
  const [bgColor, setBgColor] = useState(avatarConfig?.bgColor || "#272CC4");
  const [faceColor, setFaceColor] = useState(
    avatarConfig?.faceColor || "#F9C9B6"
  );
  const [earSize] = useState(avatarConfig?.earSize || "small");
  const [hairColor, setHairColor] = useState(
    avatarConfig?.hairColor || "#000000"
  );
  const [hairColorRandom] = useState(false);
  const [hatStyle] = useState("none");
  const [noseStyle, setNoseStyle] = useState(
    avatarConfig?.noseStyle || "short"
  );
  const [shirtStyle, setShirtStyle] = useState(
    avatarConfig?.shirtStyle || "hoody"
  );
  const [shirtColor, setShirtColor] = useState(
    avatarConfig?.shirtColor || "#FFFFFF"
  );

  const hairStyles = ["normal", "thick", "mohawk", "womanLong", "womanShort"];
  const eyeStyles = ["circle", "oval", "smile"];
  const noseStyles = ["short", "long", "round"];
  const mouthStyles = ["laugh", "smile", "peace"];
  const glassesStyles = ["none", "round", "square"];
  const shirtStyles = ["hoody", "short", "polo"];

  // Generate avatar config based on selected options
  const config = genConfig({
    sex,
    hairStyle,
    eyeStyle,
    mouthStyle,
    glassesStyle,
    bgColor,
    faceColor,
    earSize,
    hairColor,
    hairColorRandom,
    hatStyle,
    noseStyle,
    shirtStyle,
    shirtColor,
  });

  // Handle modal visibility
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Save avatar and close modal
  const handleSaveAvatar = () => {
    onSaveAvatar(config); // Send config to parent component (e.g., ProfileForm)
    handleCloseModal();
  };

  return (
    <div>
      {/* Avatar Display */}
      <Avatar style={{ width: "6rem", height: "6rem" }} {...config} />

      {/* create avatar button */}
      <Button varient="primary" onClick={handleOpenModal}>
        {avatarConfig && Object.keys(avatarConfig).length > 0
          ? "Update Avatar"
          : "Create Avatar"}
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Custom Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Avatar Display */}
          <Avatar style={{ width: "8rem", height: "8rem" }} {...config} />
          {/* Option Selectors */}
          <div>
            <label>Background Color:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>

          {/* choose face color */}
          <div>
            <label>Face Color:</label>
            <input
              type="color"
              value={faceColor}
              onChange={(e) => setFaceColor(e.target.value)}
            />
          </div>

          {/* choose hair color - mohawk and thick only come in black */}
          <div>
            <label>Hair Color:</label>
            <input
              type="color"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
            />
          </div>

          {/* choose hair style */}
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

          {/* choose eye style */}
          <div>
            <label>Eye Style:</label>
            <select
              value={eyeStyle}
              onChange={(e) => setEyeStyle(e.target.value)}
            >
              {eyeStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* choose nose style */}
          <div>
            <label>Nose Style:</label>
            <select
              value={noseStyle}
              onChange={(e) => setNoseStyle(e.target.value)}
            >
              {noseStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* choose mouth style */}
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

          {/* choose glasses style */}
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

          {/* choose shirt style */}
          <div>
            <label>Shirt Style:</label>
            <select
              value={shirtStyle}
              onChange={(e) => setShirtStyle(e.target.value)}
            >
              {shirtStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* choose shirt color */}
          <div>
            <label>Shirt Color:</label>
            <input
              type="color"
              value={shirtColor}
              onChange={(e) => setShirtColor(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* close button */}
          <Button varient="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* save avatar button */}
          <Button varient="primary" onClick={handleSaveAvatar}>
            Save Avatar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomAvatar;
