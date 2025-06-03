import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import '../styles/FileUploader.css';
import { simulationStore } from '../storage/SimulationStore';

/*
 * FileUploader allows users to upload simulation JSON files via drag-and-drop or file picker.
 * Hydrates the simulationStore with the uploaded file's data.
 *
 * @returns {JSX.Element} The rendered file uploader component.
 */
const FileUploader: React.FC = () => {
  /*
   * Reads and processes the uploaded file, hydrating the simulationStore.
   * @param {File} file - The uploaded file object.
   * @return {void}
   */
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string); // Parse file data
        if (!jsonData.nodes) throw new Error("Invalid file structure");
        // Hydrate the SimulationStore
        simulationStore.loadSimulation(JSON.stringify(jsonData), file.name);
      } catch (err) {
        alert("Invalid JSON file: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  /*
   * Handles file drop event for drag-and-drop upload.
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event.
   * @return {void}
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = Array.from(e.dataTransfer.files).find((f) => f.name.endsWith(".json"));
    if (file) handleFile(file);
    else alert("Please upload a .json file");
  };

  /*
   * Handles file input change event for manual file selection.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @return {void}
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files || []).find((f) => f.name.endsWith(".json"));
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
