import React from 'react';
import { ClipLoader } from 'react-spinners'; 

const Loader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      {/* ================ && •LEFT SECTION• && ================== */}
      {/* <div className="text-white center">Loading ...</div> */}
      <ClipLoader size={50} color="#1e40af" loading={true} />
    </div>
  );
};

export default Loader;