import fs from 'fs';
import path from 'path';

/**
 * GENERATE LOCALIZED SKINS SCRIPT
 * Creates 100 new "Skin" files (50 SLV, 50 CO) representing localized IP.
 * These skins link to 'standard-lines' or 'standard-scatter' DNA.
 */

const SKINS_PATH = path.join(process.cwd(), 'src/games/skins');

const SLV_THEMES = [
    "Monte Vista Harvest", "Sandhill Crane Sighting", "Great Sand Dunes Gold", "Sangre de Cristo Peaks",
    "Rio Grande Riches", "UFO Watchtower", "Skinwalker Canyon", "Potato Palace", "Sky-Hi Stampede",
    "San Luis Sunsets", "Zapata Falls", "Fort Garland Ghosts", "The Barley Barrel", "Quinoa Quest",
    "Malting Master", "Head-Gate Hues", "Alamosa Amber", "Antonito Steam", "Moffat Mystery",
    "Saguache Silver", "Center Spud", "Del Norte Drifter", "Creede Crystal", "Wolf Creek Wipeout",
    "Slumgullion Slide", "South Fork Spirit", "Summitville Strike", "Platoro Pulse", "Chama Charm",
    "Cumbres Craft", "Conejos Catch", "Manassa Mauler", "La Jara Legend", "Romeo Riches",
    "Capulin Clover", "Mesa Magic", "Valley View Vibes", "San Acacio Sun", "Old San Luis",
    "Costilla Cash", "Trinchera Treasure", "Blanca Peak", "Ellingwood Edge", "Little Bear Lush",
    "Medano Magic", "Sand Creek Surge", "Music Pass", "Marble Mountain", "Cottonwood Classic"
];

const CO_THEMES = [
    "Leadville Silver", "Cripple Creek Gold", "Aspen Glow", "Vail Powder", "14er Summit",
    "Columbine Cluster", "Black Canyon Abyss", "Red Rocks Rhythm", "Broomfield Bytes", "Craft Brew Cascade",
    "Garden of the Gods", "Rocky Mountain High", "Maroon Bells Magic", "Steamboat Steam", "Teluride Trails",
    "Breckenridge Bold", "Silverton Surge", "Ouray Oracle", "Durango Drift", "Pagosa Pulse",
    "Gunnisons Glory", "Crested Butte", "Salida Spin", "Buena Vista View", "Leadville Legend",
    "Frisco Frost", "Dilton Dash", "Silverthorne Sky", "Copper Catch", "Keystone Key",
    "Georgetown Gold", "Idaho Springs", "Boulder Blast", "Fort Collins Foam", "Loveland Lush",
    "Greeley Grit", "Longmont Luck", "Golden Gavel", "Morrison Magic", "Littleton Luxe",
    "Englewood Edge", "Aurora Aurora", "Parker Plateau", "Castle Rock", "Monument Mystery",
    "Colorado Springs", "Manitou Magic", "Pueblo Pulse", "Canon City", "Florence Flow"
];

const SLV_SYMBOLS = ["CRANE", "POTATO", "DUNES", "MOUNTAIN", "UFO", "BARLEY", "QUINOA"];
const CO_SYMBOLS = ["SKI", "COLUMBINE", "BIKE", "BEER", "GOLD", "SILVER", "EAGLE"];

function generateSkins(themes: string[], symbols: string[], prefix: string) {
    console.log(`🏔️ Generating ${themes.length} ${prefix} Skins...`);
    
    if (!fs.existsSync(SKINS_PATH)) fs.mkdirSync(SKINS_PATH, { recursive: true });

    for (let i = 0; i < themes.length; i++) {
        const name = themes[i];
        const id = `${prefix.toLowerCase()}-${name.toLowerCase().replace(/ /g, '-').replace(/[^a-z-]/g, '')}`;
        const dnaId = i % 2 === 0 ? "standard-lines" : "standard-scatter";
        
        // Map DNA symbols (S1-S5) to localized symbols
        const symbolMap: any = {
            "WILD": "WILD",
            "BLANK": "BLANK"
        };
        for (let j = 0; j < 5; j++) {
            symbolMap[`S${j+1}`] = symbols[j % symbols.length];
        }

        const skin = {
            name,
            theme: prefix.toLowerCase(),
            dnaId,
            symbolMap,
            minBet: i % 2 === 0 ? 1 : 10,
            maxBet: 5000
        };

        fs.writeFileSync(path.join(SKINS_PATH, `${id}.json`), JSON.stringify(skin, null, 2));
    }
}

async function run() {
    generateSkins(SLV_THEMES, SLV_SYMBOLS, "SLV");
    generateSkins(CO_THEMES, CO_SYMBOLS, "CO");
    console.log(`✅ 100 Localized Skins generated in ${SKINS_PATH}`);
}

run().catch(console.error);
