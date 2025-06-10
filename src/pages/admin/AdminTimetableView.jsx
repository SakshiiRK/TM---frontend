import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import TimetableCard from '../../components/timetable/TimetableCard';

const AdminTimetableView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get('/timetable/search')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Uploaded Timetables</h2>
      {data.map((item) => (
        <TimetableCard key={item._id} slot={item} />
      ))}
    </div>
  );
};

export default AdminTimetableView;
