import {SAVE_MARKER, DELETE_MARKER} from '../actions/types';

const initialState = {
    cached: [],
};

export default (state = initialState, {type, marker}) => {
    switch (type) {
        case SAVE_MARKER:
            console.log(marker);
            return {...state, cached: state.cached.concat(marker)};
        case DELETE_MARKER:
            return {...state, cached: [...marker]};
        default:
            return state;
    }
};
