// project imports
// import config from 'config';

import config from '../../../config';
// action - state management
import * as actionTypes from './actions';

// Initial state
export const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  const { id, fontFamily, borderRadius } = action;

  switch (action.type) {
    case actionTypes.MENU_OPEN:
      return {
        ...state,
        isOpen: [id],
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened,
      };
    case actionTypes.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily,
      };
    case actionTypes.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius,
      };
    default:
      return state;
  }
};

export default customizationReducer;
