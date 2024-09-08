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

  // Dynamically get the first 6 keys from the first search result as headers
  const getHeaders = (results) => {
    if (results.length === 0) return [];
    const keys = Object.keys(results[0]);
    return keys.slice(0, 5); // Get the first 6 keys
  };

  const headers = getHeaders(searchResults); // Dynamically generated headers from the response

  const flattenRow = (row) => {
    let flatRow = {};

    // Use dynamic headers
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

    // Replace <highlight> tags with <span> elements
    return text.replace(/<highlight>(.*?)<\/highlight>/g, '<span style="background-color: yellow;">$1</span>');
  };

  const downloadCSV = () => {
    if (searchResults.length === 0) return;

    const flatResults = searchResults.map(flattenRow);
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

  const downloadExcel = () => {
    if (searchResults.length === 0) return;

    const flatResults = searchResults.map(flattenRow);
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

  const downloadPDF = () => {
    if (searchResults.length === 0) return;

    const doc = new jsPDF();
    const defaultFontSize = 12;
    const smallerFontSize = 10;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    doc.setFontSize(defaultFontSize);
    doc.text('Search Results', 14, 10);

    searchResults.forEach((row, index) => {
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

      <button onClick={downloadCSV} style={{  
        fontSize: 'small', 
        padding: '5px 10px' 
      }}>Download CSV</button>

      <button onClick={downloadExcel} style={{  
        fontSize: 'small', 
        padding: '5px 10px',
        marginLeft: '10px' 
      }}>Download Excel</button>

      <button onClick={downloadPDF} style={{  
        fontSize: 'small', 
        padding: '5px 10px',
        marginLeft: '10px' 
      }}>Download PDF</button>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((row, idx) => (
            <React.Fragment key={idx}>
              <tr>
                {headers.map(header => (
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
                  <td colSpan={headers.length + 1}>
                    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
                      {Object.keys(row).map(key => {
                        if (!headers.includes(key)) {
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












































