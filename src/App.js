import SearchBar from './Components/SearchBar';
import ResultsTable from './Components/ResultsTable';
import React, { useState } from'react';
import Notebutton from './Components/NoteButton';
import './App.css';

function App() {
   const [searchTime, setSearchTime] = useState('');
   const [searchResults, setSearchResults] = useState([]); 
   const [totalResults, setTotalResults] = useState(0);
   const [page, setPage] = useState(1);


  const fetchResults = (newPage = 1) => {
    setPage(newPage);
    document.dispatchEvent(new CustomEvent('fetchResults', { detail: newPage }));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Global Search - EPMO</h2>
      </header>
      <Notebutton/>
      <SearchBar setSearchTime={setSearchTime}  setSearchResults={setSearchResults} setTotalResults={setTotalResults} setPage={setPage} page={page} />
      <ResultsTable  searchResults={searchResults} searchTime={searchTime} totalResults={totalResults} page={page}  fetchResults={fetchResults}/>
    </div>
  );
}

export default App;
