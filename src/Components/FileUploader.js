import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import "./FileUploader.css";

const FileUploader = () => {
  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  return (
    <div className="file-uploader-container">
      <p className="upload-info">no streams available</p>

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
            multiple
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files">
          <p><strong>Uploaded files:</strong></p>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;