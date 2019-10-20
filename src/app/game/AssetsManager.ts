import { AssetLoader, LoadAssets } from "../gfx/AssetLoader";
import { AnimationJson } from "../gfx/AnimationLoader";

import * as ash from "../assets/images/texture_ash.png";
import * as castle_floor_1 from "../assets/images/texture_castle_floor_1.png";
import * as castle_floor_2 from "../assets/images/texture_castle_floor_2.png";
import * as lava from "../assets/images/texture_lava.png";
import * as molten_ash from "../assets/images/texture_molten_ash.png";

import * as castle_wall from "../assets/images/doodad_castle_wall.png";
import * as rock from "../assets/images/doodad_rock.png";

import * as fx_death from "../assets/images/fx_death.png";
import * as fx_death_anim from "../assets/images/fx_death.json";
import * as fx_levelup from "../assets/images/fx_levelup.png";
import * as fx_levelup_anim from "../assets/images/fx_levelup.json";
import * as fx_manaburst from "../assets/images/fx_manaburst.png";
import * as fx_manaburst_anim from "../assets/images/fx_manaburst.json";
import * as fx_rez from "../assets/images/fx_rez.png";
import * as fx_rez_anim from "../assets/images/fx_rez.json";

import * as enemy_ghoul from "../assets/images/enemy_ghoul.png";
import * as enemy_ghoul_anim from "../assets/images/enemy_ghoul.json";
import * as enemy_grave_knight from "../assets/images/enemy_grave_knight.png";
import * as enemy_grave_knight_anim from "../assets/images/enemy_grave_knight.json";
import * as enemy_lich from "../assets/images/enemy_lich.png";
import * as enemy_lich_anim from "../assets/images/enemy_lich.json";

import * as player_alchemist from "../assets/images/player_alchemist.png";
import * as player_alchemist_anim from "../assets/images/player_alchemist.json";
import * as player_knight from "../assets/images/player_knight.png";
import * as player_knight_anim from "../assets/images/player_knight.json";
import * as player_ranger from "../assets/images/player_ranger.png";
import * as player_ranger_anim from "../assets/images/player_ranger.json";

export class AssetsManager{
    private static readonly images:{[alias:string]: string} = {
        ash,
        castle_floor_1,
        castle_floor_2,
        lava,
        molten_ash,
        castle_wall,
        rock,
        fx_death,
        fx_levelup,
        fx_manaburst,
        fx_rez,
        enemy_ghoul,
        enemy_grave_knight,
        enemy_lich,
        player_alchemist,
        player_knight,
        player_ranger
    };
    
    private static readonly sounds:{[alias:string]: string} = {

    };

    // these are NOT loaded async 
    private static readonly animations:{[alias:string]: AnimationJson} = {
        fx_death: fx_death_anim,
        fx_levelup: fx_levelup_anim,
        fx_manaburst: fx_manaburst_anim,
        fx_rez: fx_rez_anim,
        enemy_ghoul: enemy_ghoul_anim,
        enemy_lich: enemy_lich_anim,
        enemy_grave_knight: enemy_grave_knight_anim,
        player_alchemist: player_alchemist_anim,
        player_knight: player_knight_anim,
        player_ranger: player_ranger_anim
    };

    public static loadAssets(cb:(errSrcs?:string[])=>void):void{
        const assets:LoadAssets = {
            images: Object.values(this.images),
            sounds: Object.values(this.sounds),
        };

        AssetLoader.loadMany(assets, cb);
    }

    public static purgeAssetCache():void{
        AssetLoader.clearImageCache();
        AssetLoader.clearSoundCache();
    }

    public static getImage(alias:string):HTMLImageElement{
        if(alias in this.images){
            const src:string = this.images[alias];
            return AssetLoader.getCachedImage(src);
        }
        return null;
    }

    public static getImageSrc(alias:string):string{
        return this.images[alias];
    }

    public static getSound(alias:string):HTMLAudioElement{
        if(alias in this.sounds){
            const src:string = this.sounds[alias];
            return AssetLoader.getCachedSound(src);
        }
        return null;
    }

    public static getAnimJson(alias:string):AnimationJson{
        return this.animations[alias];
    }
}