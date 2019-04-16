import {
    ADD_STORE,
    DELETE_STORE,
    SAVE_MARKER,
    DELETE_MARKER
} from './types';

export const addStore = item => ({
    type: ADD_STORE,
    item
});

export const deleteStore = index => ({
    type: DELETE_STORE,
    index,
});


export const saveMarker = marker => ({
    type: SAVE_MARKER,
    marker
});


export const deleteMarker = image => {
    return {
        type: DELETE_MARKER,
        marker
    };
};
