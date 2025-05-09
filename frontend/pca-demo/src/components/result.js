import React from 'react';
import Plot from 'react-plotly.js';

function Result({ data }) {
  const {
    principal_components,
    explained_variance_ratio,
    column_names,
    V,
    labels = null, // optional: cluster labels
  } = data;

  // Extract PC scores
  const pc1 = principal_components.map((row) => row[0]);
  const pc2 = principal_components.map((row) => row[1]);
  const pc3 = principal_components.map((row) => row[2]);

  // 3D Scatter plot
  const scatter3D = {
    x: pc1,
    y: pc2,
    z: pc3,
    mode: 'markers',
    type: 'scatter3d',
    marker: {
      size: 5,
      color: labels || pc1,
      colorscale: 'Viridis',
      opacity: 0.8,
    },
    name: 'Data Points',
  };

  // Coefficient lines
  const pcLines = V.slice(0, 3).map((pc, i) => ({
    x: column_names,
    y: pc,
    type: 'scatter',
    mode: 'lines+markers',
    name: `PC${i + 1}`,
  }));

  // Scree plot
  const screeBar = {
    x: explained_variance_ratio.map((_, i) => `PC${i + 1}`),
    y: explained_variance_ratio.map((v) => v * 100),
    type: 'bar',
    name: 'Variance (%)',
    marker: { color: 'steelblue' },
  };

  const screeLine = {
    x: explained_variance_ratio.map((_, i) => `PC${i + 1}`),
    y: explained_variance_ratio.map((v) => v * 100),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Line',
    line: { color: 'black' },
  };

  // Variable biplot (2D arrows for PC1 and PC2)
  const biplotTraces = column_names.map((name, i) => {
    const x = V[0][i];
    const y = V[1][i];
    const cos2 = x * x + y * y;

    return {
      type: 'scatter',
      mode: 'lines+text',
      x: [0, x],
      y: [0, y],
      line: {
        color: `rgba(${255 * cos2}, ${50}, ${255 * (1 - cos2)}, 0.9)`,
        width: 2,
      },
      text: [null, name],
      textposition: 'top center',
      name,
      hoverinfo: 'text',
      showlegend: false,
    };
  });

  return (
    <div>
      <h2>PCA 3D Scatter Plot (PC1, PC2, PC3)</h2>
      <Plot
        data={[scatter3D]}
        layout={{
          title: '3D PCA Scatter Plot',
          scene: {
            xaxis: { title: `PC1 - ${(explained_variance_ratio[0] * 100).toFixed(2)}%` },
            yaxis: { title: `PC2 - ${(explained_variance_ratio[1] * 100).toFixed(2)}%` },
            zaxis: { title: `PC3 - ${(explained_variance_ratio[2] * 100).toFixed(2)}%` },
          },
          height: 600,
        }}
      />

      <h2>Principal Component Coefficients</h2>
      <Plot
        data={pcLines}
        layout={{
          title: 'Coefficients for PC1, PC2, PC3',
          xaxis: { title: 'Variables' },
          yaxis: { title: 'Coefficient' },
          height: 1000,
        }}
      />

      <h2>Scree Plot</h2>
      <Plot
        data={[screeBar, screeLine]}
        layout={{
          title: 'Explained Variance by Principal Component',
          xaxis: { title: 'Principal Components' },
          yaxis: { title: 'Variance Explained (%)' },
          height: 400,
        }}
      />

      <h2>PCA Variable Biplot (PC1 vs PC2)</h2>
      <Plot
        data={biplotTraces}
        layout={{
          title: 'Variable Loadings on PC1 and PC2',
          xaxis: {
            title: `Dim1 (${(explained_variance_ratio[0] * 100).toFixed(1)}%)`,
            zeroline: true,
          },
          yaxis: {
            title: `Dim2 (${(explained_variance_ratio[1] * 100).toFixed(1)}%)`,
            zeroline: true,
          },
          showlegend: false,
          width: 600,
          height: 600,
        }}
      />

      <p>
        <strong>Explained Variance Ratio:</strong>{' '}
        {explained_variance_ratio.map((v, i) => `PC${i + 1}: ${(v * 100).toFixed(2)}%`).join(', ')}
      </p>
    </div>
  );
}

export default Result;
