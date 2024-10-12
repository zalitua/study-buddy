import React, { useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { Modal, Button } from "react-bootstrap";

const CustomAvatar = ({ onSaveAvatar }) => {
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [sex] = useState("man");
  const [hairStyle, setHairStyle] = useState("normal");
  const [eyeStyle, setEyeStyle] = useState("circle");
  const [mouthStyle, setMouthStyle] = useState("smile");
  const [glassesStyle, setGlassesStyle] = useState("none");
  const [bgColor, setBgColor] = useState("#272CC4");
  const [faceColor, setFaceColor] = useState("#F9C9B6");
  const [earSize] = useState("small");
  const [hairColor, setHairColor] = useState("#000000");
  const [hairColorRandom] = useState(false);
  const [hatStyle] = useState("none");
  const [noseStyle, setNoseStyle] = useState("short");
  const [shirtStyle, setShirtStyle] = useState("hoody");
  const [shirtColor, setShirtColor] = useState("#FFFFFF");

  const sexes = ["man", "woman"];
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
      <Avatar style={{ width: "8rem", height: "8rem" }} {...config} />

      {/* create avatar button */}
      <Button varient="primary" onClick={handleOpenModal}>
        Create Avatar
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Custom Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Option Selectors */}
          <div>
            <label>Background Color:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>

          <div>
            <label>Face Color:</label>
            <input
              type="color"
              value={faceColor}
              onChange={(e) => setFaceColor(e.target.value)}
            />
          </div>

          <div>
            <label>Hair Color:</label>
            <input
              type="color"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
            />
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
          <Button varient="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button varient="primary" onClick={handleSaveAvatar}>
            Save Avatar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomAvatar;
