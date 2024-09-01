import SearchBar from './Components/SearchBar';
import ResultsTable from './Components/ResultsTable';
import React, { useState } from'react';
import './App.css';
import Notebutton from './Components/NoteButton';
// import SearchAndResults from './Components/SearchAndResults';

function App() {
   const [searchTime, setSearchTime] = useState('');
   const [searchResults, setSearchResults] = useState([]); 
   const [totalResults, setTotalResults] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Global Search</h2>
      </header>
      <Notebutton/>
      <SearchBar setSearchTime={setSearchTime}  setSearchResults={setSearchResults} setTotalResults={setTotalResults}/>
      <ResultsTable  searchResults={searchResults} searchTime={searchTime} totalResults={totalResults}/>
      {/* <SearchAndResults/> */}

    </div>
  );
}

export default App;
