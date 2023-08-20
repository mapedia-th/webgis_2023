var map = L.map("map", {
    center: [16.8839129325029, 100.31479739223792],
    zoom: 12
});

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?",
    { attribution: 'OSM' }
);

var Esri_WorldStreetMap = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China(Hong Kong), Esri(Thailand), TomTom, 2012",
    }
);

var google_road = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
    {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        lyr: "grod",
        isBase: "yes",
    }
);
var googleHybridge = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}",
    {
        maxZoom: 22,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        lyr: "ghyb",
        isBase: "yes",
    }
);
var googleTerrain = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}",
    {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        lyr: "gter",
        isBase: "yes",
    }
);

var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

// wms layer
var thailand = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:prov_thailand",
    format: "image/png",
    transparent: true,
    attribution: "map by mapedia.co.th",
});

var province = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:th_pro",
    format: "image/png",
    transparent: true,
    attribution: "map by mapedia.co.th",
});

var amphoe = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:th_amp",
    format: "image/png",
    transparent: true,
    attribution: "map by mapedia.co.th",
});

var tambon = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
    layers: "webgis:tambon",
    format: "image/png",
    transparent: true,
    attribution: "map by mapedia.co.th",
});

// osm.addTo(map);
// googleHybridge.addTo(map);
// thailand.addTo(map);
// province.addTo(map);
// amphoe.addTo(map);
// tambon.addTo(map);

var baseLayer = {
    "OpenStreetMap": osm,
    "Esri_WorldStreetMap": Esri_WorldStreetMap,
    "แผนที่ถนน google": google_road.addTo(map),
    "แผนที่ถนนภาพจากดาวเทียม": googleHybridge,
    "แผนที่ถนนภูมิประเทศ": googleTerrain,
    "Esri Gray Map": Esri_WorldGrayCanvas
}

var overLayer = {
    "ประทศ": thailand.addTo(map),
    "จังหวัด": province,
    "อำเภอ": amphoe,
    "ตำบล": tambon
}

L.control.layers(baseLayer, overLayer).addTo(map);