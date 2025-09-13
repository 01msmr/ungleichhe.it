const inequalityData = {
  income: {
    labels: ['Unterstes 10%', '2. Dezil', '3. Dezil', '4. Dezil', '5. Dezil', '6. Dezil', '7. Dezil', '8. Dezil', '9. Dezil', 'Oberstes 10%'],
    values: [2.4, 3.9, 5.2, 6.5, 7.9, 9.1, 10.7, 12.4, 15.2, 26.7],
    title: 'Einkommensverteilung',
    type: 'bar', unit: '%', source: 'DIW SOEP 2022', year: '2022',
    stats: [
      { number: '26.7%', label: 'Anteil der oberen 10%', change: '+0.3%', changeType: 'positive' },
      { number: '2.4%', label: 'Anteil der unteren 10%', change: '-0.1%', changeType: 'negative' },
      { number: '11.1x', label: 'Verhältnis Top zu Bottom', change: '+0.2', changeType: 'positive' }
    ]
  },
  gini: {
    labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2023'],
    values: [0.287, 0.291, 0.306, 0.295, 0.314, 0.308, 0.318, 0.321],
    title: 'Gini-Koeffizient',
    type: 'line', unit: '', source: 'Destatis, OECD', year: '2023',
    stats: [
      { number: '0.321', label: 'Aktueller Gini-Wert', change: 'Trend: Zunehmend', changeType: 'positive' },
      { number: 'Rang 12', label: 'Position in der EU (von 27)', change: 'unverändert', changeType: 'neutral' },
      { number: '+11.8%', label: 'Anstieg seit 2010', change: 'stärker als im EU-Schnitt', changeType: 'positive' }
    ]
  },
  wealth: {
    labels: ['Unterste 50%', 'Mittlere 40%', 'Oberste 10%', 'Oberstes 1%'],
    values: [2.8, 34.5, 62.7, 35.2],
    title: 'Vermögensverteilung',
    type: 'bar', unit: '%', source: 'DIW, Bundesbank', year: '2022',
    stats: [
      { number: '62.7%', label: 'Vermögen der oberen 10%', change: '+1.2%', changeType: 'positive' },
      { number: '2.8%', label: 'Vermögen der unteren 50%', change: '+0.3%', changeType: 'positive' },
      { number: '22.4x', label: 'Konzentrationsfaktor', change: 'Top 10% vs Bottom 50%', changeType: 'positive' }
    ]
  },
  poverty: {
    labels: ['Alle', 'Kinder', 'Erwachsene', 'Rentner', 'Alleinerziehende', 'Migranten'],
    values: [16.9, 21.3, 16.1, 12.2, 43.6, 28.4],
    title: 'Armutsgefährdung',
    type: 'bar', unit: '%', source: 'Destatis EU-SILC', year: '2022',
    stats: [
      { number: '43.6%', label: 'Alleinerziehende', change: 'Höchstes Risiko', changeType: 'positive' },
      { number: '21.3%', label: 'Kinder & Jugendliche', change: 'deutlich über Schnitt', changeType: 'positive' },
      { number: '16.9%', label: 'Gesamtbevölkerung', change: '+0.4%', changeType: 'positive' }
    ]
  },
};