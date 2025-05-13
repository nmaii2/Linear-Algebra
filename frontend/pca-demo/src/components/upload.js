import React, { useState } from 'react';
import axios from 'axios';

function Upload({ setPcaResult }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://pca-backend-kmei.onrender.com/upload', formData);
      setPcaResult(res.data);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
}

export default Upload;
