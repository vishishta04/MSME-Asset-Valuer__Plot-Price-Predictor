let sizeChart = null;
let priceChart = null;

document.getElementById('predictionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const loading = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    
    loading.classList.remove('hidden');
    resultsContainer.classList.add('hidden');

    try {
        const formData = {
            location: document.getElementById('location').value,
            bath: parseInt(document.getElementById('bath').value),
            bhk: parseInt(document.getElementById('bhk').value),
            sqft: parseFloat(document.getElementById('sqft').value)
        };

        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            updateResults(data, formData);
            resultsContainer.classList.remove('hidden');
        }
    } catch (error) {
        alert('Error: Failed to get prediction');
    } finally {
        loading.classList.add('hidden');
    }
});

function updateResults(data, formData) {
    // Update prediction value
    document.querySelector('.prediction-value').textContent = 
        `₹${data.prediction.toFixed(2)} Lakhs`;

    // Update comparison stats
    const comparisonStats = document.getElementById('comparison-stats');
    comparisonStats.innerHTML = `
        <div class="comparison-stat">
            <span>vs. Location Average:</span>
            <span class="${data.comparison.vs_avg_price > 0 ? 'positive' : 'negative'}">
                ${data.comparison.vs_avg_price.toFixed(2)}%
            </span>
        </div>
        <div class="comparison-stat">
            <span>vs. Price per sq.ft:</span>
            <span class="${data.comparison.vs_price_per_sqft > 0 ? 'positive' : 'negative'}">
                ₹${data.comparison.vs_price_per_sqft.toFixed(2)}
            </span>
        </div>
    `;

    // Update location insights
    const locationStats = document.getElementById('location-stats');
    locationStats.innerHTML = `
        <div class="stat-card">
            <h3>Average Price</h3>
            <p>₹${data.location_stats.avg_price.toFixed(2)} Lakhs</p>
        </div>
        <div class="stat-card">
            <h3>Median Price</h3>
            <p>₹${data.location_stats.median_price.toFixed(2)} Lakhs</p>
        </div>
        <div class="stat-card">
            <h3>Average Area</h3>
            <p>${data.location_stats.avg_sqft.toFixed(0)} sq.ft</p>
        </div>
        <div class="stat-card">
            <h3>Price per sq.ft</h3>
            <p>₹${data.location_stats.price_per_sqft.toFixed(2)}</p>
        </div>
        <div class="stat-card">
            <h3>Properties Listed</h3>
            <p>${data.location_stats.count}</p>
        </div>
    `;

    // Render charts
    renderCharts(data.location_stats);
}

function renderCharts(locationStats) {
    const sizeChartCanvas = document.getElementById('sizeChart').getContext('2d');
    const priceChartCanvas = document.getElementById('priceChart').getContext('2d');

    // Destroy existing charts if they exist
    if (sizeChart) sizeChart.destroy();
    if (priceChart) priceChart.destroy();

    // Render BHK distribution chart
    sizeChart = new Chart(sizeChartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(locationStats.bhk_distribution),
            datasets: [{
                label: 'BHK Distribution',
                data: Object.values(locationStats.bhk_distribution),
                backgroundColor: '#1a73e8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Properties'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'BHK'
                    }
                }
            }
        }
    });

    // Render price range chart
    priceChart = new Chart(priceChartCanvas, {
        type: 'line',
        data: {
            labels: ['Min Price', 'Avg Price', 'Max Price'],
            datasets: [{
                label: 'Price Range',
                data: [
                    locationStats.price_range.min,
                    locationStats.avg_price,
                    locationStats.price_range.max
                ],
                borderColor: '#1a73e8',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price (₹ Lakhs)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Price Range'
                    }
                }
            }
        }
    });
}

// Fetch location stats when location is selected
document.getElementById('location').addEventListener('change', async function() {
    const location = this.value;
    if (!location) return;

    try {
        const response = await fetch(`/location-stats/${location}`);
        const data = await response.json();
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            renderCharts(data);
        }
    } catch (error) {
        alert('Error: Failed to fetch location stats');
    }
});