### 1 create map
```js
var map = L.map('map', {
    center: [16.949777781722553, 100.54530779528845],
    zoom: 10
});
```

### 2 add tile layer: OSM
```js
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
    attribution: 'OSM'
}).addTo(map);
```

### 3 add tile layer:google maps
```js
var google_road = L.tileLayer("https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    lyr: "grod",
    isBase: "yes",
});

var googleHybridge = L.tileLayer("https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    lyr: "ghyb",
    isBase: "yes",
});
```

###  4 add wms layer
```js
var province = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:th_pro",
    format: "image/png",
    transparent: true,
    cql_filter: "pro_code=65",
    attribution: "map by mapedia.co.th",
});

var amphoe = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:th_amp",
    format: "image/png",
    transparent: true,
    cql_filter: "pro_code=65",
    attribution: "map by mapedia.co.th",
});

var tambon = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:th_tam",
    format: "image/png",
    transparent: true,
    cql_filter: "pro_code=65",
    attribution: "map by mapedia.co.th",
});
```

### 5 add control
```js
var baseLayers = {
    "OSM": osm,
    "Google Road": google_road,
    "Google Hybridge": googleHybridge
};

var overlays = {
    "Province": province,
    "Amphoe": amphoe,
    "Tambon": tambon
};

L.control.layers(baseLayers, overlays).addTo(map);
```

### 6 add getfeatureinfo
```js
map.on('click', function (evt) {
    var url = getFeatureInfoFn(evt.latlng)
    fetch(url)
        .then(response => response.text())
        .then(data => {
            let dat = JSON.parse(data);
            addDataToCard(dat);
            showEchart(dat);
            if (dat.features.length > 0) {
                console.log(dat.features);
                L.popup()
                    .setLatLng(evt.latlng)
                    .setContent(
                        dat.features.map(i => "น้ำฝน: " + i.id + ": " + i.properties.rain + " mm. <br>").toString()
                    )
                    .openOn(map);
            }
        });
});

function getFeatureInfoFn(k) {
    let lyrArr = ['raintam2555', 'raintam2556', 'raintam2557'];
    let latlng = { lat: k.lat, lng: k.lng }
    let lyrs = lyrArr.toString();
    let pnt = map.latLngToContainerPoint(latlng, map.getZoom());
    let size = map.getSize();
    let bbox = map.getBounds().toBBoxString();

    return "https://ogc.mapedia.co.th/geoserver/webgis/wms?SERVICE=WMS" +
        "&VERSION=1.1.1&REQUEST=GetFeatureInfo" +
        "&QUERY_LAYERS=" + lyrs +
        "&LAYERS=" + lyrs +
        "&Feature_count=300" +
        "&INFO_FORMAT=application/json" +
        "&X=" + Math.round(pnt.x) +
        "&Y=" + Math.round(pnt.y) +
        "&SRS=EPSG:4326" +
        "&WIDTH=" + size.x +
        "&HEIGHT=" + size.y +
        "&BBOX=" + bbox;
}
```

### 7 add data to card div
```js
function addDataToCard(dat) {
    document.getElementById('feature-info').innerHTML = ' <ul id="list"></ul>';
    dat.features.map(i => {
        document.getElementById('list').innerHTML += '<li>ต.' + i.properties.TB_TN +
            ' ปี ' + (i.id).replace('raintam', '').split(".")[0] +
            ' ปริมาณ ' + i.properties.rain + 'มม.</li>'
    })
}
```

### 8 add legend
```js
var legend_province = "https://ogc.mapedia.co.th/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:th_pro";
var legend_amphoe = "https://ogc.mapedia.co.th/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:th_amp";
var legend_tambon = "https://ogc.mapedia.co.th/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=webgis:th_tam";

var legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    // div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML += '<img src="' + legend_province + '"><span>Province</span><br>';
    div.innerHTML += '<img src="' + legend_amphoe + '"><span></span><br>';
    div.innerHTML += '<img src="' + legend_tambon + '"><span>Tambon</span><br>';
    return div;
};

legend.addTo(map);
```

### 9 add EChart
```js
function showEchart(dat) {
    let x2555 = dat.features.filter(i => i.id.includes('2555')).map(i => i.properties.rain);
    let x2556 = dat.features.filter(i => i.id.includes('2556')).map(i => i.properties.rain);
    let x2557 = dat.features.filter(i => i.id.includes('2557')).map(i => i.properties.rain);
    let y = dat.features.filter(i => i.id.includes('2555')).map(i => i.properties.TB_TN);
    var chartDom = document.getElementById('chart');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        title: {
            text: 'World Population'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: y
        },
        series: [
            {
                name: '2555',
                type: 'bar',
                data: x2555
            },
            {
                name: '2556',
                type: 'bar',
                data: x2556
            },
            {
                name: '2557',
                type: 'bar',
                data: x2557
            }
        ]
    };

    option && myChart.setOption(option);
}

```