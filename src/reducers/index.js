import { combineReducers } from 'redux'
import list from './list'
import markers from './markers'

export default combineReducers({
    list,
    markers
})
