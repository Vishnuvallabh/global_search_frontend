// File: src/Components/NoteButton.js
import React from 'react';

function NoteButton() {
  return (
    <div className="note-container">
      <button className="info-button">i</button>
      <div className="note-content">
        <p>Note:This is phase 2 of our model. Currently, searching with operators, full names, COlumn wise search and terms is fully functional.
           Incorporating Pagination and other features.
        </p>
      </div>
    </div>
  );
}

export default NoteButton;
