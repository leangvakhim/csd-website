import React, { useState, useEffect } from 'react';
import TypeProgram from './TypeProgram';
import TypeScholar from './TypeScholar';
import { API_ENDPOINTS, axiosInstance } from '../../Service/APIconfig';

const TypeController = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.getType);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 200 && result.status_code === 'success') {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <TypeProgram />
      {data.map((item) =>
        item.tse_type === 1 ? (
          <TypeScholar key={item.tse_id} />
        ) : item.tse_type === 2 ? (
          <TypeProgram key={item.tse_id} />
        ) : null
      )}
    </div>
  );
};

export default TypeController;