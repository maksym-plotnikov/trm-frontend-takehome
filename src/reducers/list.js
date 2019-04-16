import {
    ADD_STORE,
    DELETE_STORE,
} from '../actions/types';


const initialState = {};

export default (
    state = initialState,
    {type, item, index},
) => {
    switch (type) {
        case ADD_STORE:
            const {id, store} = item;
            return {
                ...state,
                [id]: store
            };
        case DELETE_STORE:
            delete state[index];
            return {...state};
        default:
            return state;
    }
};
