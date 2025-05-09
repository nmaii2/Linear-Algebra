import React from 'react';
import Upload from './components/upload';
import Result from './components/result';

function App() {
  const [pcaResult, setPcaResult] = React.useState(null);
  console.log(pcaResult);

  return (
    <div className="App">
      <h1>PCA Web App</h1>
      <Upload setPcaResult={setPcaResult} />
      {pcaResult && <Result data={pcaResult} />}
    </div>
  );
}

export default App;
