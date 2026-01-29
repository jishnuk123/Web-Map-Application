mapboxgl.accessToken =
    'pk.eyJ1IjoiamthbmRhIiwiYSI6ImNtaGN5c3JwbDIyNDUybHBxM2VweHBrNzYifQ.Akume5yUr5MZyYxPQq9EjA';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-96, 37.8],   
    zoom: 4,
    minZoom: 3,
    projection: 'albers'  
});

// breaks and colors for rates (cases per 1,000)
const grades = [15, 30, 45, 60];
const colors = [
    '#FED976',
    '#FD8D3C',
    '#FC4E2A',
    '#E31A1C',
    '#800026'
];

map.on('load', () => {

    // add COVID rates source
    map.addSource('covidRates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

    // add choropleth layer
    map.addLayer({
        id: 'covid-rates-layer',
        type: 'fill',
        source: 'covidRates',
        paint: {
            'fill-color': [
                'step',
                ['get', 'rates'],
                colors[0],
                grades[0], colors[1],
                grades[1], colors[2],
                grades[2], colors[3],
                grades[3], colors[4]
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': 'white'
        }
    });

    // popup on click
    map.on('click', 'covid-rates-layer', (e) => {
        const props = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `<strong>${props.county}, ${props.state}</strong><br>
                 COVID-19 rate: ${props.rates} per 1,000`
            )
            .addTo(map);
    });
});

// ---------- LEGEND ----------
const legend = document.getElementById('legend');

var labels = ['<strong>Cases per 1,000</strong>'];
for (var i = 0; i < grades.length; i++) {
    labels.push(
        '<p class="break">' +
        '<i class="dot" style="background:' + colors[i] + '"></i> ' +
        grades[i] +
        '</p>'
    );
}
labels.push(
    '<p class="break"><i class="dot" style="background:' + colors[4] +
    '"></i> 60+</p>'
);

const source =
    '<p style="text-align:right; font-size:10pt">' +
    'Source: NYT & ACS' +
    '</p>';

legend.innerHTML = labels.join('') + source;
