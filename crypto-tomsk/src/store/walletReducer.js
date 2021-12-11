// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    wallet: null
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_WALLET:
            return {
                ...state,
                wallet: action.wallet
            };
        default:
            return state;
    }
};

export default walletReducer;
