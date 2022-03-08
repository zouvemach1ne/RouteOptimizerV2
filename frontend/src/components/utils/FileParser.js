import React, { useState } from 'react';
import * as XLSX from 'xlsx';


 
export default function UploadFile(props) {
 
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
 
  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
 
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
 
        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    setData(list);
    let cols = Object.assign({}, Object.keys(list[0]))
    console.log(list)
    console.log(cols)
    setColumns(cols);
    props.callback({'values':list, 'columns':cols})
  
 
    // prepare columns list from headers
    
  }

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
      //console.log(data[0]);
    };
    reader.readAsBinaryString(file);
  }
 
  return (
    <div>
      <input
        type="file"
        accept=".csv,.xlsx,.txt"
        onChange={handleFileUpload}
      />
    </div>
  );
}






