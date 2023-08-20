// 7 สร้าง editData function
function editData() {
    var data = {
        sname: $('#sname').val(),
        stype: $('#stype').val(),
        sdesc: $('#sdesc').val(),
        geom: pos.geom,
        id: pos.id
    }
    $.post('http://localhost:3000/api/update', data, (res) => {
        getData();
        $('form :input').val('');
        $("#status").empty().text("");
    })
}
// 8 สร้าง refreshPage function
function refreshPage() {
    location.reload(true);
}
// 9 สร้าง deleteData function
function deleteData() {
    var data = {
        id: pos.id
    }
    $.post('http://localhost:3000/api/delete', data, (res) => {
        getData();
        $('form :input').val('');
        $("#status").empty().text("");
    })
}
// 10 สร้าง map object
var map = L.map('map', {
    center: [16.820378, 100.265787],
    zoom: 13
});
// 11 สร้าง loadmap function
function loadMap() {
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var pro = L.tileLayer.wms("https://ogc.mapedia.co.th/geoserver/webgis/wms?", {
        layers: 'webgis:th_pro',
        format: 'image/png',
        transparent: true,
        attribution: "mapedia"
    });
    var baseMap = {
        "OpenStreetMap": osm.addTo(map)
    }
    var overlayMap = {
        "ขอบจังหวัด": pro.addTo(map)
    }
    L.control.layers(baseMap, overlayMap).addTo(map);
}
// 12 สร้าง onLocationFound function
function onLocationFound(e) {
    gps = L.marker(e.latlng, { draggable: true });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    gps.on('dragend', (e) => {
        console.log(e)
    })
}
// 13 สร้าง onLocationError function
function onLocationError(e) {
    console.log(e.message);
}
// 14 map on method
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({ setView: true, maxZoom: 16 });
// 15 ส่งข้อมูลใน form ไปยัง backend
$('#fieldForm').submit(function (e) {
    e.preventDefault();
    $("#status").empty().text("File is uploading...");
    const obj = {
        sname: $('#sname').val(),
        stype: $('#stype').val(),
        sdesc: $('#sdesc').val(),
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    }
    $(this).ajaxSubmit({
        data: obj,
        contentType: 'application/json',
        success: function (res) {
            // เรียกข้อมูลมาแสดงผล
            getData()
            $('form :input').val('');
            $("#status").empty().text("");
        }
    });
    return false;
});
// 19 สร้าง getData
function getData() {
    var marker;
    console.log(marker)
    if (marker) {
        map.removeLayer(marker);
    }
    $.get('http://localhost:3000/api/getdata', (res) => {
        // var fs = res.features;
        marker = L.geoJSON(res, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { draggable: true });
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    layer.bindPopup(
                        'ชื่อสถานที่: ' + feature.properties.sname + '</br>' +
                        'ประเภท: ' + feature.properties.stype + '</br>' +
                        'คำอธิบาย: ' + feature.properties.sdesc + '</br>' +
                        '<img src="/upload/' + feature.properties.simg + '" width="250px">'
                    );
                }
            }
        }).on('click', selectMarker);
        marker.addTo(map);
    })
}

// 20 เรียกใช้งาน function
loadMap()
getData();

// 21 สรา้ง selectMarker function
function selectMarker(e) {
    // console.log(e);
    $('#sname').val(e.layer.feature.properties.sname);
    $('#stype').val(e.layer.feature.properties.stype);
    $('#sdesc').val(e.layer.feature.properties.sdesc);
    $("#edit").attr("disabled", false);
    $("#remove").attr("disabled", false);
    pos = {
        geom: '{"type":"Point","coordinates":[' + e.latlng.lng + ',' + e.latlng.lat + ']}',
        id: e.layer.feature.properties.id
    }
    $("#status").empty().text("กำลังแก้ใขข้อมูล..");
}
// 22 สร้าง map on click
map.on('click', () => {
    $('form :input').val('');
    $("#edit").attr("disabled", true);
    $("#remove").attr("disabled", true);
    $("#status").empty().text("");
});