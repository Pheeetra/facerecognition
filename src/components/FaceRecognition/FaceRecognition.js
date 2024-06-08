import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" height="auto" />
        {box &&
          Array.isArray(box) &&
          box.map((boundingBox, index) => (
            <div
              key={index}
              className="bounding-box"
              style={{
                top: boundingBox.topRow,
                right: boundingBox.rightCol,
                bottom: boundingBox.bottomRow,
                left: boundingBox.leftCol,
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
