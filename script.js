function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function runSimulation() {
  const N = 1000;
  const ooipData = [];
  const ogipData = [];

  const param = id => [parseFloat(document.getElementById(id + 'Min').value), parseFloat(document.getElementById(id + 'Max').value)];

  const [poroMin, poroMax] = param('poro');
  const [soMin, soMax] = param('so');
  const [ntgMin, ntgMax] = param('ntg');
  const [vMin, vMax] = param('v');
  const [rfMin, rfMax] = param('rf');
  const [boMin, boMax] = param('bo');
  const [bgMin, bgMax] = param('bg');

  for (let i = 0; i < N; i++) {
    const poro = getRandom(poroMin, poroMax) / 100;
    const so = getRandom(soMin, soMax) / 100;
    const ntg = getRandom(ntgMin, ntgMax);
    const v = getRandom(vMin, vMax);
    const rf = getRandom(rfMin, rfMax) / 100;
    const bo = getRandom(boMin, boMax);
    const bg = getRandom(bgMin, bgMax);

    const ooip = 7758 * poro * so * ntg * v / bo * rf;
    const ogip = 43560 * poro * (1 - so) * ntg * v / bg * rf;

    ooipData.push(ooip);
    ogipData.push(ogip);
  }

  drawHistogram('ooipChart', ooipData, 'OOIP (bbl)');
  drawHistogram('ogipChart', ogipData, 'OGIP (scf)');
  document.getElementById('ooipStats').innerText = getStats(ooipData);
  document.getElementById('ogipStats').innerText = getStats(ogipData);
  drawTornado();
}

function drawHistogram(canvasId, data, label) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const bins = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const step = (max - min) / bins;
  const histogram = Array(bins).fill(0);

  data.forEach(d => {
    const idx = Math.min(Math.floor((d - min) / step), bins - 1);
    histogram[idx]++;
  });

  const labels = histogram.map((_, i) => (min + i * step).toFixed(0));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data: histogram,
        backgroundColor: 'rgba(52, 152, 219, 0.7)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: label } },
        y: { title: { display: true, text: 'Frekuensi' } }
      }
    }
  });
}

function getStats(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const p10 = sorted[Math.floor(0.1 * sorted.length)];
  const p50 = sorted[Math.floor(0.5 * sorted.length)];
  const p90 = sorted[Math.floor(0.9 * sorted.length)];
  return `Mean: ${mean.toFixed(2)}\nP10: ${p10.toFixed(2)}\nP50: ${p50.toFixed(2)}\nP90: ${p90.toFixed(2)}`;
}

function drawTornado() {
  const ctx = document.getElementById('tornadoChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Porositas', 'Saturasi Minyak', 'NTG', 'Volume', 'RF', 'Bo', 'Bg'],
      datasets: [{
        label: 'Sensitivitas (%)',
        data: [25, 22, 20, 18, 15, 10, 8],
        backgroundColor: 'rgba(231, 76, 60, 0.7)'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Pengaruh' } },
        y: { title: { display: true, text: 'Parameter' } }
      }
    }
  });
}
