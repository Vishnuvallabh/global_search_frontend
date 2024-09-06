import React, { useState, useEffect, useCallback } from 'react';

function SearchBar({ setSearchTime, setSearchResults, setTotalResults, setPage }) {
  const [columns, setColumns] = useState([]);
  const [conditions, setConditions] = useState([{ column: '', query: '', operator: '' }]);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState(() => {
    const storedQueries = localStorage.getItem('queryHistory');
    return storedQueries ? JSON.parse(storedQueries) : [];
  });
  const [savedQueries, setSavedQueries] = useState(() => {
    const storedSavedQueries = localStorage.getItem('savedQueries');
    return storedSavedQueries ? JSON.parse(storedSavedQueries) : [];
  });
  const [selectedQuery, setSelectedQuery] = useState('');
  const [selectedSavedQuery, setSelectedSavedQuery] = useState(''); // Separate state for Saved Queries dropdown
  const [noResults, setNoResults] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [queryName, setQueryName] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/columns')
      .then(response => response.json())
      .then(data => setColumns(data.GlobalSearchData || []))
      .catch(error => console.error('Error fetching columns:', error));
  }, []);

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);

    if (field === 'operator' && value) {
      setConditions([...newConditions, { column: '', query: '', operator: '' }]);
    }
  };

  const fetchResults = useCallback(async (page = 1) => {
    setPage(page);
    const currentTime = new Date().toLocaleString();
  
    const readableQueryString = conditions
      .filter(condition => condition.query)
      .map(condition => {
        if (condition.column) {
          return `${condition.column}:${condition.query}`;
        } else {
          return condition.query;
        }
      })
      .join(` ${conditions[0]?.operator || 'AND'} `);
  
    const apiQueryString = conditions
      .filter(condition => condition.query)
      .map(condition => {
        if (condition.column) {
          return `${condition.column}%3A${encodeURIComponent(condition.query)}`;
        } else {
          return `${encodeURIComponent(condition.query)}`;
        }
      })
      .join(`%20${conditions[0]?.operator || 'AND'}%20`);
  
    setLoading(true);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/search?query=${apiQueryString}&page=${page}&per_page=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
  
      setTotalResults(data.total_results);
      setSearchResults(data.results);
      setSearchTime(currentTime);
  
      if (data.total_results === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
  
      if (!queryHistory.includes(readableQueryString)) {
        let updatedQueryHistory = [...queryHistory, readableQueryString];
        if (updatedQueryHistory.length > 25) {
          updatedQueryHistory = updatedQueryHistory.slice(-25);
        }
        setQueryHistory(updatedQueryHistory);
        localStorage.setItem('queryHistory', JSON.stringify(updatedQueryHistory));
      }
  
      // Reset Saved Queries dropdown to default
      setSelectedSavedQuery('');
      setQueryHistory([...queryHistory]);
  
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [conditions, queryHistory, setPage, setSearchResults, setSearchTime, setTotalResults]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const handleDropdownChange = (e) => {
    const selectedQuery = e.target.value;
    setSelectedQuery(selectedQuery);
    const conditionQuery = queryHistory.find(query => query === selectedQuery) || '';
    setConditions([{ column: '', query: conditionQuery }]);
    setSelectedQuery('');
  };

  const handleSaveQuery = () => {
    setIsPopupVisible(true);
  };

  const handleSaveQueryConfirm = () => {
    if (queryName.trim() === '') return;

    const readableQueryString = conditions
      .filter(condition => condition.query)
      .map(condition => {
        if (condition.column) {
          return `${condition.column}:${condition.query}`;
        } else {
          return condition.query;
        }
      })
      .join(` ${conditions[0]?.operator || 'AND'} `);

    const newSavedQuery = { name: queryName, query: readableQueryString };
    const updatedSavedQueries = [...savedQueries, newSavedQuery];

    if (updatedSavedQueries.length > 25) {
      updatedSavedQueries.splice(0, updatedSavedQueries.length - 25);
    }

    setSavedQueries(updatedSavedQueries);
    localStorage.setItem('savedQueries', JSON.stringify(updatedSavedQueries));

    setIsPopupVisible(false);
    setQueryName('');
  };

  const handleSaveQueryCancel = () => {
    setIsPopupVisible(false);
    setQueryName('');
  };

  const handleSavedQueryChange = (e) => {
    const selectedName = e.target.value;
    const selectedQuery = savedQueries.find(query => query.name === selectedName)?.query || '';
    setSelectedSavedQuery(selectedName);
    setConditions([{ column: '', query: selectedQuery }]);
    setSelectedSavedQuery('');
  };

  const handleReset = () => {
    // Reset conditions to default (clear all fields)
    setConditions([{ column: '', query: '', operator: '' }]);

    // Reset "Most Recent Queries" and "Saved Queries" dropdowns to default values
    setSelectedQuery('');  // Reset the Recent Queries dropdown
    setSelectedSavedQuery('');  // Reset the Saved Queries dropdown
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={selectedQuery}
          onChange={handleDropdownChange}
          style={{ width: '100%' }}
        >
          <option value="">Most Recent Queries</option>
          {[...queryHistory].reverse().map((query, index) => (
            <option key={index} value={query}>
              {query}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <select
          value={selectedSavedQuery}
          onChange={handleSavedQueryChange}
          style={{ width: '100%' }}
        >
          <option value="">Saved Queries</option>
          {[...savedQueries].reverse().map((query, index) => (
            <option key={index} value={query.name}>
              {query.name}
            </option>
          ))}
        </select>
      </div>

      {conditions.map((condition, index) => (
        <div key={index}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <select
              value={condition.column}
              onChange={(e) => handleConditionChange(index, 'column', e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">All Columns</option>
              {columns.map((column, idx) => (
                <option key={idx} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={condition.query}
              placeholder="Enter search query..."
              onChange={(e) => handleConditionChange(index, 'query', e.target.value)}
              style={{ flex: 2 }}
            />
          </div>

          {index < conditions.length - 1 && (
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <strong>{condition.operator}</strong>
            </div>
          )}

          {index === conditions.length - 1 && (
            <div style={{ marginBottom: '10px' }}>
              <select
                value={condition.operator}
                onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              >
                <option value="">Select Operator</option>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
                <option value="NOT">NOT</option>
              </select>
            </div>
          )}
        </div>
      ))}
      <button type="submit" disabled={loading}>Search</button>
      <button type="button" onClick={handleSaveQuery} disabled={loading} style={{ marginLeft: "10px" }}>Save Query</button>
      <button type="button" onClick={handleReset} style={{ marginLeft: "10px" }}>Reset</button>
      {loading && <p>Loading...</p>}
      {!loading && noResults && <p>No Results Found</p>}

      {isPopupVisible && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          zIndex: 1000,
        }}>
          <h4>Save Query</h4>
          <input
            type="text"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            placeholder="Enter name for saved query..."
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleSaveQueryConfirm}>Save</button>
          <button onClick={handleSaveQueryCancel} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      )}
    </form>
  );
}

export default SearchBar;
