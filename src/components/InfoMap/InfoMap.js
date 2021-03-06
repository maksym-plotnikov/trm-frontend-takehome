import React, {Component} from 'react';
import {arrayOf, object, oneOfType, shape, string} from 'prop-types';
import classNames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import {withStyles} from '@material-ui/core/styles';
import {styles} from './styles'
//Import data
import stores from '../../../store_directory.json';
import {BATCH_SIZE} from '../../constants/index'

class InfoMap extends Component {
    constructor(props) {
        super(props);
        this.state = {markers: [], menuOpen: false, snackOpen: false};
        this.Maps = google.maps;
        this.Marker = this.Maps.Marker;
        this.Map = this.Maps.Map;
        this.infoWindow = new this.Maps.InfoWindow();
        this.bounds = new this.Maps.LatLngBounds();
        this.map = null;
        this.markersData = [];
        this.initMap = this.initMap.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.handleMenuToggle = this.handleMenuToggle.bind(this);
        this.handleSnackToggle = this.handleSnackToggle.bind(this);
        this.addToList = this.addToList.bind(this);
        this.removeFromList = this.removeFromList.bind(this);
    }

    componentDidMount() {
        this.initMap();
    }

    handleMenuToggle(bool = false) {
        this.setState(state => ({menuOpen: bool}));
    };

    handleSnackToggle() {
        this.setState(state => ({snackOpen: !state.snackOpen}));
    };

    addToList({target}) {
        const {addStore, list} = this.props;
        addStore({id: target.id, store: stores[target.id]});
        this.infoWindow.close();
        this.setState({message: 'Store added to Favourites'}, () => {
            this.handleSnackToggle();
            if (Object.values(list).length === 0) {
                this.handleMenuToggle(true);
            }
        });

    }

    removeFromList(idx) {
        const {deleteStore} = this.props;
        deleteStore(idx);
        this.setState({message: 'Store has been deleted'}, () => {
            this.handleSnackToggle();
        });
    }

    createMarker(store, location, markerIndex) {
        // Omit markers with NO_RESULTS
        if (typeof location === 'object') {
            const marker = new this.Marker({
                position: location,
                map: this.map
            });
            this.bounds.extend(marker.position);
            // Create InfoWindow content
            const content = document.createElement('div');
            content.innerHTML = `<div><h2>${store.Name}</h2><h5>${store.Address}</h5></div>`;
            const button = content.appendChild(document.createElement('input'));
            button.type = 'button';
            button.id = markerIndex;
            button.classList.add('action-button');
            button.value = 'Add to favourites';
            button.addEventListener('click', this.addToList.bind(this));
            this.markersData.push(marker);
            if(markerIndex % BATCH_SIZE  === 0 || markerIndex === (stores.length -1)) {
                this.map.fitBounds(this.bounds);
                new MarkerClusterer(this.map, this.markersData, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
            }
            this.Maps.event.addListener(marker, 'click', () => {
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);
            });
        }
    };

    initMap() {
        let delay = 100;
        const {markers, saveMarker} = this.props;
        // TODO Check why we have to show San-Francisco in we have all data from Mexico??
        // const latlng = new google.maps.LatLng(37.773972, -122.431297); SanFrancisco
        const latlng = new this.Maps.LatLng(19.42847, -99.12766); // Mexico
        const mapOptions = {
            zoom: 12,
            center: latlng
        };
        this.map = new this.Map(document.getElementById('map'), mapOptions);
        const service = new google.maps.places.PlacesService(this.map);

        // Init cached markers from start
        if (Object.values(markers).length) {
            markers.map((marker, index) => this.createMarker(marker.info, marker.location, index));
        }
        let nextAddress = markers.length === 0 ? 0 : markers.length;

        const findLatLang = (store, service) => {
            return new Promise((resolve, reject) => {
                const request = {
                    query: store.Address,
                    fields: ['name', 'geometry'],
                };
                service.findPlaceFromQuery(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results[0].geometry.location);
                    } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                        reject();
                    } else {
                        // If no results proceed to next and save to Redux
                        resolve(status);
                    }
                });
            });
        };

        const getNext = async () => {
            if (nextAddress < stores.length) {
                try {
                    const location = await findLatLang(stores[nextAddress], service);
                    if (location != null) {
                        saveMarker({info: stores[nextAddress], location});
                        this.createMarker(stores[nextAddress], location, nextAddress);
                    }
                    nextAddress++;
                    getNext();

                } catch (e) {
                    delay++;
                    setTimeout(getNext.bind(this), delay);
                }
            } else {
                this.map.fitBounds(this.bounds);
            }
        };
        // Start recursion call
        getNext();
    }

    render() {
        const {menuOpen, snackOpen, message} = this.state;
        const {markers, list, classes} = this.props;
        const progress = Math.ceil((markers.length / stores.length) * 100);
        return (
            <div>
                <Card className={classNames(classes.content, {
                    [classes.contentShift]: menuOpen,
                })}>
                    <CssBaseline/>
                    <AppBar position="static" className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="Open Favourites"
                                onClick={() => this.handleMenuToggle(!menuOpen)}
                                className={classes.menuButton}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" color="inherit" noWrap>
                                Stores map
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {progress < 100 && <LinearProgress color="secondary" variant="determinate" value={progress}/>}
                    <div className={classNames('wrapper', {
                        ['fadeOutUp']: progress === 100
                    })}>
                        {progress < 100 && <div>Loading: {progress} % <span>(processed: {markers.length} of {stores.length})</span></div>}
                        {progress === 100 && <div>All data has been processed</div>}
                    </div>
                    <main>
                        <div id="map"></div>
                    </main>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={menuOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={() => this.handleMenuToggle(false)}>
                                <ChevronLeftIcon/>
                            </IconButton>
                            <Typography variant="h5">
                                Favourites
                            </Typography>
                        </div>

                        <List title="Favourite Stores">
                            {list && Object.keys(list).map(key =>
                                <ListItem key={key}>
                                    <ListItemText primary={list[key].Name} secondary={list[key].Address}/>
                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        className={classes.close}
                                        onClick={() => this.removeFromList(key)}
                                    >
                                        <CloseIcon className={classes.icon}/>
                                    </IconButton>
                                </ListItem>
                            )}
                            {!Object.keys(list).length && (
                                <div className="no-data-container" key="no-data">
                                    <Typography variant="subtitle2"
                                                color="inherit"
                                                align="center">
                                        No data available
                                    </Typography></div>)}
                        </List>
                    </Drawer>
                </Card>
                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    autoHideDuration={2000}
                    open={snackOpen}
                    onClose={this.handleSnackToggle}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{message}</span>}
                />
            </div>

        )
    }
}

InfoMap.propTypes = {
    classes: object.isRequired,
    list: object.isRequired,
    markers: arrayOf(
        shape({
            info: shape({
                Name: string.isRequired,
                Address: string.isRequired
            }),
            location: oneOfType([object, string])
        })
    ),
};


export default withStyles(styles, {withTheme: true})(InfoMap);
