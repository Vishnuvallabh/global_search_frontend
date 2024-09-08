// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// function ResultsTable({ searchResults, searchTime, totalResults, page, fetchResults }) {
//   const [expandedRows, setExpandedRows] = useState({});

//   const totalPages = Math.ceil(totalResults / 10);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     fetchResults(newPage);
//   };

//   const flattenRow = (row) => {
//     const mainFields = ['RecordID', 'Name', 'Gender', 'DateOfBirth', 'Email', 'Phone'];
//     let flatRow = {};

//     mainFields.forEach(field => {
//       flatRow[field] = row[field] || '';
//     });

//     Object.keys(row).forEach(key => {
//       if (!mainFields.includes(key)) {
//         flatRow[key] = row[key];
//       }
//     });

//     return flatRow;
//   };

//   const highlightText = (text) => {
//     if (!text) return text;

//     // Replace <highlight> tags with <span> elements
//     return text.replace(/<highlight>(.*?)<\/highlight>/g, '<span style="background-color: yellow;">$1</span>');
//   };

//   const downloadCSV = () => {
//     if (searchResults.length === 0) return;

//     const flatResults = searchResults.map(flattenRow);
//     const headers = Object.keys(flatResults[0]);
//     const rows = flatResults.map(row => headers.map(header => row[header]));

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

//   const downloadExcel = () => {
//     if (searchResults.length === 0) return;

//     const flatResults = searchResults.map(flattenRow);
//     const headers = Object.keys(flatResults[0]);
//     const data = [
//       headers,
//       ...flatResults.map(row => headers.map(header => row[header]))
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

//     XLSX.writeFile(workbook, 'search_results.xlsx');
//   };

//   const downloadPDF = () => {
//     if (searchResults.length === 0) return;

//     const doc = new jsPDF();
//     const defaultFontSize = 12;
//     const smallerFontSize = 10;
//     const pageHeight = doc.internal.pageSize.height;
//     let yPosition = 20;

//     doc.setFontSize(defaultFontSize);
//     doc.text('Search Results', 14, 10);

//     searchResults.forEach((row, index) => {
//       if (yPosition + 20 > pageHeight) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       doc.setFontSize(defaultFontSize);
//       doc.text(`Record ${index + 1}`, 14, yPosition);
//       yPosition += 10;

//       doc.setFontSize(smallerFontSize);
//       Object.keys(row).forEach((key) => {
//         if (yPosition + 10 > pageHeight) {
//           doc.addPage();
//           yPosition = 20;
//         }
//         doc.text(`${key}: ${row[key]}`, 20, yPosition);
//         yPosition += 8;
//       });

//       yPosition += 10;
//     });

//     doc.save('search_results.pdf');
//   };

//   const toggleRow = (idx) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [idx]: !prev[idx]
//     }));
//   };

//   return (
//     <div>
//       <h5>Found {totalResults} interactions | Search Time: {searchTime} </h5>

//       <button onClick={downloadCSV} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px' 
//       }}>Download CSV</button>

//       <button onClick={downloadExcel} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px',
//         marginLeft: '10px' 
//       }}>Download Excel</button>

//       <button onClick={downloadPDF} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px',
//         marginLeft: '10px' 
//       }}>Download PDF</button>

//       <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
//         <thead>
//           <tr>
//             <th>RecordID</th>
//             <th>Name</th>
//             <th>Gender</th>
//             <th>DateOfBirth</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {searchResults.map((row, idx) => (
//             <React.Fragment key={idx}>
//               <tr>
//                 <td dangerouslySetInnerHTML={{ __html: highlightText(row.RecordID) }}></td>
//                 <td dangerouslySetInnerHTML={{ __html: highlightText(row.Name) }}></td>
//                 <td dangerouslySetInnerHTML={{ __html: highlightText(row.Gender) }}></td>
//                 <td dangerouslySetInnerHTML={{ __html: highlightText(row.DateOfBirth) }}></td>
//                 <td dangerouslySetInnerHTML={{ __html: highlightText(row.Email) }}></td>
//                 <td dangerouslySetInnerHTML={{ __html: highlightText(row.Phone) }}></td>
//                 <td>
//                   <button onClick={() => toggleRow(idx)}>
//                     {expandedRows[idx] ? 'Hide Details' : 'Show Details'}
//                   </button>
//                 </td>
//               </tr>
//               {expandedRows[idx] && (
//                 <tr>
//                   <td colSpan="7">
//                     <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
//                       {Object.keys(row).map(key => {
//                         if (!['RecordID', 'Name', 'Gender', 'DateOfBirth', 'Email', 'Phone'].includes(key)) {
//                           return (
//                             <div key={key} dangerouslySetInnerHTML={{ __html: highlightText(`${key}: ${row[key]}`) }}></div>
//                           );
//                         }
//                         return null;
//                       })}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
//           Previous
//         </button>
//         <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
//         <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ResultsTable;



// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// function ResultsTable({ searchResults, searchTime, totalResults, page, fetchResults }) {
//   const [expandedRows, setExpandedRows] = useState({});

//   const totalPages = Math.ceil(totalResults / 10);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     fetchResults(newPage);
//   };

//   // Dynamically get the first 6 keys from the first search result as headers
//   const getHeaders = (results) => {
//     if (results.length === 0) return [];
//     const keys = Object.keys(results[0]);
//     return keys.slice(0, 5); // Get the first 6 keys
//   };

//   const headers = getHeaders(searchResults); // Dynamically generated headers from the response

//   const flattenRow = (row) => {
//     let flatRow = {};

//     // Use dynamic headers
//     headers.forEach(field => {
//       flatRow[field] = row[field] || '';
//     });

//     Object.keys(row).forEach(key => {
//       if (!headers.includes(key)) {
//         flatRow[key] = row[key];
//       }
//     });

//     return flatRow;
//   };

//   const highlightText = (text) => {
//     if (!text) return text;

//     // Replace <highlight> tags with <span> elements
//     return text.replace(/<highlight>(.*?)<\/highlight>/g, '<span style="background-color: yellow;">$1</span>');
//   };

//   const downloadCSV = () => {
//     if (searchResults.length === 0) return;

//     const flatResults = searchResults.map(flattenRow);
//     const allHeaders = Object.keys(flatResults[0]);
//     const rows = flatResults.map(row => allHeaders.map(header => row[header]));

//     let csvContent = 'data:text/csv;charset=utf-8,'
//       + allHeaders.join(',') + '\n'
//       + rows.map(row => row.join(',')).join('\n');

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'search_results.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const downloadExcel = () => {
//     if (searchResults.length === 0) return;

//     const flatResults = searchResults.map(flattenRow);
//     const allHeaders = Object.keys(flatResults[0]);
//     const data = [
//       allHeaders,
//       ...flatResults.map(row => allHeaders.map(header => row[header]))
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

//     XLSX.writeFile(workbook, 'search_results.xlsx');
//   };

//   const downloadPDF = () => {
//     if (searchResults.length === 0) return;

//     const doc = new jsPDF();
//     const defaultFontSize = 12;
//     const smallerFontSize = 10;
//     const pageHeight = doc.internal.pageSize.height;
//     let yPosition = 20;

//     doc.setFontSize(defaultFontSize);
//     doc.text('Search Results', 14, 10);

//     searchResults.forEach((row, index) => {
//       if (yPosition + 20 > pageHeight) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       doc.setFontSize(defaultFontSize);
//       doc.text(`Record ${index + 1}`, 14, yPosition);
//       yPosition += 10;

//       doc.setFontSize(smallerFontSize);
//       Object.keys(row).forEach((key) => {
//         if (yPosition + 10 > pageHeight) {
//           doc.addPage();
//           yPosition = 20;
//         }
//         doc.text(`${key}: ${row[key]}`, 20, yPosition);
//         yPosition += 8;
//       });

//       yPosition += 10;
//     });

//     doc.save('search_results.pdf');
//   };

//   const toggleRow = (idx) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [idx]: !prev[idx]
//     }));
//   };

//   return (
//     <div>
//       <h5>Found {totalResults} interactions | Search Time: {searchTime} </h5>

//       <button onClick={downloadCSV} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px' 
//       }}>Download CSV</button>

//       <button onClick={downloadExcel} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px',
//         marginLeft: '10px' 
//       }}>Download Excel</button>

//       <button onClick={downloadPDF} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px',
//         marginLeft: '10px' 
//       }}>Download PDF</button>

//       <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
//         <thead>
//           <tr>
//             {headers.map(header => (
//               <th key={header}>{header}</th>
//             ))}
//             <th>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {searchResults.map((row, idx) => (
//             <React.Fragment key={idx}>
//               <tr>
//                 {headers.map(header => (
//                   <td key={header} dangerouslySetInnerHTML={{ __html: highlightText(row[header]) }}></td>
//                 ))}
//                 <td>
//                   <button onClick={() => toggleRow(idx)}>
//                     {expandedRows[idx] ? 'Hide Details' : 'Show Details'}
//                   </button>
//                 </td>
//               </tr>
//               {expandedRows[idx] && (
//                 <tr>
//                   <td colSpan={headers.length + 1}>
//                     <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
//                       {Object.keys(row).map(key => {
//                         if (!headers.includes(key)) {
//                           return (
//                             <div key={key} dangerouslySetInnerHTML={{ __html: highlightText(`${key}: ${row[key]}`) }}></div>
//                           );
//                         }
//                         return null;
//                       })}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
//           Previous
//         </button>
//         <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
//         <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ResultsTable;

//working before two tables logic
// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// function ResultsTable({ searchResults, searchTime, totalResults, page, fetchResults }) {
//   const [expandedRows, setExpandedRows] = useState({});

//   const totalPages = Math.ceil(totalResults / 10);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     fetchResults(newPage);
//   };

//   // Check if a value is considered NaN or invalid
//   const isInvalid = (value) => value === undefined || value === null || value === 'NaN';

//   // Find first valid object (no NaN in first 5 fields) and extract headers from it
//   const getHeaders = (results) => {
//     for (let result of results) {
//       const keys = Object.keys(result);
//       const firstFiveValues = keys.slice(0, 5).map(key => result[key]);

//       // If all first five values are valid (not NaN), use this as the header
//       if (firstFiveValues.every(value => !isInvalid(value))) {
//         return keys.slice(0, 5); // Take only the first 5 keys as headers
//       }
//     }
//     return []; // Return empty if no valid object is found
//   };

//   const headers = getHeaders(searchResults); // Dynamically generated headers from the response

//   const flattenRow = (row) => {
//     let flatRow = {};

//     headers.forEach(field => {
//       flatRow[field] = row[field] || '';
//     });

//     Object.keys(row).forEach(key => {
//       if (!headers.includes(key)) {
//         flatRow[key] = row[key];
//       }
//     });

//     return flatRow;
//   };

//   const highlightText = (text) => {
//     if (!text) return text;

//     return text.replace(/<highlight>(.*?)<\/highlight>/g, '<span style="background-color: yellow;">$1</span>');
//   };

//   const downloadCSV = () => {
//     if (searchResults.length === 0) return;

//     const flatResults = searchResults.map(flattenRow);
//     const allHeaders = Object.keys(flatResults[0]);
//     const rows = flatResults.map(row => allHeaders.map(header => row[header]));

//     let csvContent = 'data:text/csv;charset=utf-8,'
//       + allHeaders.join(',') + '\n'
//       + rows.map(row => row.join(',')).join('\n');

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'search_results.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const downloadExcel = () => {
//     if (searchResults.length === 0) return;

//     const flatResults = searchResults.map(flattenRow);
//     const allHeaders = Object.keys(flatResults[0]);
//     const data = [
//       allHeaders,
//       ...flatResults.map(row => allHeaders.map(header => row[header]))
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

//     XLSX.writeFile(workbook, 'search_results.xlsx');
//   };

//   const downloadPDF = () => {
//     if (searchResults.length === 0) return;

//     const doc = new jsPDF();
//     const defaultFontSize = 12;
//     const smallerFontSize = 10;
//     const pageHeight = doc.internal.pageSize.height;
//     let yPosition = 20;

//     doc.setFontSize(defaultFontSize);
//     doc.text('Search Results', 14, 10);

//     searchResults.forEach((row, index) => {
//       if (yPosition + 20 > pageHeight) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       doc.setFontSize(defaultFontSize);
//       doc.text(`Record ${index + 1}`, 14, yPosition);
//       yPosition += 10;

//       doc.setFontSize(smallerFontSize);
//       Object.keys(row).forEach((key) => {
//         if (yPosition + 10 > pageHeight) {
//           doc.addPage();
//           yPosition = 20;
//         }
//         doc.text(`${key}: ${row[key]}`, 20, yPosition);
//         yPosition += 8;
//       });

//       yPosition += 10;
//     });

//     doc.save('search_results.pdf');
//   };

//   const toggleRow = (idx) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [idx]: !prev[idx]
//     }));
//   };

//   return (
//     <div>
//       <h5>Found {totalResults} interactions | Search Time: {searchTime} </h5>

//       <button onClick={downloadCSV} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px' 
//       }}>Download CSV</button>

//       <button onClick={downloadExcel} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px',
//         marginLeft: '10px' 
//       }}>Download Excel</button>

//       <button onClick={downloadPDF} style={{  
//         fontSize: 'small', 
//         padding: '5px 10px',
//         marginLeft: '10px' 
//       }}>Download PDF</button>

//       <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
//         <thead>
//           <tr>
//             {headers.map(header => (
//               <th key={header}>{header}</th>
//             ))}
//             <th>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {searchResults.map((row, idx) => (
//             <React.Fragment key={idx}>
//               <tr>
//                 {headers.map(header => (
//                   <td key={header} dangerouslySetInnerHTML={{ __html: highlightText(row[header]) }}></td>
//                 ))}
//                 <td>
//                   <button onClick={() => toggleRow(idx)}>
//                     {expandedRows[idx] ? 'Hide Details' : 'Show Details'}
//                   </button>
//                 </td>
//               </tr>
//               {expandedRows[idx] && (
//                 <tr>
//                   <td colSpan={headers.length + 1}>
//                     <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
//                       {Object.keys(row).map(key => {
//                         if (!headers.includes(key)) {
//                           return (
//                             <div key={key} dangerouslySetInnerHTML={{ __html: highlightText(`${key}: ${row[key]}`) }}></div>
//                           );
//                         }
//                         return null;
//                       })}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
//           Previous
//         </button>
//         <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
//         <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ResultsTable;


import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ResultsTable({ searchResults, searchTime, totalResults, page, fetchResults }) {
  const [expandedRows, setExpandedRows] = useState({});

  const totalPages = Math.ceil(totalResults / 10);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchResults(newPage);
  };

  // Check if a value is considered NaN or invalid
  const isInvalid = (value) => value === undefined || value === null || value === 'NaN';

  // Helper to get the first five fields of a row
  const getFirstFiveFields = (row) => {
    const keys = Object.keys(row);
    return keys.slice(0, 5).map(key => row[key]);
  };

  // Compare headers and group results into two tables at most
  const groupResultsIntoTwoTables = (results) => {
    let table1 = [];
    let table2 = [];
    let table1Headers = null;
    let table2Headers = null;

    results.forEach((result) => {
      const firstFiveFields = getFirstFiveFields(result);
      const currentHeaders = Object.keys(result).slice(0, 5);

      if (!table1Headers) {
        // First result, assign it to table1
        table1Headers = currentHeaders;
        table1.push(result);
      } else if (table1Headers.every((header, idx) => header === currentHeaders[idx])) {
        // If headers match table1, add it to table1
        table1.push(result);
      } else if (!table2Headers) {
        // If table2 is empty, assign this result to table2
        table2Headers = currentHeaders;
        table2.push(result);
      } else if (table2Headers.every((header, idx) => header === currentHeaders[idx])) {
        // If headers match table2, add it to table2
        table2.push(result);
      }
    });

    return [table1, table2]; // Return the two tables
  };

  // Group search results into two tables based on headers
  const [table1, table2] = groupResultsIntoTwoTables(searchResults);

  const headersForTable = (group) => {
    if (group.length > 0) {
      const keys = Object.keys(group[0]);
      return keys.slice(0, 5);
    }
    return [];
  };

  const flattenRow = (row, headers) => {
    let flatRow = {};
    headers.forEach(field => {
      flatRow[field] = row[field] || '';
    });
    Object.keys(row).forEach(key => {
      if (!headers.includes(key)) {
        flatRow[key] = row[key];
      }
    });
    return flatRow;
  };

  const highlightText = (text) => {
    if (!text) return text;
    return text.replace(/<highlight>(.*?)<\/highlight>/g, '<span style="background-color: yellow;">$1</span>');
  };

  const downloadCSV = (group) => {
    if (group.length === 0) return;

    const flatResults = group.map(row => flattenRow(row, headersForTable(group)));
    const allHeaders = Object.keys(flatResults[0]);
    const rows = flatResults.map(row => allHeaders.map(header => row[header]));

    let csvContent = 'data:text/csv;charset=utf-8,'
      + allHeaders.join(',') + '\n'
      + rows.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'search_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = (group) => {
    if (group.length === 0) return;

    const flatResults = group.map(row => flattenRow(row, headersForTable(group)));
    const allHeaders = Object.keys(flatResults[0]);
    const data = [
      allHeaders,
      ...flatResults.map(row => allHeaders.map(header => row[header]))
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    XLSX.writeFile(workbook, 'search_results.xlsx');
  };

  const downloadPDF = (group) => {
    if (group.length === 0) return;

    const doc = new jsPDF();
    const defaultFontSize = 12;
    const smallerFontSize = 10;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    doc.setFontSize(defaultFontSize);
    doc.text('Search Results', 14, 10);

    group.forEach((row, index) => {
      if (yPosition + 20 > pageHeight) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(defaultFontSize);
      doc.text(`Record ${index + 1}`, 14, yPosition);
      yPosition += 10;

      doc.setFontSize(smallerFontSize);
      Object.keys(row).forEach((key) => {
        if (yPosition + 10 > pageHeight) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${key}: ${row[key]}`, 20, yPosition);
        yPosition += 8;
      });

      yPosition += 10;
    });

    doc.save('search_results.pdf');
  };

  const toggleRow = (idx) => {
    setExpandedRows(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div>
      <h5>Found {totalResults} interactions | Search Time: {searchTime} </h5>

      {/* Render first table */}
      {table1.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h6>Table 1</h6>
          <button onClick={() => downloadCSV(table1)} style={{  
            fontSize: 'small', 
            padding: '5px 10px' 
          }}>Download CSV</button>

          <button onClick={() => downloadExcel(table1)} style={{  
            fontSize: 'small', 
            padding: '5px 10px',
            marginLeft: '10px' 
          }}>Download Excel</button>

          <button onClick={() => downloadPDF(table1)} style={{  
            fontSize: 'small', 
            padding: '5px 10px',
            marginLeft: '10px' 
          }}>Download PDF</button>

          <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
            <thead>
              <tr>
                {headersForTable(table1).map(header => (
                  <th key={header}>{header}</th>
                ))}
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {table1.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    {headersForTable(table1).map(header => (
                      <td key={header} dangerouslySetInnerHTML={{ __html: highlightText(row[header]) }}></td>
                    ))}
                    <td>
                      <button onClick={() => toggleRow(idx)}>
                        {expandedRows[idx] ? 'Hide Details' : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[idx] && (
                    <tr>
                      <td colSpan={headersForTable(table1).length + 1}>
                        <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
                          {Object.keys(row).map(key => {
                            if (!headersForTable(table1).includes(key)) {
                              return (
                                <div key={key} dangerouslySetInnerHTML={{ __html: highlightText(`${key}: ${row[key]}`) }}></div>
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
      )}

      {/* Render second table if it exists */}
      {table2.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h6>Table 2</h6>
          <button onClick={() => downloadCSV(table2)} style={{  
            fontSize: 'small', 
            padding: '5px 10px' 
          }}>Download CSV</button>

          <button onClick={() => downloadExcel(table2)} style={{  
            fontSize: 'small', 
            padding: '5px 10px',
            marginLeft: '10px' 
          }}>Download Excel</button>

          <button onClick={() => downloadPDF(table2)} style={{  
            fontSize: 'small', 
            padding: '5px 10px',
            marginLeft: '10px' 
          }}>Download PDF</button>

          <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
            <thead>
              <tr>
                {headersForTable(table2).map(header => (
                  <th key={header}>{header}</th>
                ))}
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {table2.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    {headersForTable(table2).map(header => (
                      <td key={header} dangerouslySetInnerHTML={{ __html: highlightText(row[header]) }}></td>
                    ))}
                    <td>
                      <button onClick={() => toggleRow(idx)}>
                        {expandedRows[idx] ? 'Hide Details' : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[idx] && (
                    <tr>
                      <td colSpan={headersForTable(table2).length + 1}>
                        <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
                          {Object.keys(row).map(key => {
                            if (!headersForTable(table2).includes(key)) {
                              return (
                                <div key={key} dangerouslySetInnerHTML={{ __html: highlightText(`${key}: ${row[key]}`) }}></div>
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
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ResultsTable;










































