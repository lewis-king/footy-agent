import React from 'react';
import styled from 'styled-components';

interface MarkdownTableProps {
  markdown: string;
}

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 1.5rem 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
`;

const TableCell = styled.td`
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MarkdownTable: React.FC<MarkdownTableProps> = ({ markdown }) => {
  // Parse markdown table
  const parseTable = (markdown: string) => {
    const lines = markdown.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 3) {
      return null;
    }
    
    // Check if this is a markdown table
    const isTable = lines.every(line => line.includes('|'));
    if (!isTable) {
      return null;
    }
    
    // Extract headers and rows
    const headerLine = lines[0];
    const separatorLine = lines[1];
    const dataLines = lines.slice(2);
    
    // Parse headers
    const headers = headerLine
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');
    
    // Parse rows
    const rows = dataLines.map(line => {
      return line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '');
    });
    
    return { headers, rows };
  };
  
  const tableData = parseTable(markdown);
  
  if (!tableData) {
    return null;
  }
  
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {tableData.headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default MarkdownTable;
