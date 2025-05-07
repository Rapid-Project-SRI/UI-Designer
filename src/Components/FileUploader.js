import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import './FileUploader.css';

const FileUploader = ({ onFileLoad }) => {
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result); // Original file data
        if (!jsonData.nodes) throw new Error("Invalid file structure");

        // Filter nodes for eventNodes and outputNodes
        const eventNodes = jsonData.nodes.filter((n) => n.type === "eventNode");
        const outputNodes = jsonData.nodes.filter((n) => n.type === "outputNode");

        // Pass both original and filtered data to onFileLoad
        onFileLoad({
          originalFileData: jsonData, // Preserve the original file data
          fileData: {
            fileName: file.name,
            eventNodes,
            outputNodes,
          },
        });
      } catch (err) {
        alert("Invalid JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = Array.from(e.dataTransfer.files).find((f) => f.name.endsWith(".json"));
    if (file) handleFile(file);
    else alert("Please upload a .json file");
  };

  const handleChange = (e) => {
    const file = Array.from(e.target.files).find((f) => f.name.endsWith(".json"));
    if (file) handleFile(file);
    else alert("Please upload a .json file");
  };

  return (
    <div className="file-uploader-container">
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="upload-icon">
          <FontAwesomeIcon icon={faFileUpload} size="2x" />
        </div>
        <p className="upload-text">drag & drop to upload</p>
        <p className="upload-text">or</p>
        <label>
          <span className="choose-files-button">choose files</span>
          <input
            type="file"
            multiple={false}
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
