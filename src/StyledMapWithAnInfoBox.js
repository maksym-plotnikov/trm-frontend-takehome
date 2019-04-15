import React, {PureComponent} from 'react';

const stores = require('json!../store_directory.json');


export default class StyledMapWithAnInfoBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {markers: []};
        this.Marker = google.maps.Marker;
        this.Map = google.maps.Map;
        this.infoWindow = new google.maps.InfoWindow();
        this.bounds = new google.maps.LatLngBounds();
        this.map = null;
        this.initMap = this.initMap.bind(this);
        this.createMarker = this.createMarker.bind(this);
    }

    componentDidMount() {
        this.initMap();
    }

    createMarker(name, place) {
        //console.log(name, place);
        const marker = new this.Marker({
            position: place.geometry.location,
            map: this.map
        });
        this.bounds.extend(marker.position);
        console.log(this.map);
        google.maps.event.addListener(marker, 'click', function () {
            this.infoWindow.setContent(name);
            this.infoWindow.open(this.map, marker);
        });
        this.setState(prevState => ({
            markers: [...prevState.markers, marker]
        }))
        this.map.fitBounds(this.bounds);
    };


    initMap() {
        let nextAddress = 0;
        let delay = 100;
        // const latlng = new google.maps.LatLng(37.773972, -122.431297); SanFrancisco
        const latlng = new google.maps.LatLng(19.42847, -99.12766); // Mexico
        const mapOptions = {
            zoom: 12,
            center: latlng
        };
        this.map = new this.Map(document.getElementById('map'), mapOptions);
        const service = new google.maps.places.PlacesService(this.map);

        const geocodeAddress = (store, next) => {
            const request = {
                query: store.Address,
                fields: ['name', 'geometry'],
            };
            service.findPlaceFromQuery(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        this.createMarker(store.Address, results[i]);
                    }
                } else {
                    if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                        nextAddress--;
                        delay++;
                    }
                }
            });
            next();
        };

        const getNext = () => {
            if (nextAddress < stores.length) {
                setTimeout(() => {
                        geocodeAddress(stores[nextAddress], getNext);
                    },
                    delay);
                nextAddress++;
            } else {
                this.map.fitBounds(this.bounds);
            }
        };
        getNext();

    }

    render() {
        const {markers} = this.state;
        const progress = ((markers.length / stores.length) * 100).toFixed(1);
        return (
            <div>
                {progress < 100 && <div>Loading: {progress} %</div>}
                <div id="map" style={{height: '600px', width: '100%'}}></div>
            </div>
        )


    }
}