import * as knightIcon from "../assets/images/ui_archetype_knight.png";
import * as rangerIcon from "../assets/images/ui_archetype_ranger.png";
import * as alchemistIcon from "../assets/images/ui_archetype_alchemist.png";

export const Archetypes:{[atId:number]: {archetype:string, description:string, role:string, icon:string}} = {
    1: {
        archetype: "Knight",
        role: "Tank",
        description: "Powerful warriors adept at taking heavy damage. Focuses on defense and strong single target attacks. Equiped with heavy army, making them very challenging to defeat.",
        icon: knightIcon
    },
    2: {
        archetype: "Ranger",
        role: "Damage",
        description: "Evasive warriors adept at dealing heavy damage. Focuses on a variety of attacks and enemy debuffs. Equiped with medium armor, making them moderately hard to defeat - if they don't kill you first.",
        icon: rangerIcon
    },
    3: {
        archetype: "Alchemist",
        role: "Support",
        description: "Mystical warriors adept at controlling the battlefield. Focuses on buffing allies, debuffing enemies, and multi target attacks. Equiped with light armor, making them more vulnerable.",
        icon: alchemistIcon
    },
};