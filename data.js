// Datenmodell für Ungleichheitsdaten Deutschland
// Basiert auf aktuellen Daten von Destatis, DIW Berlin und OECD

const inequalityData = {
    // Einkommensverteilung (Quelle: DIW SOEP 2022)
    income: {
        labels: [
            'Unterstes 10%', '2. Dezil', '3. Dezil', '4. Dezil', '5. Dezil',
            '6. Dezil', '7. Dezil', '8. Dezil', '9. Dezil', 'Oberstes 10%'
        ],
        values: [2.4, 3.9, 5.2, 6.5, 7.9, 9.1, 10.7, 12.4, 15.2, 26.7],
        title: 'Einkommensverteilung in Deutschland',
        subtitle: 'Anteil am Gesamteinkommen nach Dezilen (2022)',
        type: 'bar',
        color: '#667eea',
        unit: '%',
        source: 'DIW SOEP 2022',
        year: '2022',
        description: 'Verteilung des verfügbaren Haushaltseinkommens auf die Bevölkerung',
        stats: [
            { 
                number: '26.7%', 
                label: 'Anteil der oberen 10%',
                change: '+0.3%',
                changeType: 'positive'
            },
            { 
                number: '2.4%', 
                label: 'Anteil der unteren 10%',
                change: '-0.1%',
                changeType: 'negative'
            },
            { 
                number: '11.1x', 
                label: 'Verhältnis Top zu Bottom',
                change: '+0.2',
                changeType: 'positive'
            }
        ]
    },

    // Gini-Koeffizient (Quelle: Destatis, OECD)
    gini: {
        labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2023'],
        values: [0.287, 0.291, 0.306, 0.295, 0.314, 0.308, 0.318, 0.321],
        title: 'Gini-Koeffizient Deutschland',
        subtitle: 'Maß für Einkommensungleichheit (0 = völlige Gleichheit, 1 = völlige Ungleichheit)',
        type: 'line',
        color: '#e74c3c',
        unit: '',
        source: 'Destatis, OECD',
        year: '2023',
        description: 'Entwicklung der Einkommensungleichheit über Zeit',
        stats: [
            { 
                number: '0.321', 
                label: 'Aktueller Gini-Wert',
                change: '+0.034',
                changeType: 'positive'
            },
            { 
                number: '12.', 
                label: 'Rang in EU (von 27)',
                change: 'unverändert',
                changeType: 'neutral'
            },
            { 
                number: '🔺', 
                label: 'Trend: Zunehmend',
                change: 'seit 2010',
                changeType: 'positive'
            }
        ]
    },

    // Vermögensverteilung (Quelle: DIW, Bundesbank)
    wealth: {
        labels: ['Unterstes 50%', 'Mittlere 40%', 'Oberstes 10%', 'Oberstes 1%'],
        values: [2.8, 34.5, 62.7, 35.2],
        title: 'Vermögensverteilung in Deutschland',
        subtitle: 'Anteil am Gesamtnettovermögen der Haushalte (2022)',
        type: 'bar',
        color: '#f39c12',
        unit: '%',
        source: 'DIW, Deutsche Bundesbank',
        year: '2022',
        description: 'Konzentration des Vermögens in Deutschland',
        stats: [
            { 
                number: '62.7%', 
                label: 'Vermögen der oberen 10%',
                change: '+1.2%',
                changeType: 'positive'
            },
            { 
                number: '2.8%', 
                label: 'Vermögen der unteren 50%',
                change: '+0.3%',
                changeType: 'positive'
            },
            { 
                number: '22.4x', 
                label: 'Konzentrationsfaktor',
                change: '+0.8',
                changeType: 'positive'
            }
        ]
    },

    // Armutsrisiko (Quelle: Destatis EU-SILC)
    poverty: {
        labels: [
            'Alle', 'Kinder (0-17)', 'Erwachsene (18-64)', 
            'Rentner (65+)', 'Alleinerziehende', 'Migranten'
        ],
        values: [16.9, 21.3, 16.1, 12.2, 43.6, 28.4],
        title: 'Armutsgefährdungsquoten in Deutschland',
        subtitle: 'Anteil der Bevölkerung unter der Armutsgefährdungsschwelle (2022)',
        type: 'bar',
        color: '#e74c3c',
        unit: '%',
        source: 'Destatis EU-SILC 2022',
        year: '2022',
        description: 'Armutsgefährdung nach Bevölkerungsgruppen (60% des Medianeinkommens)',
        stats: [
            { 
                number: '16.9%', 
                label: 'Gesamtbevölkerung',
                change: '+0.4%',
                changeType: 'positive'
            },
            { 
                number: '43.6%', 
                label: 'Alleinerziehende',
                change: '+1.2%',
                changeType: 'positive'
            },
            { 
                number: '21.3%', 
                label: 'Kinderarmut',
                change: '+0.8%',
                changeType: 'positive'
            }
        ]
    },

    // Bildungschancen (Quelle: Destatis, OECD Education at a Glance)
    education: {
        labels: [
            'Niedrige Bildung', 'Mittlere Bildung', 'Hohe Bildung (Uni)', 
            'Hohe Bildung (FH)', 'Promotion'
        ],
        values: [27.2, 58.4, 18.9, 14.3, 2.8],
        title: 'Bildungsniveau der Bevölkerung',
        subtitle: 'Höchster Bildungsabschluss der 25-64-Jährigen (2022)',
        type: 'bar',
        color: '#27ae60',
        unit: '%',
        source: 'Destatis, OECD',
        year: '2022',
        description: 'Verteilung der Bildungsabschlüsse in der erwerbsfähigen Bevölkerung',
        stats: [
            { 
                number: '33.2%', 
                label: 'Hochschulabschluss gesamt',
                change: '+2.1%',
                changeType: 'negative'
            },
            { 
                number: '27.2%', 
                label: 'Ohne Berufsausbildung',
                change: '-1.5%',
                changeType: 'negative'
            },
            { 
                number: '🎯', 
                label: 'OECD-Durchschnitt erreicht',
                change: '2021 erreicht',
                changeType: 'neutral'
            }
        ]
    }
};

// API-Funktionen für echte Daten (Beispiel-Implementierung)
const DataAPI = {
    // Basis-URLs für verschiedene Datenquellen
    sources: {
        destatis: 'https://www-genesis.destatis.de/genesisWS/rest/2020/data/',
        oecd: 'https://stats.oecd.org/restsdmx/sdmx.ashx/GetData/',
        eurostat: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/'
    },

    // Funktion zum Laden von Destatis-Daten (Beispiel)
    async loadDestatsData(tableId) {
        try {
            // Beispiel für echte API-Anfrage an Destatis
            // const response = await fetch(`${this.sources.destatis}${tableId}`);
            // const data = await response.json();
            
            // Für Demo: Simulierte API-Antwort
            console.log(`Loading data from Destatis table: ${tableId}`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        data: inequalityData.income, // Fallback auf lokale Daten
                        timestamp: new Date().toISOString()
                    });
                }, 1000); // Simuliere Netzwerk-Delay
            });
        } catch (error) {
            console.error('Fehler beim Laden der Destatis-Daten:', error);
            return {
                success: false,
                error: error.message,
                fallbackData: inequalityData.income
            };
        }
    },

    // Funktion zum Laden von OECD-Daten
    async loadOECDData(indicator) {
        try {
            console.log(`Loading OECD data for indicator: ${indicator}`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        data: inequalityData.gini,
                        timestamp: new Date().toISOString()
                    });
                }, 800);
            });
        } catch (error) {
            console.error('Fehler beim Laden der OECD-Daten:', error);
            return {
                success: false,
                error: error.message,
                fallbackData: inequalityData.gini
            };
        }
    },

    // Hauptfunktion zum Laden aller Daten
    async loadAllData() {
        console.log('🔄 Lade aktuelle Daten...');
        
        try {
            const [incomeData, giniData, wealthData] = await Promise.all([
                this.loadDestatsData('12211-0013'), // Beispiel Tabellen-ID
                this.loadOECDData('IDD'), // Income Distribution Database
                this.loadDestatsData('61111-0001') // Vermögensstatistik
            ]);

            return {
                success: true,
                data: {
                    income: incomeData.data,
                    gini: giniData.data,
                    wealth: wealthData.data,
                    poverty: inequalityData.poverty, // Lokale Daten
                    education: inequalityData.education // Lokale Daten
                },
                lastUpdate: new Date().toISOString()
            };
        } catch (error) {
            console.warn('API-Daten nicht verfügbar, verwende lokale Daten');
            return {
                success: false,
                data: inequalityData,
                error: error.message
            };
        }
    }
};

// Hilfsfunktionen für Datenverarbeitung
const DataUtils = {
    // Formatierung von Zahlen
    formatNumber(value, decimals = 1) {
        if (typeof value !== 'number') return value;
        return value.toLocaleString('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    // Berechnung von Änderungen
    calculateChange(oldValue, newValue) {
        if (!oldValue || !newValue) return null;
        const change = ((newValue - oldValue) / oldValue) * 100;
        return {
            absolute: newValue - oldValue,
            relative: change,
            formatted: (change >= 0 ? '+' : '') + this.formatNumber(change, 1) + '%'
        };
    },

    // Farbkodierung für Werte
    getColorForValue(value, type) {
        const colors = {
            income: {
                low: '#e74c3c',    // Rot für niedrige Einkommen
                medium: '#f39c12', // Orange für mittlere Einkommen
                high: '#27ae60'    // Grün für hohe Einkommen
            },
            gini: {
                low: '#27ae60',    // Grün für niedrige Ungleichheit
                medium: '#f39c12', // Orange für mittlere Ungleichheit
                high: '#e74c3c'    // Rot für hohe Ungleichheit
            }
        };

        if (!colors[type]) return '#667eea';
        
        if (value < 0.3 || value < 10) return colors[type].low;
        if (value < 0.35 || value < 20) return colors[type].medium;
        return colors[type].high;
    },

    // Validierung der Daten
    validateData(data) {
        const required = ['labels', 'values', 'title', 'type'];
        return required.every(key => data.hasOwnProperty(key));
    }
};

// Export für Module (falls verwendet)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { inequalityData, DataAPI, DataUtils };
}