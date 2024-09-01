// import React, { useState } from 'react';

// function SearchAndResults() {
//   const [conditions, setConditions] = useState([
//     { column: '', query: '', operator: '' },
//   ]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchTime, setSearchTime] = useState('');

//   const handleConditionChange = (index, field, value) => {
//     const newConditions = [...conditions];
//     newConditions[index][field] = value;
//     setConditions(newConditions);

//     if (field === 'operator' && value) {
//       setConditions([...newConditions, { column: '', query: '', operator: '' }]);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const currentTime = new Date().toLocaleString();
//     setSearchTime(currentTime);

//     const query = conditions.map(cond => `${cond.column}:${cond.query}`).join(` ${conditions[0].operator} `);

//     fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}&page=1&per_page=10`)
//       .then(response => response.json())
//       .then(data => {
//         setSearchResults(data.results);
//       })
//       .catch(error => console.error('Error fetching search results:', error));
//   };

//   const downloadCSV = () => {
//     if (searchResults.length === 0) return;

//     const headers = Object.keys(searchResults[0] || {});
//     const rows = searchResults.map(row => headers.map(header => row[header]));

//     let csvContent = 'data:text/csv;charset=utf-8,' 
//       + headers.join(',') + '\n' 
//       + rows.map(row => row.join(',')).join('\n');

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'search_results.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {conditions.map((condition, index) => (
//           <div key={index}>
//             <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//               <input
//                 type="text"
//                 value={condition.query}
//                 placeholder="Enter search query"
//                 onChange={(e) => handleConditionChange(index, 'query', e.target.value)}
//                 style={{ flex: 2 }}
//               />
//             </div>

//             {condition.operator && index < conditions.length - 1 && (
//               <div style={{ textAlign: 'center', marginBottom: '10px' }}>
//                 <strong>{condition.operator}</strong>
//               </div>
//             )}

//             {index === conditions.length - 1 && (
//               <div style={{ marginBottom: '10px' }}>
//                 <select
//                   value={condition.operator}
//                   onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
//                 >
//                   <option value="">Select Operator</option>
//                   <option value="AND">AND</option>
//                   <option value="OR">OR</option>
//                   <option value="NOT">NOT</option>
//                 </select>
//               </div>
//             )}
//           </div>
//         ))}
//         <button type="submit">Search</button>
//       </form>

//       <h5>Found {searchResults.length} interactions | Search Time: {searchTime}</h5>

//       {searchResults.length > 0 && (
//         <>
//           <button onClick={downloadCSV} style={{  
//             fontSize: 'small', 
//             padding: '5px 10px' 
//           }}>Download CSV</button>

//           <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
//             <thead>
//               <tr>
//                 {Object.keys(searchResults[0] || {}).map((header, idx) => (
//                   <th key={idx}>{header}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {searchResults.map((row, idx) => (
//                 <tr key={idx}>
//                   {Object.values(row).map((value, idx) => (
//                     <td key={idx} dangerouslySetInnerHTML={{ __html: value }} />
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// }

// export default SearchAndResults;
