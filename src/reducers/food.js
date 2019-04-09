import assign from 'lodash/assign';
import { SHOW_PRODUCT_LIST } from '../actions/food';
//reducer其实也是个方法而已,参数是state和action,返回值是新的state
const initialState = {
	dataSource: [],
    loading: true
}

export default function food(state = initialState, action) {
    switch (action.type) {
	    case SHOW_PRODUCT_LIST:
	        return assign({}, state, action.data)
	    default:
	        return state
    }
}
