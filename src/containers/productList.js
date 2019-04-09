import {connect} from 'react-redux'
import * as actions from '../actions/food';
import FoodList from '../modules/food/component/foodList';

//将状态写入属性
const mapStateToProps = (state) => {
    return {
        dataSource: state.foodReducer.dataSource,
        loading: state.foodReducer.loading
    }
}

//将动作写入属性
const mapDispatchToProps = (dispatch) => {
    // return bindActionCreators(actions, dispatch)
    // console.log('mapDispatchToProps  ownProps ==== ', ownProps);
    return {
        getFoodList: (url, params) => dispatch(actions.getFoodList(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodList)
