import {
    ADD_STORE,
    DELETE_STORE,
} from './types';

export const addStore = item => ({
    type: ADD_STORE,
    item
});

export const deleteStore = index => ({
    type: DELETE_STORE,
    index,
});
