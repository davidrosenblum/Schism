import * as React from "react";
import { store } from "../Client";
import { Archetypes } from "../data/ArchetypeData";
import { NpcRanks } from "../data/MapData";
import * as background from "../assets/images/ui_box_1.png";
import * as hp from "../assets/images/hud_hp.png";
import * as mp from "../assets/images/hud_mp.png";
import * as res from "../assets/images/hud_res.png";
import * as def from "../assets/images/hud_def.png";
import "./HudTargetStats.css";

const ICON_SIZE:number = 32;

export const HudTargetStats = () => {
    const {targetStats} = store.getState().gameStats;

    const {
        name, level, health, healthCap, mana, manaCap,
        resistance, defense, faction, type, archetype, rank
    } = (targetStats || {});

    const resistancePercent:number = Math.floor(resistance * 100);
    const defensePercent:number = Math.floor(defense * 100);

    return (
        <div className="hud-target-stats-container hud-item" style={{backgroundImage: `url(${background})`}}>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={3}>
                            {targetStats ? name : "No target selected."}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            {targetStats ? `Level ${level}` : null}
                            &nbsp;
                            {
                                targetStats ? (type === "player" ? Archetypes[archetype].archetype : (
                                    `${faction} ${NpcRanks[rank].rank}`
                                )) : null
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {targetStats ? <img src={hp} width={ICON_SIZE} title="Health"/> : null}
                        </td>
                        <td>
                            {targetStats ? health.toFixed(0) : null}
                        </td>
                        <td>
                            {targetStats ? healthCap.toFixed(0) : null}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {targetStats ? <img src={mp} width={ICON_SIZE} title="Mana"/> : null}   
                        </td>
                        <td>
                            {targetStats ? mana.toFixed(0) : null}
                        </td>
                        <td>
                            {targetStats ? manaCap.toFixed(0) : null}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="text-center">
                {targetStats ? <img src={res} width={ICON_SIZE} title="Resistance"/> : null}
                &nbsp; 
                {targetStats ? `${resistancePercent.toFixed(0)}%` : null}
                &nbsp; 
                {targetStats ? <img src={def} width={ICON_SIZE} title="Defense"/> : null}  
                &nbsp;   
                {targetStats ? `${defensePercent.toFixed(0)}%` : null}
            </div>
        </div>
    );
};