import { Menu, MenuActions, MenuActionTypes } from "../actions/MenuActions";
import { Reducer } from "redux";

export interface MenuState{
    menu:Menu;
    aboutOpen:boolean;
}

export const menuState:MenuState = {
    menu: "login",
    aboutOpen: false
};

export const menuReducer:Reducer<MenuState, MenuActions> = (state=menuState, action):MenuState => {
    switch(action.type){
        case MenuActionTypes.SET_MENU:
            return {...state, menu: action.menu};

        case MenuActionTypes.SET_ABOUT_MODAL_OPEN:
            return {...state, aboutOpen: action.open};

        default:
            return state;
    }
};