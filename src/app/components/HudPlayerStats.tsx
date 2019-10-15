import * as React from "react";
import { store } from "../Client";
import { Archetypes } from "./../data/ArchetypeData";
import * as background from "../assets/images/ui_box_1.png";
import * as hp from "../assets/images/hud_hp.png";
import * as mp from "../assets/images/hud_mp.png"
import * as exp from "../assets/images/hud_xp.png";
import "./HudPlayerStats.css";

const ICON_SIZE:number = 32;

export const HudPlayerStats = () => {
    const {playerStats} = store.getState().gameStats;

    const {
        name, level, health, healthCap, mana, manaCap,
        xp, xpRequired, archetype
    } = (playerStats || {});

    // const healthPercent:number = Math.floor((health / healthCap) * 100);
    // const manaPercent:number = Math.floor((mana / manaCap) * 100);
    // const xpPercent:number = Math.floor((xp / xpRequired) * 100);

    return (
        <div className="hud-player-stats-container hud-item" style={{backgroundImage: `url(${background})`}}>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={3}>
                            {name}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            Level {level} {Archetypes[archetype].archetype}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={hp} width={ICON_SIZE} title="Health"/> 
                        </td>
                        <td>{health.toFixed(0)}</td>
                        <td>{healthCap.toFixed(0)}</td>
                        {/* <td>({healthPercent}%)</td> */}
                    </tr>
                    <tr>
                        <td>
                            <img src={mp} width={ICON_SIZE} title="Mana"/> 
                        </td>
                        <td>{mana.toFixed(0)}</td>
                        <td>{manaCap.toFixed(0)}</td>
                        {/* <td>({manaPercent}%)</td> */}
                    </tr>
                    <tr>
                        <td>
                            <img src={exp} width={ICON_SIZE} title="Experience"/> 
                        </td>
                        <td>{xp.toFixed(0)}</td>
                        <td>{xpRequired.toFixed(0)}</td>
                        {/* <td>({xpPercent}%)</td> */}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};  