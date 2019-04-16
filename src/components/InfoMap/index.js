import {connect} from 'react-redux';
import InfoMap from './InfoMap';
import {addStore, deleteStore, saveMarker} from '../../actions';

const mapStateToProps = state => ({
    list: state.list,
    markers: state.markers.cached
});

const mapDispatchToProps = {
    addStore: item => dispatch => dispatch(addStore(item)),
    deleteStore: index => dispatch => dispatch(deleteStore(index)),
    saveMarker: marker => dispatch => dispatch(saveMarker(marker)),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InfoMap);
