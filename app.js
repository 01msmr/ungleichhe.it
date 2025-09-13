// Chart rendern mit D3.js
renderChart(chartData) {
  const chartContent = document.getElementById('chartContent');

  // Vorherige Charts löschen
  d3.select('#chartContent').selectAll('*').remove();

  try {
    switch (chartData.type) {
      case 'bar':
        this.createD3BarChart(chartData);
        break;
      case 'line':
        this.createD3LineChart(chartData);
        break;
      case 'animated_line':
        this.createAnimatedLineChart(chartData);
        break;
      case 'race':
        this.createBarChartRace(chartData);
        break;
      default:
        this.createD3BarChart(chartData);
    }

    // Legende erstellen
    this.createLegend(chartData);

  } catch (error) {
    console.error('Fehler beim Rendern der D3 Chart:', error);
    this.showError('Fehler beim Anzeigen der Daten');
  }
}

// D3.js Balkendiagramm
createD3BarChart(chartData) {
  const container = d3.select('#chartContent');
  const containerRect = container.node().getBoundingClientRect();

  const margin = { top: 20, right: 30, bottom: 60, left: 50 };
  const width = containerRect.width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = container.append('svg')
    .attr('class', 'd3-chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Skalen
  const x = d3.scaleBand()
    .domain(chartData.labels)
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData.values)])
    .range([height, 0]);

  // Farbskala
  const colorScale = d3.scaleSequential()
    .domain([0, d3.max(chartData.values)])
    .interpolator(d3.interpolateRgb(chartData.color + '60', chartData.color));

  // Achsen
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)');

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).tickFormat(d => `${d}${chartData.unit || ''}`));

  // Balken mit Animation
  const bars = g.selectAll('.bar')
    .data(chartData.values)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => x(chartData.labels[i]))
    .attr('width', x.bandwidth())
    .attr('y', height)
    .attr('height', 0)
    .style('fill', d => colorScale(d))
    .style('cursor', 'pointer');

  // Balken Animation
  bars.transition()
    .duration(1000)
    .delay((d, i) => i * 100)
    .attr('y', d => y(d))
    .attr('height', d => height - y(d));

  // Tooltip Interaktionen
  bars.on('mouseover', (event, d, i) => {
    const index = bars.nodes().indexOf(event.target);
    this.tooltip
      .style('opacity', 1)
      .html(`
                    <strong>${chartData.labels[index]}</strong><br/>
                    Wert: ${DataUtils.formatNumber(d)}${chartData.unit || ''}<br/>
                    Anteil: ${((d / d3.sum(chartData.values)) * 100).toFixed(1)}%
                `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  })
    .on('mouseout', () => {
      this.tooltip.style('opacity', 0);
    });
}

// D3.js Liniendiagramm
createD3LineChart(chartData) {
  const container = d3.select('#chartContent');
  const containerRect = container.node().getBoundingClientRect();

  const margin = { top: 20, right: 30, bottom: 60, left: 50 };
  const width = containerRect.width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = container.append('svg')
    .attr('class', 'd3-chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Skalen
  const x = d3.scaleBand()
    .domain(chartData.labels)
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(d3.extent(chartData.values))
    .range([height, 0]);

  // Linie definieren
  const line = d3.line()
    .x((d, i) => x(chartData.labels[i]) + x.bandwidth() / 2)
    .y(d => y(d))
    .curve(d3.curveMonotoneX);

  // Achsen
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).tickFormat(d => d.toFixed(3)));

  // Linie zeichnen mit Animation
  const path = g.append('path')
    .datum(chartData.values)
    .attr('class', 'line')
    .attr('stroke', chartData.color)
    .attr('d', line);

  const totalLength = path.node().getTotalLength();

  path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(2000)
    .attr('stroke-dashoffset', 0);

  // Punkte hinzufügen
  const dots = g.selectAll('.dot')
    .data(chartData.values)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', (d, i) => x(chartData.labels[i]) + x.bandwidth() / 2)
    .attr('cy', d => y(d))
    .attr('r', 0)
    .style('fill', chartData.color);

  dots.transition()
    .duration(500)
    .delay((d, i) => i * 100 + 1000)
    .attr('r', 4);

  // Tooltip für Punkte
  dots.on('mouseover', (event, d, i) => {
    const index = dots.nodes().indexOf(event.target);
    this.tooltip
      .style('opacity', 1)
      .html(`
                    <strong>${chartData.labels[index]}</strong><br/>
                    Gini-Koeffizient: ${d.toFixed(3)}
                `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  })
    .on('mouseout', () => {
      this.tooltip.style('opacity', 0);
    });
}

// Animierte Liniendiagramme
createAnimatedLineChart(chartData) {
  const container = d3.select('#chartContent');
  const containerRect = container.node().getBoundingClientRect();

  // Controls hinzufügen
  const controlsDiv = container.append('div')
    .attr('class', 'animation-controls');

  controlsDiv.append('button')
    .attr('class', 'animation-btn')
    .text('▶️ Animation starten')
    .on('click', () => this.startAnimation(chartData));

  controlsDiv.append('button')
    .attr('class', 'animation-btn')
    .text('⏸️ Pause')
    .on('click', () => this.pauseAnimation());

  controlsDiv.append('button')
    .attr('class', 'animation-btn')
    .text('🔄 Reset')
    .on('click', () => this.resetAnimation(chartData));

  const margin = { top: 20, right: 80, bottom: 60, left: 50 };
  const width = containerRect.width - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = container.append('svg')
    .attr('class', 'd3-chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Skalen
  const x = d3.scaleLinear()
    .domain(d3.extent(chartData.data.years))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData.data.series, d => d3.max(d.values))])
    .range([height, 0]);

  // Achsen
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')));

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y));

  // Linien für jede Serie
  const line = d3.line()
    .x((d, i) => x(chartData.data.years[i]))
    .y(d => y(d))
    .curve(d3.curveMonotoneX);

  chartData.data.series.forEach(series => {
    g.append('path')
      .datum(series.values.slice(0, 1))
      .attr('class', `line-${series.name.replace(/\s+/g, '-')}`)
      .attr('stroke', series.color)
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('d', line);
  });

  // Legende
  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width + 10}, 20)`);

  chartData.data.series.forEach((series, i) => {
    const legendRow = legend.append('g')
      .attr('transform', `translate(0, ${i * 20})`);

    legendRow.append('line')
      .attr('x2', 15)
      .attr('stroke', series.color)
      .attr('stroke-width', 3);

    legendRow.append('text')
      .attr('x', 20)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(series.name);
  });
}

// Bar Chart Race
createBarChartRace(chartData) {
  const container = d3.select('#chartContent');

  // Controls
  const controlsDiv = container.append('div')
    .attr('class', 'animation-controls');

  controlsDiv.append('button')
    .attr('class', 'animation-btn')
    .text('🏁 Race starten')
    .on('click', () => this.startRace(chartData));

  controlsDiv.append('button')
    .attr('class', 'animation-btn')
    .text('⏸️ Pause')
    .on('click', () => this.pauseRace());

  const raceContainer = container.append('div')
    .attr('class', 'race-chart')
    .style('height', '400px')
    .style('position', 'relative');

  // Jahr-Anzeige
  const yearDisplay = raceContainer.append('div')
    .attr('class', 'race-year')
    .text(chartData.data.years[0]);

  // Initial Setup
  this.setupRace(raceContainer, chartData);
}

// Animation Controls
startAnimation(chartData) {
  let currentStep = 1;
  const maxSteps = chartData.data.years.length;

  this.animationTimer = setInterval(() => {
    this.updateAnimatedChart(chartData, currentStep);
    currentStep++;

    if (currentStep > maxSteps) {
      clearInterval(this.animationTimer);
    }
  }, 800);
}

pauseAnimation() {
  if (this.animationTimer) {
    clearInterval(this.animationTimer);
  }
}

resetAnimation(chartData) {
  this.pauseAnimation();
  this.createAnimatedLineChart(chartData);
}

updateAnimatedChart(chartData, step) {
  const svg = d3.select('#chartContent svg g');

  chartData.data.series.forEach(series => {
    const path = svg.select(`.line-${series.name.replace(/\s+/g, '-')}`);
    const data = series.values.slice(0, step);

    const line = d3.line()
      .x((d, i) => {
        const x = d3.scaleLinear()
          .domain(d3.extent(chartData.data.years))
          .range([0, svg.node().getBBox().width]);
        return x(chartData.data.years[i]);
      })
      .y(d => {
        const y = d3.scaleLinear()
          .domain([0, d3.max(chartData.data.series, d => d3.max(d.values))])
          .range([svg.node().getBBox().height, 0]);
        return y(d);
      })
      .curve(d3.curveMonotoneX);

    path.datum(data)
      .transition// Hauptanwendung für das Ungleichheits-Dashboard
    class InequalityDashboard {
      constructor() {
        this.currentChart = 'income';
        this.data = inequalityData;
        this.isLoading = false;
        this.init();
      }

      // Initialisierung der Anwendung
      async init() {
        console.log('🚀 Starte Dashboard...');

        // Event Listeners registrieren
        this.setupEventListeners();

        // Versuche echte Daten zu laden
        await this.loadRealData();

        // Erste Chart anzeigen
        this.showChart('income');

        // Navigation aktivieren
        this.setupNavigation();

        console.log('✅ Dashboard bereit!');
      }

      // Event Listeners einrichten
      setupEventListeners() {
        // Button Event Listeners
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(button => {
          button.addEventListener('click', (e) => {
            const chartType = e.target.getAttribute('data-chart');
            this.showChart(chartType);
          });
        });

        // Navigation Links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const chartType = e.target.getAttribute('data-chart');
            if (chartType) {
              this.showChart(chartType);
            }
          });
        });

        // Responsive Menu (für mobile Geräte)
        window.addEventListener('resize', () => {
          this.handleResize();
        });
      }

      // Navigation Setup
      setupNavigation() {
        const updateNavigation = (activeChart) => {
          // Update Control Buttons
          document.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-chart') === activeChart);
          });

          // Update Nav Links
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-chart') === activeChart);
          });
        };

        updateNavigation(this.currentChart);
      }

      // Echte Daten laden
      async loadRealData() {
        this.showLoading(true);

        try {
          console.log('📡 Lade Daten von APIs...');
          const result = await DataAPI.loadAllData();

          if (result.success) {
            this.data = result.data;
            console.log('✅ Aktuelle Daten geladen');
          } else {
            console.warn('⚠️ Verwende lokale Beispieldaten');
            this.data = inequalityData;
          }
        } catch (error) {
          console.error('❌ Fehler beim Laden der Daten:', error);
          this.data = inequalityData;
        } finally {
          this.showLoading(false);
        }
      }

      // Loading-Zustand anzeigen
      showLoading(isLoading) {
        this.isLoading = isLoading;
        const chartContent = document.getElementById('chartContent');

        if (isLoading) {
          chartContent.innerHTML = '<div class="loading">Lade aktuelle Daten...</div>';
        }
      }

      // Hauptfunktion zum Anzeigen von Charts
      showChart(type) {
        if (this.isLoading) return;

        console.log(`📊 Zeige Chart: ${type}`);
        this.currentChart = type;

        const chartData = this.data[type];
        if (!chartData || !DataUtils.validateData(chartData)) {
          console.error('❌ Ungültige Daten für Chart:', type);
          this.showError('Daten für diese Ansicht sind nicht verfügbar');
          return;
        }

        // UI aktualisieren
        this.updateChartHeader(chartData);
        this.renderChart(chartData);
        this.updateStats(chartData);
        this.updateNavigation(type);

        // Smooth scroll wenn von Navigation geklickt
        document.querySelector('.chart-container').scrollIntoView({
          behavior: 'smooth'
        });
      }

      // Chart Header aktualisieren
      updateChartHeader(chartData) {
        document.getElementById('chartTitle').textContent = chartData.title;
        document.getElementById('dataYear').textContent = chartData.year || '2023';
        document.getElementById('dataSource').textContent = chartData.source || 'Diverse Quellen';
      }

      // Chart rendern
      renderChart(chartData) {
        const chartContent = document.getElementById('chartContent');

        try {
          if (chartData.type === 'line') {
            chartContent.innerHTML = this.createLineChart(chartData);
          } else {
            chartContent.innerHTML = this.createBarChart(chartData);
          }

          // Legende erstellen
          this.createLegend(chartData);

        } catch (error) {
          console.error('Fehler beim Rendern der Chart:', error);
          this.showError('Fehler beim Anzeigen der Daten');
        }
      }

      // Balkendiagramm erstellen
      createBarChart(chartData) {
        const maxValue = Math.max(...chartData.values);
        const bars = chartData.values.map((value, index) => {
          const height = (value / maxValue) * 280;
          const color = this.getBarColor(value, index, chartData);

          return `
                <div class="bar" style="height: ${height}px; background: ${color}; flex: 1;" 
                     data-value="${value}" data-label="${chartData.labels[index]}">
                    <div class="bar-value">
                        ${DataUtils.formatNumber(value)}${chartData.unit || ''}
                    </div>
                    <div class="bar-label">${chartData.labels[index]}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="bar-chart">
                ${bars}
            </div>
        `;
      }

      // Liniendiagramm erstellen
      createLineChart(chartData) {
        const maxValue = Math.max(...chartData.values);
        const minValue = Math.min(...chartData.values);
        const range = maxValue - minValue || 1;
        const width = 700;
        const height = 280;

        // Punkte berechnen
        const points = chartData.values.map((value, index) => {
          const x = (index / (chartData.values.length - 1)) * (width - 60) + 30;
          const y = height - ((value - minValue) / range) * (height - 60) - 30;
          return `${x},${y}`;
        }).join(' ');

        // Kreise für Datenpunkte
        const circles = chartData.values.map((value, index) => {
          const x = (index / (chartData.values.length - 1)) * (width - 60) + 30;
          const y = height - ((value - minValue) / range) * (height - 60) - 30;
          return `
                <circle cx="${x}" cy="${y}" r="5" fill="${chartData.color}" stroke="white" stroke-width="3">
                    <title>${chartData.labels[index]}: ${DataUtils.formatNumber(value, 3)}</title>
                </circle>
            `;
        }).join('');

        // Y-Achsen Labels
        const yLabels = [];
        for (let i = 0; i <= 5; i++) {
          const value = minValue + (range * i / 5);
          const y = height - (i / 5) * (height - 60) - 30;
          yLabels.push(`
                <text x="15" y="${y + 5}" text-anchor="end" font-size="12" fill="#666">
                    ${DataUtils.formatNumber(value, 3)}
                </text>
            `);
        }

        return `
            <div class="line-chart">
                <svg class="line-svg" viewBox="0 0 ${width} ${height}">
                    <!-- Y-Achse -->
                    <line x1="30" y1="30" x2="30" y2="${height - 30}" stroke="#ddd" stroke-width="2"/>
                    <!-- X-Achse -->
                    <line x1="30" y1="${height - 30}" x2="${width - 30}" y2="${height - 30}" stroke="#ddd" stroke-width="2"/>
                    
                    <!-- Y-Labels -->
                    ${yLabels.join('')}
                    
                    <!-- Linie -->
                    <polyline points="${points}" fill="none" stroke="${chartData.color}" stroke-width="3"/>
                    
                    <!-- Datenpunkte -->
                    ${circles}
                </svg>
            </div>
        `;
      }

      // Balkenfarbe bestimmen
      getBarColor(value, index, chartData) {
        // Gradient basierend auf Wert
        if (chartData.type === 'bar') {
          const intensity = value / Math.max(...chartData.values);
          const baseColor = chartData.color || '#667eea';

          // CSS Gradient erstellen
          return `linear-gradient(to top, ${baseColor}, ${baseColor}CC)`;
        }
        return chartData.color || '#667eea';
      }

      // Legende erstellen
      createLegend(chartData) {
        const legendContainer = document.getElementById('chartLegend');

        let legendHTML = '';

        if (chartData.description) {
          legendHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${chartData.color}"></div>
                    <span>${chartData.description}</span>
                </div>
            `;
        }

        legendContainer.innerHTML = legendHTML;
      }

      // Statistiken aktualisieren
      updateStats(chartData) {
        const statsContainer = document.getElementById('statsContainer');

        if (!chartData.stats) {
          statsContainer.innerHTML = '<div class="info">Keine zusätzlichen Statistiken verfügbar</div>';
          return;
        }

        const statsHTML = chartData.stats.map(stat => {
          const changeClass = stat.changeType === 'positive' ? 'positive' :
            stat.changeType === 'negative' ? 'negative' : 'neutral';

          return `
                <div class="stat-card">
                    <div class="stat-number">${stat.number}</div>
                    <div class="stat-label">${stat.label}</div>
                    ${stat.change ? `<div class="stat-change ${changeClass}">${stat.change}</div>` : ''}
                </div>
            `;
        }).join('');

        statsContainer.innerHTML = statsHTML;
      }

      // Navigation aktualisieren
      updateNavigation(activeChart) {
        // Control Buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-chart') === activeChart);
        });

        // Nav Links
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-chart') === activeChart);
        });
      }

      // Fehler anzeigen
      showError(message) {
        const chartContent = document.getElementById('chartContent');
        chartContent.innerHTML = `
            <div class="error" style="text-align: center; padding: 2rem; color: #e74c3c;">
                <h3>⚠️ Fehler</h3>
                <p>${message}</p>
            </div>
        `;
      }

      // Responsive Handling
      handleResize() {
        // Chart neu rendern bei Größenänderung
        if (this.currentChart && !this.isLoading) {
          setTimeout(() => {
            this.showChart(this.currentChart);
          }, 100);
        }
      }

      // Öffentliche API für externe Nutzung
      getCurrentData() {
        return this.data[this.currentChart];
      }

      exportData(format = 'json') {
        const currentData = this.getCurrentData();

        if (format === 'csv') {
          return this.convertToCSV(currentData);
        }

        return JSON.stringify(currentData, null, 2);
      }

      convertToCSV(data) {
        const headers = ['Label', 'Wert', 'Einheit'];
        const rows = data.labels.map((label, index) =>
          [label, data.values[index], data.unit || ''].join(',')
        );

        return [headers.join(','), ...rows].join('\n');
      }
    }

    // Dashboard initialisieren wenn DOM geladen
    document.addEventListener('DOMContentLoaded', function () {
      console.log('🏁 DOM geladen, starte Dashboard...');

      // Globale Dashboard-Instanz erstellen
      window.dashboard = new InequalityDashboard();

      // Entwickler-Tools (nur in Development)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Entwicklermodus aktiv');
        console.log('Verfügbare Befehle:');
        console.log('- dashboard.getCurrentData() - Aktuelle Chart-Daten');
        console.log('- dashboard.exportData() - Daten exportieren');
        console.log('- dashboard.showChart("gini") - Chart wechseln');
      }
    });

    // Service Worker für Offline-Funktionalität (optional)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('✅ Service Worker registriert'))
        //     .catch(err => console.log('❌ Service Worker Fehler:', err));
      });
    }