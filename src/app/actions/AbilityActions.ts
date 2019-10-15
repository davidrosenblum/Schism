export enum AbilityActionTypes{
    SET_ABILITY_CAST_PENDING = "ABILITY_CAST_PENDING"
}

export interface SetAbilityCastPending{
    type:AbilityActionTypes.SET_ABILITY_CAST_PENDING;
    pending:boolean;
}

export type AbilityActions = (
    SetAbilityCastPending
);

export const setAbilityCastPending = (pending:boolean):SetAbilityCastPending => {
    return {
        type: AbilityActionTypes.SET_ABILITY_CAST_PENDING,
        pending
    };
};