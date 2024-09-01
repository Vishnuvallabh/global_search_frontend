import React, { useState } from 'react';

function ResultsTable({ searchResults, searchTime, totalResults }) {
  const [expandedRows, setExpandedRows] = useState({});

  // Function to download search results as CSV
  const downloadCSV = () => {
    if (searchResults.length === 0) return;

    const headers = ['RecordID', 'Name', 'Gender', 'DateOfBirth', 'Email', 'Phone'];
    const rows = searchResults.map(row => headers.map(header => row[header]));

    let csvContent = 'data:text/csv;charset=utf-8,'
      + headers.join(',') + '\n'
      + rows.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'search_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle dropdown visibility for a row
  const toggleRow = (idx) => {
    setExpandedRows(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div>
      <h5>Found {totalResults} interactions | Search Time: {searchTime} </h5>

      <button onClick={downloadCSV} style={{  
        fontSize: 'small', 
        padding: '5px 10px' 
      }}>Download CSV</button>

      <button style={{  
        fontSize: 'small', 
        padding: '5px 10px',
        marginLeft: '10px' 
      }}>Download Excel</button>

<button style={{  
        fontSize: 'small', 
        padding: '5px 10px',
        marginLeft: '10px' 
      }}>Download PDF</button>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>RecordID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>DateOfBirth</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Details</th> {/* Dropdown column for extra data */}
          </tr>
        </thead>
        <tbody>
          {searchResults.map((row, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td>{row.RecordID}</td>
                <td>{row.Name}</td>
                <td>{row.Gender}</td>
                <td>{row.DateOfBirth}</td>
                <td>{row.Email}</td>
                <td>{row.Phone}</td>
                <td>
                  <button onClick={() => toggleRow(idx)}>
                    {expandedRows[idx] ? 'Hide Details' : 'Show Details'}
                  </button>
                </td>
              </tr>
              {expandedRows[idx] && (
                <tr>
                  <td colSpan="7">
                    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
                      {Object.keys(row).map(key => {
                        if (!['RecordID', 'Name', 'Gender', 'DateOfBirth', 'Email', 'Phone'].includes(key)) {
                          return (
                            <div key={key}><strong>{key}</strong>: {row[key]}</div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;


























































