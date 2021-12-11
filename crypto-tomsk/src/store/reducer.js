import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import walletReducer from './walletReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    wallet: walletReducer
});

export default reducer;
