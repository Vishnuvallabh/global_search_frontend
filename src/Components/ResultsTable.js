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

  const flattenRow = (row) => {
    const mainFields = ['RecordID', 'Name', 'Gender', 'DateOfBirth', 'Email', 'Phone'];
    let flatRow = {};

    mainFields.forEach(field => {
      flatRow[field] = row[field] || '';
    });

    Object.keys(row).forEach(key => {
      if (!mainFields.includes(key)) {
        flatRow[key] = row[key];
      }
    });

    return flatRow;
  };

  // Function to download search results as CSV
  const downloadCSV = () => {
    if (searchResults.length === 0) return;

    const flatResults = searchResults.map(flattenRow);
    const headers = Object.keys(flatResults[0]);
    const rows = flatResults.map(row => headers.map(header => row[header]));

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

  const downloadExcel = () => {
    if (searchResults.length === 0) return;

    const flatResults = searchResults.map(flattenRow);
    const headers = Object.keys(flatResults[0]);
    const data = [
      headers,
      ...flatResults.map(row => headers.map(header => row[header]))
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    XLSX.writeFile(workbook, 'search_results.xlsx');
  };

  // Function to download search results as PDF with key-value pairs
// Function to download search results as PDF with key-value pairs and smaller font size
const downloadPDF = () => {
  if (searchResults.length === 0) return;

  const doc = new jsPDF();
  const defaultFontSize = 12; // Default font size for title
  const smallerFontSize = 10; // Smaller font size for key-value pairs
  const pageHeight = doc.internal.pageSize.height; // Get the height of the PDF page
  let yPosition = 20; // Initial y position for text

  // Add title to the document
  doc.setFontSize(defaultFontSize);
  doc.text('Search Results', 14, 10);

  searchResults.forEach((row, index) => {
    // Check if the yPosition exceeds the page height
    if (yPosition + 20 > pageHeight) { // 20 to accommodate record header and some spacing
      doc.addPage();
      yPosition = 20; // Reset y position for the new page
    }

    // Print record header
    doc.setFontSize(defaultFontSize);
    doc.text(`Record ${index + 1}`, 14, yPosition);
    yPosition += 10;

    // Print key-value pairs
    doc.setFontSize(smallerFontSize);
    Object.keys(row).forEach((key) => {
      // Check if the yPosition exceeds the page height before printing each key-value pair
      if (yPosition + 10 > pageHeight) { // 10 to accommodate line spacing
        doc.addPage();
        yPosition = 20; // Reset y position for the new page
      }
      doc.text(`${key}: ${row[key]}`, 20, yPosition);
      yPosition += 8; // Reduced line spacing for smaller font
    });

    yPosition += 10; // Extra space between records
  });

  doc.save('search_results.pdf');
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


























































