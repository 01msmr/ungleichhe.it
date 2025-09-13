class InequalityDashboard {
  constructor() {
    this.currentChart = 'income';
    this.data = inequalityData;
    this.init();
  }

  init() {
    this.detectTheme();
    this.setupEventListeners();
    this.showChart('income');
  }

  detectTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showChart(e.currentTarget.dataset.chart);
      });
    });

    // Verwende ResizeObserver für eine präzisere und performantere Reaktion auf Größenänderungen
    const chartWrapper = document.getElementById('chart-svg-container');
    const resizeObserver = new ResizeObserver(() => this.showChart(this.currentChart));
    resizeObserver.observe(chartWrapper);
  }

  showChart(type) {
    if (!type || !this.data[type]) return;
    this.currentChart = type;
    const chartData = this.data[type];

    this.updateHeader(chartData);
    this.updateStats(chartData);
    this.renderChart(chartData);
    this.updateNavigation(type);
  }

  updateHeader(chartData) {
    document.getElementById('chartTitle').textContent = chartData.title || '';
    document.getElementById('dataYear').textContent = chartData.year || '';
    document.getElementById('dataSource').textContent = chartData.source || '';
  }

  updateStats(chartData) {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer || !chartData.stats) {
      statsContainer.innerHTML = '';
      return;
    }
    statsContainer.innerHTML = chartData.stats.map(stat => `
      <div class="stat-card">
        <div class="stat-number">${stat.number}</div>
        <div class="stat-label">${stat.label}</div>
        <div class="stat-change ${stat.changeType}">${stat.change}</div>
      </div>
    `).join('');
  }

  renderChart(chartData) {
    const svgContainer = d3.select('#chart-svg-container');
    svgContainer.selectAll('*').remove();

    const square = document.querySelector('.dashboard-square-background');
    if (!square || square.clientHeight === 0) return;
    const squareBounds = square.getBoundingClientRect();

    // Ränder für die Skalen, die außerhalb des Quadrats liegen sollen
    const margin = { top: 10, bottom: 85, left: 70, right: 10 };

    const innerWidth = squareBounds.width;
    const innerHeight = squareBounds.height;

    const totalWidth = innerWidth + margin.left + margin.right;
    const totalHeight = innerHeight + margin.top + margin.bottom;

    const svg = svgContainer.append('svg').attr('class', 'd3-chart')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .style('width', `${totalWidth}px`)
      .style('height', `${totalHeight}px`)
      .style('transform', `translate(${-margin.left}px, ${-margin.top}px)`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (chartData.type === 'bar') this.drawBarChart(g, chartData, innerWidth, innerHeight);
    else if (chartData.type === 'line') this.drawLineChart(g, chartData, innerWidth, innerHeight);
  }

  drawBarChart(g, chartData, width, height) {
    const x = d3.scaleBand().domain(chartData.labels).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(chartData.values) * 1.1]).nice().range([height, 0]);

    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
      .selectAll('text').attr('transform', 'translate(-10,5)rotate(-45)').style('text-anchor', 'end');
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5).tickFormat(d => d + (chartData.unit || '')));

    g.selectAll('.bar').data(chartData.values).enter().append('rect').attr('class', 'bar')
      .attr('x', (d, i) => x(chartData.labels[i])).attr('width', x.bandwidth())
      .attr('y', d => y(d)).attr('height', d => height - y(d));
  }

  drawLineChart(g, chartData, width, height) {
    const x = d3.scalePoint().domain(chartData.labels).range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(chartData.values, d => d * 1)).nice().range([height, 0]);

    g.append("g").attr('class', 'axis').attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    g.append("g").attr('class', 'axis').call(d3.axisLeft(y).ticks(5));

    const line = d3.line().x((d, i) => x(chartData.labels[i])).y(d => y(d));

    g.append("path").datum(chartData.values).attr("class", "line").attr("d", line);
    g.selectAll(".dot").data(chartData.values).enter().append("circle").attr("class", "dot")
      .attr("cx", (d, i) => x(chartData.labels[i])).attr("cy", d => y(d)).attr("r", 5);
  }

  updateNavigation(activeChart) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.chart === activeChart);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => { new InequalityDashboard(); });