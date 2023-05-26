import React from "react";
import mapboxgl from 'mapbox-gl';
import { render } from "react-dom";
import { Map } from "@commodityvectors/react-mapbox-gl";

import "./style.css";
import Sider from "./sider";

const BaseMap = ({ children, ...props }) => {
  return (
    <Map
      mapStyle={"mapbox://styles/valeriabelousova/clfkslwn8001g01pp9irv5yta"}
      accessToken="pk.eyJ1IjoidmFsZXJpYWJlbG91c292YSIsImEiOiJjazVkcm51YzMwZGZjM2xvM2xnZmltOHd5In0.1xUC4Qs0uGpmWUQElmlDGA"
      center={[37.6156, 55.7522]}
      zoom={3}
      options={{
        minZoom: 3,
        renderWorldCopies: false,
        attributionControl: false}}
      {...props}
    >
      {children}
    </Map>
  );
};

const TwoFingerDrag = Map.component(TwoFingerDragComponent);
function TwoFingerDragComponent({ map }) {
  var previousSelectedFeatureId = null;
  var selectedFeatureId = 0;
  const nav = new mapboxgl.NavigationControl();
  class entireExtentControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this._container.addEventListener('contextmenu', (e) => e.preventDefault());
        this._container.addEventListener('click', (e) => map.flyTo({
            center: [37.6156, 55.7522],
            duration: 1000,
            essential: true,
            zoom: 3
    }));

        this._container.innerHTML =
        '<button>' +
        '<span class="mapboxgl-ctrl-icon my-image-button" aria-hidden="true" title="Description"></span>' +
        '</button>'

        return this._container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }}
  
  const entireExtent = new entireExtentControl();
  map.addControl(entireExtent, 'top-left');
  map.addControl(nav, 'top-left');

  function createPopup(feature) {
    var name = feature.properties['Назва']
    var url = feature.properties['Сайт'];

    var type = feature.properties['Тип_з'].replace(';', ',');
    var city = feature.properties['Город'];
    var address = feature.properties['Адрес'];
    var author = feature.properties['Имя_с'];
    var photos = feature.properties['photos'].split(',');

    const isCaruselShow = (photos.length > 0) && (photos[0] !== '');
    const onlyOnePhoto = (photos.length === 1) && (photos[0] !== '');

    var car_el = ``;
    photos.forEach((photo, index) => {
                                    var photo_name = photo;
                                    if (index === 0) {
                                        car_el = car_el + 
                                        `<div class="carousel-item active">
                                            <img class="d-block w-100"
                                             src="https://storage.yandexcloud.net/champagnefest/${photo_name.replace('\'', '').replace('\'', '').replace(' ', '')}" 
                                             alt="First slide">
                                        </div>`
                                    }
                                    else {
                                        car_el = car_el + 
                                        `<div class="carousel-item">
                                            <img class="d-block w-100"
                                             src="https://storage.yandexcloud.net/champagnefest/${photo_name.replace('\'', '').replace('\'', '').replace(' ', '')}" 
                                             alt="First slide">
                                        </div>`
                                    }
                                    }
                                )
    var popupContent = `<div class='content'>
                    ${isCaruselShow ? `
                        <div class='carousel'>
                        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">
                                ${car_el}
                            </div>
                            ${ !onlyOnePhoto ? `
                                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>` : ``}
                            </div>
                    </div>` : ``}
                    
                    <div class='description'>
                        <div class='name'><a href=${url} target="_blank" style="color: black">${name}</a></div>
                        <div class='type'>${type}</div>
                        <br>
                        <div class='address'>${city}, ${address}</div>
                        <br>
                        ${author ? `<div class='type'>Автор винной подборки –</div>
                                    <div class='author'>${author}</div>` : `` }
                    </div>
                </div>`;

        return popupContent;
    }
    function myFunction(data, id) {
        const popup = document.getElementsByClassName('mapboxgl-popup');
        if ( popup.length ) {
            popup[0].remove();
        }
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].id == id) {
                var coords = data.features[i].geometry.coordinates.slice();
                var popupHtml = createPopup(data.features[i]);
            }
        }
        map.flyTo({
                    center: coords,
                    zoom: 17,
                    duration: 4000,
                    essential: true
                    });
        
        selectedFeatureId = id;
        map.setFeatureState({ source: 'wines', id: previousSelectedFeatureId }, { selected: false })
        map.setFeatureState({ source: 'wines', id: selectedFeatureId }, { selected: true })
        previousSelectedFeatureId = selectedFeatureId;

        var isCaruselShow = false;
        new mapboxgl.Popup().setLngLat(coords).setHTML(popupHtml).addTo(map);
    };

    function toggleSidebar() {
        const elem = document.getElementById('right');
        const button = document.getElementById('sider_btn');
        const collapsed = elem.classList.toggle('collapsed');
        button.classList.toggle('close');
        const padding = {};
        padding['right'] = collapsed ? 0 : 200; 
            map.easeTo({
            padding: padding,
            duration: 3000
        });
        }
  var root = document.getElementById('root');
  var sider_right = document.createElement('div');
  sider_right.innerHTML = `
            <div id="right" 
                class="sidebar flex-center right" 
                style="position: absolute; top: 0px; z-index: 99">
            <div class="sidebar-content rounded-rect flex-center">
                <ul class="list" id="list">
                    <li class="cities">Москва
                      <ul id="msk">
                      </ul>
                    </li>
                    <li>Санкт-Петербург
                      <ul id="spb">
                      </ul>
                    </li>
                    <li>Барнаул
                        <ul id="brn">
                        </ul>
                    </li>
                    <li>Владивосток
                        <ul id="vld">
                        </ul>
                    </li>
                    <li>Екатеринбург
                      <ul id="ekb">
                      </ul>
                    </li>
                    <li>Йошкар-Ола
                        <ul id="yos">
                        </ul>
                    </li>
                    <li>Красноярск
                        <ul id="krs">
                        </ul>
                    </li>
                    <li>Нижний Новгород
                        <ul id="nzn">
                        </ul>
                    </li>
                    <li>Новосибирск
                        <ul id="nvb">
                        </ul>
                    </li>
                    <li>Ростов-на-Дону
                        <ul id="rst">
                        </ul>
                    </li>
                    <li>Сургут
                        <ul id="srg">
                        </ul>
                    </li>
                    <li>Томск
                        <ul id="tmk">
                        </ul>
                    </li>
                    <li>Тюмень
                        <ul id="tmn">
                        </ul>
                    </li>
                    <li>Уфа
                        <ul id="ufa">
                        </ul>
                    </li>
                    <li>Ялта
                        <ul id="yal">
                        </ul>
                    </li>
                  </ul>    
            </div>
            </div>
            `;
  var sider_right_button = document.createElement('div');
  sider_right_button.id = "sider_btn";
  sider_right_button.className = "sidebar-toggle rounded-rect right";
  sider_right_button.onclick = function() { toggleSidebar('right'); };
  root.appendChild(sider_right);
  root.appendChild(sider_right_button);
  

  fetch('https://raw.githubusercontent.com/emgdevhelp/winemap/main/wine_poi_id_itog_photos.geojson')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var features = data.features;
                var new_features_order = features.sort(sortFeatures);

                data.features = new_features_order;

                appendData(data);
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });

    function sortFeatures(feature1, feature2) {
        if (feature1.properties['Назва'] < feature2.properties['Назва']) {return -1;}
        if (feature1.properties['Назва'] > feature2.properties['Назва']) {return 1;}
        return 0;
    }

    function appendData(data) {
            var mskContainer = document.getElementById("msk");
            var spbContainer = document.getElementById("spb");
            var ekbContainer = document.getElementById("ekb");

            var brnContainer = document.getElementById("brn");
            var vldContainer = document.getElementById("vld");
            var yosContainer = document.getElementById("yos");

            var krsContainer = document.getElementById("krs");
            var nznContainer = document.getElementById("nzn");
            var nvbContainer = document.getElementById("nvb");

            var rstContainer = document.getElementById("rst");
            var tmkContainer = document.getElementById("tmk");
            var tmnContainer = document.getElementById("tmn");
            var srgContainer = document.getElementById("srg");

            var ufaContainer = document.getElementById("ufa");
            var yalContainer = document.getElementById("yal");

            for (var i = 0; i < data.features.length; i++) {
                if (data.features[i].properties['Город'] == 'Москва') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    mskContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Санкт-Петербург') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    spbContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Барнаул') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    brnContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Владивосток') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    vldContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Екатеринбург') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    ekbContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Йошкар-Ола') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    yosContainer.appendChild(div);
                }
                if (data.features[i].properties['Город'] == 'Красноярск') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    krsContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Нижний Новгород') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    nznContainer.appendChild(div);
                }
                if (data.features[i].properties['Город'] == 'Новосибирск') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    nvbContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Ростов-на-Дону') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    a.className = "deselected";
                    var a = document.createElement("a");
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    rstContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Сургут') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    srgContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Томск') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    tmkContainer.appendChild(div);
                } 
                if (data.features[i].properties['Город'] == 'Тюмень') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    tmnContainer.appendChild(div);
                }
                if (data.features[i].properties['Город'] == 'Уфа') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    ufaContainer.appendChild(div);
                }
                if (data.features[i].properties['Город'] == 'Ялта') {
                    var div = document.createElement("li");
                    div.className = "deselected";
                    var a = document.createElement("a");
                    a.className = "deselected";
                    a.innerHTML = data.features[i].properties['Назва'];
                    div.appendChild(a);
                    var id = data.features[i].id;
                    div.id = id;
                    div.onclick = function() { myFunction(data, this.id); };
                    yalContainer.appendChild(div);
                } 
            }
        }
        var list = document.getElementById('list');
        for (let li of list.querySelectorAll("li")) {
            let span = document.createElement("span");
            span.classList.add("hide");
            li.prepend(span);
            span.append(span.nextSibling);
            }
        for (let ul of list.querySelectorAll("ul")) {
            ul.hidden = true;
        }
            
            list.onclick = function (event) {
                if (event.target.tagName != "SPAN") { 
                    if (event.target.tagName === "A") {
                        var selected_names = document.getElementsByClassName('selected');
                        for (var i = 0; i < selected_names.length; ++i) {
                            selected_names[i].className = "deselected";
                        }
                        var selected_names1 = document.getElementsByClassName('selected1');
                        for (var i = 0; i < selected_names1.length; ++i) {
                            selected_names1[i].className = "deselected";
                        }
                        event.target.classList.remove("deselected");
                        event.target.classList.add("selected");
                        event.target.parentNode.classList.add("selected1");
                    }
                    else {
                        return;
                    }
                    
                };

                let childrenList = event.target.parentNode.querySelector("ul");
                if (!childrenList) return;
                childrenList.hidden = !childrenList.hidden;

                if (childrenList.hidden) {
                    event.target.classList.add("hide");
                    event.target.classList.remove("show");
                } else {
                    event.target.classList.add("show");
                    event.target.classList.remove("hide");
                }
            };


  map.on('load', () => {
    //var previousSelectedFeatureId = null;
    toggleSidebar();
    map.addSource('wines', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/emgdevhelp/winemap/main/wine_poi_id_itog_photos.geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 38
    });
    map.addSource('msk_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Москва"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        37.6156,
                        55.7522
                    ]
                }
            }]
        }
    });
    map.addSource('spb_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Санкт-Петербург"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        30.315877,
                        59.939099
                    ]
                }
            }]
        }
    });
    map.addSource('krs_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Красноярск"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        92.8672,
                        56.0184
                    ]
                }
            }]
        }
    });
    map.addSource('nino_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Нижний Новгород"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        44.002,
                        56.3287
                    ]
                }
            }]
        }
    });
    map.addSource('ekb_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Екатеринбург"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        60.6122,
                        56.8519
                    ]
                }
            }]
        }
    });
    map.addSource('nsb_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Новосибирск"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        82.9346,
                        55.0415
                    ]
                }
            }]
        }
    });
    map.addSource('brn_poi', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Барнаул"},
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        83.7636,
                        53.3606
                    ]
                }
            }]
        }
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'wines',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#000000',
                100,
                '#000000',
                750,
                '#000000'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                22,
                10,
                30,
                25,
                40
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'wines',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 16
        },
        paint: {
              'text-color': '#ffffff'
            }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'wines',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': ['case',
            ['==', ['feature-state', 'selected'], true], '#ffffff',
            '#000000'
            ],
            'circle-radius': ['case',
            ['==', ['feature-state', 'selected'], true], 5,
            7
            ],
            'circle-stroke-width': ['case',
            ['==', ['feature-state', 'selected'], true], 2,
            0
            ],
            'circle-stroke-color': ['case',
            ['==', ['feature-state', 'selected'], true], '#000000',
            '#000000'
            ],
        }
    });
    const labelLayer = {
        id: 'label_layer',
        type: 'symbol',
        source: 'wines',
        layout: {
            'text-field': "{Город}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [0.64, 0.23],
        },
        paint: {
        'text-color': '#000000',
        }
    };

    const labelWines = {
        id: 'wine_names',
        type: 'symbol',
        source: 'wines',
        visibility: 'none',
        layout: {
            'text-field': "{Назва}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [0.54, 0.23],
        },
        paint: {
        'text-color': '#000000',
        }
    };

    const msk_label = {
        id: 'msk_names',
        type: 'symbol',
        source: 'msk_poi',
        visibility: 'none',
        layout: {
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [0.74, -2.33],
        },
        paint: {
        'text-color': '#000000',
        }
    };
    const spb_label = {
        id: 'spb_names',
        type: 'symbol',
        source: 'spb_poi',
        visibility: 'none',
        layout: {
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [1.54, -1.3],
        },
        paint: {
        'text-color': '#000000',
        }
    };
    const krs_label = {
        id: 'krs_names',
        type: 'symbol',
        source: 'krs_poi',
        visibility: 'none',
        layout: {
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [1.34, -0.8],
        },
        paint: {
        'text-color': '#000000',
        }
    };
    const nino_label = {
        id: 'nino_names',
        type: 'symbol',
        source: 'nino_poi',
        visibility: 'none',
        layout: {
            'visibility': 'none',
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [1.34, -0.8],
        },
        paint: {
        'text-color': '#000000',
        }
    };
    const ekb_label = {
        id: 'ekb_names',
        type: 'symbol',
        source: 'ekb_poi',
        visibility: 'none',
        layout: {
            'visibility': 'none',
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [1.34, -0.8],
        },
        paint: {
        'text-color': '#000000',
        }
    };
    const nsb_label = {
        id: 'nsb_names',
        type: 'symbol',
        source: 'nsb_poi',
        visibility: 'none',
        layout: {
            'visibility': 'none',
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [1.34, -0.8],
        },
        paint: {
        'text-color': '#000000',
        }
    };
    const brn_label = {
        id: 'brn_names',
        type: 'symbol',
        source: 'brn_poi',
        layout: {
            'visibility': 'none',
            'text-field': "{name}",
            'text-size': 15,
            'text-anchor': "bottom-left",
            'text-font': ['Roboto Light', 'Arial Unicode MS Bold'],
            'symbol-avoid-edges': true,
            'text-offset': [1.34, -0.8],
        },
        paint: {
        'text-color': '#000000',
        }
    };

    map.addLayer(labelWines);
    map.addLayer(labelLayer);
    map.addLayer(msk_label);
    map.addLayer(spb_label);
    map.addLayer(krs_label);
    map.addLayer(ekb_label);
    map.addLayer(nsb_label);
    map.addLayer(brn_label);
    map.addLayer(nino_label);

    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('wines').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    duration: 3000,
                    essential: true,
                    zoom: zoom + 3
                });
            }
        );
    });
    map.on('click', (event) => {
        const features = map.queryRenderedFeatures(event.point, {layers: ['unclustered-point']});
        if (!features.length) { 
            map.setFeatureState({ source: 'wines', id: previousSelectedFeatureId }, { selected: false })
            return;
            }
        else {
            map.setFeatureState({ source: 'wines', id: previousSelectedFeatureId }, { selected: false })
        }
        const feature = features[0];
        if (feature) {
            var selectedFeatureId = feature.id;
            map.setFeatureState({ source: 'wines', id: previousSelectedFeatureId }, { selected: false })
            map.setFeatureState({ source: 'wines', id: selectedFeatureId }, { selected: true })
            previousSelectedFeatureId = selectedFeatureId;
        }
    });

    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        var popupHtml = createPopup(e.features[0]);
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupHtml).addTo(map);
    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
    // Center the map on the coordinates of any clicked circle from the 'circle' layer.
    map.on('click', 'unclustered-point', (e) => {
        var zoom = map.getZoom();
        if (e.features[0].id === 73) {
            if (zoom < 5 ) {
                var zoom = 5;
            }
            map.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: zoom,
            duration: 6000,
            essential: true
            });
        }
        if (e.features[0].id === 67) {
            if (zoom < 12 ) {
                var zoom = 12;
            }
            map.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: zoom,
            duration: 6000,
            essential: true
            });
        }
        else {
            if (zoom < 14 ) {
                var zoom = 15;
            }
            map.flyTo({
                center: e.features[0].geometry.coordinates,
                zoom: zoom,
                duration: 4000,
                essential: true
                });
        }
    });
    map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
    });

    // zoom labels
    map.on('zoom', function(e) {
        var zoom = map.getZoom();
        if (zoom > 11) {
            map.setLayoutProperty('wine_names', 'visibility', 'visible');
        }
        if (zoom <= 11) {
            map.setLayoutProperty('wine_names', 'visibility', 'none');
        }
        if (map.getZoom() > 7) {
            map.setLayoutProperty('label_layer', 'visibility', 'none');
            map.setLayoutProperty('msk_names', 'visibility', 'none');
            map.setLayoutProperty('spb_names', 'visibility', 'none');
            map.setLayoutProperty('krs_names', 'visibility', 'none');
        }
        else {
            map.setLayoutProperty('label_layer', 'visibility', 'visible');
            map.setLayoutProperty('msk_names', 'visibility', 'visible');
            map.setLayoutProperty('spb_names', 'visibility', 'visible');
            map.setLayoutProperty('krs_names', 'visibility', 'visible');
        }
    });
    map.on('zoom', function(e) {
        var zoom = map.getZoom();
        if (zoom < 3.2 || zoom > 7) {
            map.setLayoutProperty('ekb_names', 'visibility', 'none');
            map.setLayoutProperty('nsb_names', 'visibility', 'none');
            map.setLayoutProperty('brn_names', 'visibility', 'none');
        }
        if (zoom < 5 || zoom > 7) {
            map.setLayoutProperty('nino_names', 'visibility', 'none');
        }
        else {
            map.setLayoutProperty('ekb_names', 'visibility', 'visible');
            map.setLayoutProperty('nsb_names', 'visibility', 'visible');
            map.setLayoutProperty('brn_names', 'visibility', 'visible');
            map.setLayoutProperty('nino_names', 'visibility', 'visible');
        }
    });
});



  return null;
}

const App = () => {
  return (
    <>
      <BaseMap>
        <TwoFingerDrag />
      </BaseMap>
    </>
  );
};

render(<App />, document.getElementById("root"));
