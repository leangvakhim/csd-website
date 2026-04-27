import React from 'react';
import TypeProgram from './TypeProgram';
import TypeScholar from './TypeScholar';
import { useData } from '../../Context/DataContext';

const TypeController = ({ section }) => {
  const { globalData, isLoading } = useData();
  const data = globalData?.types || [];

  if (isLoading) return null;

  // Filter types based on section if provided
  const filteredData = section 
    ? data.filter(item => item.sec_id === section.sec_id)
    : data;

  return (
    <div>
      {filteredData.map((item) =>
        item.tse_type === 1 ? (
          <TypeScholar key={item.tse_id} section={section || item.section} />
        ) : item.tse_type === 2 ? (
          <TypeProgram key={item.tse_id} section={section || item.section} />
        ) : null
      )}
    </div>
  );
};

export default TypeController;