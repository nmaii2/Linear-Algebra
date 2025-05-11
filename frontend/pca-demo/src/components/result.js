import React from 'react';
import Plot from 'react-plotly.js';

function Result({ data }) {
  const {
    principal_components,
    explained_variance_ratio,
    column_names,
    V,
    labels = null,
  } = data;

  if (!principal_components?.length || !V?.length || !explained_variance_ratio?.length) {
    return <p>No PCA data available.</p>;
  }

  const pc1 = principal_components.map((row) => row[0]);
  const pc2 = principal_components.map((row) => row[1]);
  const pc3 = principal_components.map((row) => row[2]);

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
      colorbar: labels ? { title: 'Cluster' } : undefined,
    },
    name: 'Data Points',
  };

  const pcLines = V.slice(0, 3).map((pc, i) => ({
    x: column_names,
    y: pc,
    type: 'scatter',
    mode: 'lines+markers',
    name: `PC${i + 1}`,
  }));

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
        color: `rgba(${255 * cos2}, 50, ${255 * (1 - cos2)}, 0.9)`,
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
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
          autosize: true,
          height: 600,
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />

      <h2>Principal Component Coefficients</h2>
      <Plot
        data={pcLines}
        layout={{
          title: 'Coefficients for PC1, PC2, PC3',
          xaxis: { title: 'Variables' },
          yaxis: { title: 'Coefficient' },
          autosize: true,
          height: 600,
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
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
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />

      <h2>PCA Loadings Plot </h2>
      <Plot
        data={biplotTraces}
        layout={{
          title: 'Variable Loadings on PC1 and PC2',
          xaxis: {
            title: `Dim1 (${(explained_variance_ratio[0] * 100).toFixed(1)}%)`,
            range: [-1.2, 1.2],
            zeroline: true,
          },
          yaxis: {
            title: `Dim2 (${(explained_variance_ratio[1] * 100).toFixed(1)}%)`,
            range: [-1.2, 1.2],
            zeroline: true,
          },
          shapes: [
            {
              type: 'circle',
              xref: 'x',
              yref: 'y',
              x0: -1,
              y0: -1,
              x1: 1,
              y1: 1,
              line: { color: 'lightgray', dash: 'dot' },
            },
          ],
          showlegend: false,
          height: 600,
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />

<h2>PCA Scatter Plot (PC1 vs PC2 by Group)</h2>
<Plot
  data={
    labels
      ? Array.from(new Set(labels)).map((group, groupIndex) => {
          const indices = labels
            .map((label, idx) => (label === group ? idx : -1))
            .filter((idx) => idx !== -1);

          return {
            x: indices.map((i) => pc1[i]),
            y: indices.map((i) => pc2[i]),
            mode: 'markers',
            type: 'scatter',
            name: `Group ${group}`,
            marker: {
              size: 6,
              color: groupIndex, // assigns a unique color per group via color index
              colorscale: 'Set1', // good categorical colormap
              showscale: false,
            },
            text: indices.map((i) => `Group ${labels[i]}`),
            hoverinfo: 'text',
          };
        })
      : [
          {
            x: pc1,
            y: pc2,
            mode: 'markers',
            type: 'scatter',
            marker: {
              size: 6,
              color: 'gray',
            },
            name: 'Data Points',
          },
        ]
  }
  layout={{
    title: 'PCA Scatter Plot (PC1 vs PC2)',
    xaxis: {
      title: `PC1 (${(explained_variance_ratio[0] * 100).toFixed(2)}%)`,
      zeroline: true,
    },
    yaxis: {
      title: `PC2 (${(explained_variance_ratio[1] * 100).toFixed(2)}%)`,
      zeroline: true,
    },
    height: 600,
    showlegend: true,
  }}
  useResizeHandler
  style={{ width: '100%', height: '100%' }}
/>

<h2>PCA Biplot (PC1 vs PC2 with Groups)</h2>
<Plot
  data={[
    {
      x: pc1,
      y: pc2,
      mode: 'markers',
      type: 'scatter',
      marker: {
        color: labels || 'gray',
        colorscale: 'Set1',
        size: 6,
        showscale: !!labels,
        colorbar: labels ? { title: 'Group' } : undefined,
      },
      text: labels?.map((label) => `Group ${label}`),
      hoverinfo: 'text',
      name: 'Data Points',
    },
    ...column_names.map((name, i) => {
      const x = V[0][i];
      const y = V[1][i];
      return {
        type: 'scatter',
        mode: 'lines+text',
        x: [0, x],
        y: [0, y],
        line: {
          color: 'blue',
          width: 2,
        },
        text: [null, name],
        textposition: 'top center',
        showlegend: false,
        hoverinfo: 'text',
      };
    }),
  ]}
  layout={{
    title: 'Biplot',
    xaxis: {
      title: `Principal Component 1 (${(explained_variance_ratio[0] * 100).toFixed(2)}%)`,
      zeroline: true,
    },
    yaxis: {
      title: `Principal Component 2 (${(explained_variance_ratio[1] * 100).toFixed(2)}%)`,
      zeroline: true,
    },
    height: 600,
    showlegend: false,
  }}
  useResizeHandler
  style={{ width: '100%', height: '100%' }}
/>

      <p>
        <strong>Explained Variance Ratio:</strong>{' '}
        {explained_variance_ratio.map((v, i) => `PC${i + 1}: ${(v * 100).toFixed(2)}%`).join(', ')}
      </p>
    </div>
  );
}

export default Result;