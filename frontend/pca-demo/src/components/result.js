import React from 'react';
import Plot from 'react-plotly.js';

function Result({ data }) {
  const { principal_components, explained_variance_ratio, column_names, V } = data;

  // PCA scatter: first 2 PCs
  const scatter = {
    x: principal_components.map((row) => row[0]),
    y: principal_components.map((row) => row[1]),
    mode: 'markers',
    type: 'scatter',
    marker: { color: 'blue' },
  };

  // Line plot of coefficients for PC1
  const line = {
    x: column_names,
    y: V[0],
    type: 'bar',
  };

  return (
    <div>
      <h2>PCA Scatter Plot (PC1 vs PC2)</h2>
      <Plot data={[scatter]} layout={{ title: 'PC1 vs PC2', xaxis: { title: 'PC1' }, yaxis: { title: 'PC2' } }} />

      <h2>PC1 Coefficients</h2>
      <Plot data={[line]} layout={{ title: 'Variable Contribution to PC1' }} />

      <p><strong>Explained Variance:</strong> {explained_variance_ratio.map(v => v.toFixed(2)).join(', ')}</p>
    </div>
  );
}

export default Result;
