export enum MenuActionTypes{
    SET_MENU = "SET_MENU",
    SET_ABOUT_MODAL_OPEN = "SET_ABOUT_MODAL_OPEN"
}

export type Menu = "login" | "player-select" | "player-create" | "overview" | "map-create" | "in-game" | "dev-map"

export interface SetMenu{
    type:MenuActionTypes.SET_MENU;
    menu:Menu;
}

export interface SetAboutModalOpen{
    type:MenuActionTypes.SET_ABOUT_MODAL_OPEN;
    open:boolean;
}

export type MenuActions = (
    SetMenu | SetAboutModalOpen
);

export const setMenu = (menu:Menu):SetMenu => {
    return {
        type:MenuActionTypes.SET_MENU,
        menu
    };
};

export const setAboutModalOpen = (open:boolean):SetAboutModalOpen => {
    return {
        type:MenuActionTypes.SET_ABOUT_MODAL_OPEN,
        open
    };
};

export const showLogin = ():SetMenu => setMenu("login");
export const showPlayerSelect = ():SetMenu => setMenu("player-select");
export const showPlayerCreate = ():SetMenu => setMenu("player-create");
export const showOverview = ():SetMenu => setMenu("overview");
export const showMapCreate = ():SetMenu => setMenu("map-create");
export const showGame = ():SetMenu => setMenu("in-game");
export const showDevMap = ():SetMenu => setMenu("dev-map");