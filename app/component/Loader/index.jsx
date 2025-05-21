import React from 'react';

const Loader = () => {
  return (
    <div className={`flex justify-center items-center h-screen`}>
      <div className='w-16 h-16 border-4 border-t-secondary animate-spin rounded-full text-secondary' role="status"/>
    </div>
  );
};

export default Loader;
