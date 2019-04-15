import {connect} from 'react-redux';
import InfoMap from './InfoMap';
import {addStore, deleteStore} from '../../actions'

const mapStateToProps = state => ({
    list: state.list,
});

const mapDispatchToProps = {
    addStore: item => dispatch => dispatch(addStore(item)),
    deleteStore: index => dispatch => dispatch(deleteStore(index)),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InfoMap);
