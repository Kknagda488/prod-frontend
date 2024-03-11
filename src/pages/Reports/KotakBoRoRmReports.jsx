import React, { useState, useEffect } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
const rows = [
  // Sample data, replace with your actual data
  { id: 1, empCode: 'E001', empName: 'John Doe', function: 'Sales', role: 'RO', day1: 80, day2: 85, day3: 75, assessmentScores: 90, certification: 'Yes', feedbackScores: 4.5, attendance: 'Present', interactionScores: 5.0 },
  { id: 2, empCode: 'E002', empName: 'Jane Doe', function: 'Marketing', role: 'RM', day1: 75, day2: 80, day3: 85, assessmentScores: 92, certification: 'Yes', feedbackScores: 4.8, attendance: 'Present', interactionScores: 4.7 },
  // Add more rows as needed
];
const KotakBoRoRmReports = () => {
  const [reports, setReports] = useState([]);
  const [timeRange, setTimeRange] = useState('daily'); // Default time range is daily

  // Fetch reports data based on the selected time range
  const fetchReports = async () => {
    // Implement your API call or data fetching logic here
    // Update the 'data' variable with the fetched data
    //   const data = await yourApiCall(timeRange); // Replace 'yourApiCall' with your actual API call
    setReports(rows);
  };
  // const [reportFrequency, setReportFrequency] = useState('Daily');

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };


  const columns = [
    { field: 'id', headerName: 'S.No', width: 90 },
    { field: 'empCode', headerName: 'E.Code', width: 120 },
    { field: 'empName', headerName: 'Emp. Name', width: 150 },
    { field: 'function', headerName: 'Function', width: 120 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'day1', headerName: 'Day 1', type: 'number', width: 100 },
    { field: 'day2', headerName: 'Day 2', type: 'number', width: 100 },
    { field: 'day3', headerName: 'Day 3', type: 'number', width: 100 },
    { field: 'assessmentScores', headerName: 'Assessment Scores', type: 'number', width: 150 },
    { field: 'certification', headerName: 'Certification', width: 120 },
    { field: 'feedbackScores', headerName: 'Feedback Scores', type: 'number', width: 150 },
    { field: 'attendance', headerName: 'Attendance', width: 120 },
    { field: 'interactionScores', headerName: 'Interaction Scores', type: 'number', width: 150 },
  ];

  return (

    <div>
      {/* Dropdown to select time range */}
      <FormControl>
        <InputLabel id="time-range-label">Time Range</InputLabel>
        <Select
          labelId="time-range-label"
          id="time-range-select"
          value={timeRange}
          label="Time Range"
          onChange={handleTimeRangeChange}
          style={{ minWidth: '150px', fontSize: '16px' }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="quarterly">Quarterly</MenuItem>
        </Select>
      </FormControl>

      {/* Data Grid to display reports */}
      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>

      </div>
    </div>
  );
};
export default KotakBoRoRmReports