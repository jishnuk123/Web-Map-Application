mapboxgl.accessToken = 'pk.eyJ1IjoiamthbmRhIiwiYSI6ImNtaGN5c3JwbDIyNDUybHBxM2VweHBrNzYifQ.Akume5yUr5MZyYxPQq9EjA';

// create the map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 3.5,
    minZoom: 3,
    center: [-95, 37],
    projection: 'albers'
});

// define colors for case counts
const grades = [1000, 5000, 20000, 50000]; // thresholds for cases
const colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)', 'rgb(0,68,27)'];
const radii = [5, 10, 15, 20]; 

map.on('load', () => {
    // add the covid counts geojson
    map.addSource('covid-counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    // add layer
    map.addLayer({
        'id': 'covid-circles',
        'type': 'circle',
        'source': 'covid-counts',
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                    [grades[3], radii[3]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.7
        }
    });

    // add popup on click
    map.on('click', 'covid-circles', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(
                `<strong>${event.features[0].properties.county}, ${event.features[0].properties.state}</strong><br>
                 Cases: ${event.features[0].properties.cases}<br>
                 Deaths: ${event.features[0].properties.deaths}`
            )
            .addTo(map);
    });

    // create legend
    const legend = document.getElementById('legend');
    let labels = ['<strong>Cases</strong>'], vbreak, dot_radii;
    for (let i = 0; i < grades.length; i++) {
        vbreak = grades[i];
        dot_radii = 2 * radii[i];
        labels.push(
        '<p class="break"><span class="dot-container"><i class="dot" style="background:' + colors[i] + 
        '; width:' + dot_radii + 'px; height:' + dot_radii + 'px;"></i></span><span class="dot-label">' + 
        vbreak + '</span></p>'
);
    }
    const source = '<p style="text-align: right; font-size:10pt">Source: The New York Times</p>';
    legend.innerHTML = labels.join('') + source;
});
