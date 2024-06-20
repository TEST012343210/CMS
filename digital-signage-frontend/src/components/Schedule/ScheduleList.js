// src/components/Schedule/ScheduleList.js
import React, { useEffect, useState } from 'react';
import { getAllSchedules } from '../../services/scheduleService';

const ScheduleList = ({ token }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getAllSchedules(token);
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules', error.response.data);
      }
    };

    fetchSchedules();
  }, [token]);

  return (
    <div>
      <h2>Schedule List</h2>
      <ul>
        {schedules.map((item) => (
          <li key={item._id}>
            Content ID: {item.content._id}, Start: {new Date(item.startTime).toLocaleString()}, End: {new Date(item.endTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleList;
