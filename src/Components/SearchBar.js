
// import React, { useState, useEffect } from 'react';

// function SearchBar({ setSearchTime, setSearchResults ,setTotalResults }) {
//   const [columns, setColumns] = useState([]);
//   const [conditions, setConditions] = useState([{ column: '', query: '', operator: '' }]);
//   const [loading , setLoading] = useState(false);

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/columns')
//       .then(response => response.json())
//       .then(data => {
//         const columnNames = data.GlobalSearchData || [];
//         setColumns(columnNames);
//       })
//       .catch(error => console.error('Error fetching columns:', error));
//   }, []);

//   const handleConditionChange = (index, field, value) => {
//     const newConditions = [...conditions];
//     newConditions[index][field] = value;
//     setConditions(newConditions);

//     if (field === 'operator' && value) {
//       setConditions([...newConditions, { column: '', query: '', operator: '' }]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const currentTime = new Date().toLocaleString();
//     console.log(currentTime);
//     console.log(conditions);
  
//     // Convert conditions to a query string without column details
//     const queryString = conditions
//       .filter(condition => condition.query) // only include conditions with a query
//       .map(condition => condition.query) // just use the query part
//       .join(` ${conditions[0]?.operator || 'AND'} `);
  
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(queryString)}&page=1&per_page=10`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch search results');
//       }
//       const data = await response.json();
//       console.log('Search results:', data);
//       setTotalResults(data.total_results);
//       setSearchResults(data.results);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//       setSearchResults([]); // Reset results if there is an error
//     } finally {
//       setLoading(false);
//     }
  
//     setSearchTime(currentTime);
//   };
  

//   return (
//     <form onSubmit={handleSubmit}>
//       {loading && <p>Loading...</p>}

//       {conditions.map((condition, index) => (
//         <div key={index}>
//           <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//             <select
//               value={condition.column}
//               onChange={(e) => handleConditionChange(index, 'column', e.target.value)}
//               style={{ flex: 1 }}
//             >
//               <option value="">All Columns</option>
//               {columns.map((column, idx) => (
//                 <option key={idx} value={column}>
//                   {column}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="text"
//               value={condition.query}
//               placeholder="Enter search query"
//               onChange={(e) => handleConditionChange(index, 'query', e.target.value)}
//               style={{ flex: 2 }}
//             />
//           </div>

//           {index === conditions.length - 1 && (
//             <div style={{ marginBottom: '10px' }}>
//               <select
//                 value={condition.operator}
//                 onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
//               >
//                 <option value="">Select Operator</option>
//                 <option value="AND">AND</option>
//                 <option value="OR">OR</option>
//                 <option value="NOT">NOT</option>
//               </select>
//             </div>
//           )}
//         </div>
//       ))}
//       <button type="submit" disabled={loading}>Search</button>
//     </form>
//   );
// }

//  export default SearchBar;




//Display dropdown for search history
// import React, { useState, useEffect } from 'react';

// function SearchBar({ setSearchTime, setSearchResults, setTotalResults , setPage}) {
//   const [columns, setColumns] = useState([]);
//   const [conditions, setConditions] = useState([{ column: '', query: '', operator: '' }]);
//   const [loading, setLoading] = useState(false);
//   const [queryHistory, setQueryHistory] = useState(() => {
//     // Retrieve the stored queries from localStorage if they exist
//     const storedQueries = localStorage.getItem('queryHistory');
//     return storedQueries ? JSON.parse(storedQueries) : [];
//   });
//   const [selectedQuery, setSelectedQuery] = useState('');

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/columns')
//       .then(response => response.json())
//       .then(data => {
//         const columnNames = data.GlobalSearchData || [];
//         setColumns(columnNames);
//       })
//       .catch(error => console.error('Error fetching columns:', error));
//   }, []);

//   const handleConditionChange = (index, field, value) => {
//     const newConditions = [...conditions];
//     newConditions[index][field] = value;
//     setConditions(newConditions);

//     if (field === 'operator' && value) {
//       setConditions([...newConditions, { column: '', query: '', operator: '' }]);
//     }
//   };

//   const fetchResults = async (page = 1) => {
//     const currentTime = new Date().toLocaleString();
    
//     const queryString = conditions
//       .filter(condition => condition.query)
//       .map(condition => condition.query)
//       .join(` ${conditions[0]?.operator || 'AND'} `);
    
//     setLoading(true);

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(queryString)}&page=${page}&per_page=10`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch search results');
//       }
//       const data = await response.json();
//       setTotalResults(data.total_results);
//       setSearchResults(data.results);
//       setSearchTime(currentTime);
//       setPage(page);

//       if (!queryHistory.includes(queryString)) {
//         const updatedQueryHistory = [...queryHistory, queryString];
//         setQueryHistory(updatedQueryHistory);
//         localStorage.setItem('queryHistory', JSON.stringify(updatedQueryHistory));
//       }
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchResults();
//   };

//   const handleDropdownChange = (e) => {
//     const selectedQuery = e.target.value;
//     setSelectedQuery(selectedQuery);
//     // Populate the search condition based on the selected query
//     setConditions([{ column: '', query: selectedQuery, operator: 'AND' }]);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Display loading indicator */}

//       <div style={{ marginBottom: '10px' }}>
//         <select
//           value={selectedQuery}
//           onChange={handleDropdownChange}
//           style={{ width: '100%' }}
//         >
//           <option value="">Select Previous Query</option>
//           {queryHistory.map((query, index) => (
//             <option key={index} value={query}>
//               {query}
//             </option>
//           ))}
//         </select>
//       </div>

      

//       {conditions.map((condition, index) => (
//         <div key={index}>
//           <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//             <select
//               value={condition.column}
//               onChange={(e) => handleConditionChange(index, 'column', e.target.value)}
//               style={{ flex: 1 }}
//             >
//               <option value="">All Columns</option>
//               {columns.map((column, idx) => (
//                 <option key={idx} value={column}>
//                   {column}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="text"
//               value={condition.query}
//               placeholder="Enter search query"
//               onChange={(e) => handleConditionChange(index, 'query', e.target.value)}
//               style={{ flex: 2 }}
//             />
//           </div>

//           {index === conditions.length - 1 && (
//             <div style={{ marginBottom: '10px' }}>
//               <select
//                 value={condition.operator}
//                 onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
//               >
//                 <option value="">Select Operator</option>
//                 <option value="AND">AND</option>
//                 <option value="OR">OR</option>
//                 <option value="NOT">NOT</option>
//               </select>
//             </div>
//           )}
//         </div>
//       ))}
//       <button type="submit" disabled={loading}>Search</button> {/* Disable button while loading */}
//       {loading && <p>Loading...</p>} 
//     </form>
//   );
// }

// export default SearchBar;


import React, { useState, useEffect, useCallback } from 'react';

function SearchBar({ setSearchTime, setSearchResults, setTotalResults, setPage , page}) {
  const [columns, setColumns] = useState([]);
  const [conditions, setConditions] = useState([{ column: '', query: '', operator: '' }]);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState(() => {
    const storedQueries = localStorage.getItem('queryHistory');
    return storedQueries ? JSON.parse(storedQueries) : [];
  });
  const [selectedQuery, setSelectedQuery] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/columns')
      .then(response => response.json())
      .then(data => {
        const columnNames = data.GlobalSearchData || [];
        setColumns(columnNames);
      })
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

    const queryString = conditions
      .filter(condition => condition.query)
      .map(condition => condition.query)
      .join(` ${conditions[0]?.operator || 'AND'} `);
    
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(queryString)}&page=${page}&per_page=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();

      console.log('API Response:', data);
      setTotalResults(data.total_results);
      setSearchResults(data.results);
      setSearchTime(currentTime);

      if (!queryHistory.includes(queryString)) {
        const updatedQueryHistory = [...queryHistory, queryString];
        setQueryHistory(updatedQueryHistory);
        localStorage.setItem('queryHistory', JSON.stringify(updatedQueryHistory));
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [conditions, queryHistory, setPage, setSearchResults, setSearchTime, setTotalResults]);

  useEffect(() => {
    const fetchListener = (event) => {
      fetchResults(event.detail); // Pass the new page value from the event
    };

    document.addEventListener('fetchResults', fetchListener);

    return () => {
      document.removeEventListener('fetchResults', fetchListener);
    };
  }, [fetchResults,conditions, queryHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResults(); // Trigger the first search
  };

  const handleDropdownChange = (e) => {
    const selectedQuery = e.target.value;
    setSelectedQuery(selectedQuery);
    setConditions([{ column: '', query: selectedQuery, operator: 'AND' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={selectedQuery}
          onChange={handleDropdownChange}
          style={{ width: '100%' }}
        >
          <option value="">Select Previous Query</option>
          {queryHistory.map((query, index) => (
            <option key={index} value={query}>
              {query}
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
              placeholder="Enter search query"
              onChange={(e) => handleConditionChange(index, 'query', e.target.value)}
              style={{ flex: 2 }}
            />
          </div>

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
      {loading && <p>Loading...</p>}
    </form>
  );
}

export default SearchBar;
