import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [selectedTradeCode, setSelectedTradeCode] = useState('');
  const [isInserting, setIsInserting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/stocks/api/stocks/');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/stocks/api/stocks/${id}/delete/`);
      setStocks(stocks.filter(stock => stock.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  const handleEdit = (id) => {
    setEditableId(id);
  };

  const handleSave = useCallback(async (id, newData) => {
    for (const key in newData) {
      if (!newData[key]) {
        alert("All fields are required.");
        return;
      }
    }
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:8000/stocks/api/stocks/${id}/update/`, newData);
      setStocks(stocks.map(stock => (stock.id === id ? { ...newData, id } : stock)));
      setEditableId(null);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  const handleInsertSave = useCallback(async () => {
    const newStock = {
      date: document.querySelector('#new-date').value,
      trade_code: document.querySelector('#new-trade-code').value,
      high: document.querySelector('#new-high').value,
      low: document.querySelector('#new-low').value,
      open: document.querySelector('#new-open').value,
      close: document.querySelector('#new-close').value,
      volume: document.querySelector('#new-volume').value
    };

    // Check if any field is empty
    if (Object.values(newStock).some(value => value === '')) {
      alert('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/stocks/api/stocks/create/', newStock);
      setStocks([...stocks, response.data]);
      setIsInserting(false);
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  const filteredData = useMemo(() => stocks.filter(stock => stock.trade_code === selectedTradeCode), [stocks, selectedTradeCode]);

  // Ensure volume is a number
  const processedData = filteredData.map(stock => ({
    ...stock,
    volume: Number(stock.volume)
  }));

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return stocks.slice(startIndex, endIndex);
  }, [currentPage, stocks]);

  const renderChart = () => (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2 style={{ color: '#4A90E2' }}>Stocks Chart</h2>
      <select
        onChange={(e) => setSelectedTradeCode(e.target.value)}
        style={{
          padding: '10px',
          margin: '10px 0',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          width: '200px'
        }}
      >
        <option value="">Select Trade Code</option>
        {Array.from(new Set(stocks.map(stock => stock.trade_code))).map((code, index) => (
          <option key={index} value={code}>{code}</option>
        ))}
      </select>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ComposedChart width={800} height={400} data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" />
          <Bar yAxisId="right" dataKey="volume" barSize={20} fill="#413ea0" />
        </ComposedChart>
      </div>
    </div>
  );

  const renderTable = () => (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1 style={{ color: '#4A90E2' }}>Stocks Table</h1>
      <button
        onClick={() => setIsInserting(true)}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Insert
      </button>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Trade Code</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>High</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Low</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Open</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Close</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Volume</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isInserting && (
            <tr>
              <td><input type="text" id="new-date" /></td>
              <td><input type="text" id="new-trade-code" /></td>
              <td><input type="text" id="new-high" /></td>
              <td><input type="text" id="new-low" /></td>
              <td><input type="text" id="new-open" /></td>
              <td><input type="text" id="new-close" /></td>
              <td><input type="text" id="new-volume" /></td>
              <td><button onClick={handleInsertSave} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Save</button></td>
            </tr>
          )}
          {currentData.map(stock => (
            <tr key={stock.id}>
              <td>{editableId === stock.id ? <input type="text" id={`date-${stock.id}`} defaultValue={stock.date} /> : stock.date}</td>
              <td>{editableId === stock.id ? <input type="text" id={`trade-code-${stock.id}`} defaultValue={stock.trade_code} /> : stock.trade_code}</td>
              <td>{editableId === stock.id ? <input type="text" id={`high-${stock.id}`} defaultValue={stock.high} /> : stock.high}</td>
              <td>{editableId === stock.id ? <input type="text" id={`low-${stock.id}`} defaultValue={stock.low} /> : stock.low}</td>
              <td>{editableId === stock.id ? <input type="text" id={`open-${stock.id}`} defaultValue={stock.open} /> : stock.open}</td>
              <td>{editableId === stock.id ? <input type="text" id={`close-${stock.id}`} defaultValue={stock.close} /> : stock.close}</td>
              <td>{editableId === stock.id ? <input type="text" id={`volume-${stock.id}`} defaultValue={stock.volume} /> : stock.volume}</td>
              <td>
                {editableId === stock.id ? (
                  <button
                    onClick={() => handleSave(stock.id, {
                      date: document.querySelector(`#date-${stock.id}`).value,
                      trade_code: document.querySelector(`#trade-code-${stock.id}`).value,
                      high: document.querySelector(`#high-${stock.id}`).value,
                      low: document.querySelector(`#low-${stock.id}`).value,
                      open: document.querySelector(`#open-${stock.id}`).value,
                      close: document.querySelector(`#close-${stock.id}`).value,
                      volume: document.querySelector(`#volume-${stock.id}`).value
                    })}
                    style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(stock.id)}
                      style={{ backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stock.id)}
                      style={{ backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(stocks.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              margin: '0 5px',
              padding: '10px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === page ? '#4A90E2' : 'white',
              color: currentPage === page ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {renderChart()}
      {renderTable()}
    </div>
  );
};

export default App;
