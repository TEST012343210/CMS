// src/components/Schedule/ScheduleForm.js
import React, { useState } from 'react';
import { createSchedule } from '../../services/scheduleService';

const ScheduleForm = ({ token }) => {
  const [content, setContent] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createSchedule(content, startTime, endTime, token);
      console.log('Schedule created', response.data);
      // Clear the form
      setContent('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error creating schedule', error.response.data);
    }
  };

  return (
    <div>
      <h2>Create Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content ID</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleForm;
