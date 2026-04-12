import fs from 'fs';
import path from 'path';

/**
 * REFINED GENERATE 100 SLOTS SCRIPT
 * Creates 100 unique slot configurations following existing platform patterns:
 * - slots-lines: 3 rows, 5 reels, explicit paylines, includes BLANKs.
 * - slots-scatter: 4 rows, 5 reels, 8/10/12 match counts.
 */

const BASE_PATH = path.join(process.cwd(), 'src/games/configs/slots');

const THEMES = [
    // Ancient Civilizations
    "Aztec Eclipse", "Pharaohs Secret", "Roman Conquest", "Olympian Might", "Mayan Gold",
    "Spartan Spirit", "Vikings Voyage", "Samurai Shadow", "Persian Pearls", "Celtic Charm",
    "Incans Treasure", "Trojans Horse", "Shoguns Decree", "Babylon Gardens", "Sphinx Enigma",
    // Sci-Fi / Cyberpunk
    "Neon City", "Mars Odyssey", "Robot Revolution", "Quantum Quest", "Galaxy Glitch",
    "Cyborg Syndicate", "Plasma Core", "Techno Temple", "Silicon Valley", "Zero Gravity",
    "Event Horizon", "Stellar Syndicate", "Neural Network", "Void Runner", "Binary Star",
    "Atmosphere Alpha", "Circuit Breaker", "Deep Space 9", "Android Alley", "Warp Drive",
    // Fantasy & Magic
    "Dragon Lair", "Wizard Tower", "Fairy Forest", "Alchemy Lab", "Ghostly Gavel",
    "Mermaids Song", "Unicorn Utopia", "Vampire Vault", "Witchs Brew", "Magic Carpet",
    "Forbidden Scroll", "Crystal Caves", "Phoenix Rising", "Thunder God", "Spirit Realm",
    "Goblins Hoard", "Elven Empire", "Mystic Moon", "Spellbound", "Ancient Artifact",
    // Nature / Wildlife
    "Amazon Jungle", "Serengeti Sun", "Arctic Tundra", "Coral Reef", "Safari Sands",
    "Eagle Eye", "Tiger Temple", "Wolf Pack", "Panda Paradise", "Lion Pride",
    "Gorilla Grove", "Leopard Leap", "Falcon Flight", "Owl Oracle", "Bear Bash",
    // Pop Culture / Abstract
    "80s Retro", "Steampunk Steam", "Graffiti Groove", "Candy Blast", "Retro Reels",
    "Neon Nights", "Pixel Party", "Vinyl Vibes", "Arcade Action", "Pop Art",
    // Luxury / Vegas Classic
    "Diamond Vault", "High Roller", "Golden 7s", "Royal Palace", "Luxury Life",
    "Cash Crown", "Millionaire Maker", "Billionaire Bash", "Prestige Poker", "Elite Estate",
    "Grand Gala", "Mega Moolah", "Jackpot Junction", "Ruby Riches", "Emerald Eye",
    "Sapphire Sky", "Platinum Plate", "Gold Rush", "Silver Stream", "Bronze Blaze"
];

const MATH_ARCHETYPES = [
    { name: "grinder", volatility: "low", hitFreq: 0.35, rtp: 0.98 },
    { name: "whale", volatility: "high", hitFreq: 0.15, rtp: 0.94 },
    { name: "balanced", volatility: "medium", hitFreq: 0.25, rtp: 0.96 },
    { name: "scatter", volatility: "medium-high", hitFreq: 0.20, rtp: 0.95 },
    { name: "classic", volatility: "low-medium", hitFreq: 0.30, rtp: 0.97 }
];

const SYMBOLS_BY_CATEGORY: any = {
    mythology: ["TRIDENT", "PEARL", "SHELL", "WILD", "ANKH", "EYE", "SCARAB"],
    scifi: ["CORE", "PLASMA", "DRONE", "WILD", "CHIP", "LASER", "NEON"],
    fantasy: ["DRAGON", "SCROLL", "WAND", "WILD", "POTION", "SWORD", "SHIELD"],
    nature: ["TIGER", "PAW", "CLAW", "WILD", "LEAF", "FRUIT", "TREE"],
    classic: ["CHERRY", "BAR", "7", "WILD", "LEMON", "BELL", "DIAMOND"]
};

const STANDARD_PAYLINES = [
    // Standard horizontal and V/Inverse V lines
    [{"row": 1, "col": 0}, {"row": 1, "col": 1}, {"row": 1, "col": 2}, {"row": 1, "col": 3}, {"row": 1, "col": 4}],
    [{"row": 0, "col": 0}, {"row": 0, "col": 1}, {"row": 0, "col": 2}, {"row": 0, "col": 3}, {"row": 0, "col": 4}],
    [{"row": 2, "col": 0}, {"row": 2, "col": 1}, {"row": 2, "col": 2}, {"row": 2, "col": 3}, {"row": 2, "col": 4}],
    [{"row": 0, "col": 0}, {"row": 1, "col": 1}, {"row": 2, "col": 2}, {"row": 1, "col": 3}, {"row": 0, "col": 4}],
    [{"row": 2, "col": 0}, {"row": 1, "col": 1}, {"row": 0, "col": 2}, {"row": 1, "col": 3}, {"row": 2, "col": 4}],
    // Diagonals and more
    [{"row": 0, "col": 0}, {"row": 0, "col": 1}, {"row": 1, "col": 2}, {"row": 2, "col": 3}, {"row": 2, "col": 4}],
    [{"row": 2, "col": 0}, {"row": 2, "col": 1}, {"row": 1, "col": 2}, {"row": 0, "col": 3}, {"row": 0, "col": 4}],
    [{"row": 1, "col": 0}, {"row": 0, "col": 1}, {"row": 0, "col": 2}, {"row": 0, "col": 3}, {"row": 1, "col": 4}],
    [{"row": 1, "col": 0}, {"row": 2, "col": 1}, {"row": 2, "col": 2}, {"row": 2, "col": 3}, {"row": 1, "col": 4}],
    [{"row": 0, "col": 0}, {"row": 1, "col": 1}, {"row": 0, "col": 2}, {"row": 1, "col": 3}, {"row": 0, "col": 4}],
    [{"row": 2, "col": 0}, {"row": 1, "col": 1}, {"row": 2, "col": 2}, {"row": 1, "col": 3}, {"row": 2, "col": 4}]
];

function getCategory(theme: string) {
    if (theme.includes("Robot") || theme.includes("Neon") || theme.includes("Space")) return "scifi";
    if (theme.includes("Dragon") || theme.includes("Wizard") || theme.includes("Magic")) return "fantasy";
    if (theme.includes("Jungle") || theme.includes("Safari") || theme.includes("Tundra")) return "nature";
    if (theme.includes("Diamond") || theme.includes("7") || theme.includes("Cash")) return "classic";
    return "mythology";
}

async function run() {
    console.log(`🎰 Refining 100 Slot Themes...`);

    // Guard: Preserve existing hand-crafted games
    const EXCLUDED = ["poseidon", "cyberSlots", "pharaohsGold"];

    for (let i = 0; i < THEMES.length; i++) {
        const themeName = THEMES[i];
        const id = themeName.toLowerCase().replace(/ /g, '-').replace(/[^a-z-]/g, '');
        
        if (EXCLUDED.includes(id)) continue;

        const gameDir = path.join(BASE_PATH, id);
        const profilesDir = path.join(gameDir, 'profiles');

        if (!fs.existsSync(profilesDir)) {
            fs.mkdirSync(profilesDir, { recursive: true });
        }

        const category = getCategory(themeName);
        const symbols = SYMBOLS_BY_CATEGORY[category];
        const archetype = MATH_ARCHETYPES[i % MATH_ARCHETYPES.length];
        const isLines = i % 2 === 0;

        // Strip configuration
        let finalSymbols = [...symbols];
        if (isLines) finalSymbols.push("BLANK");

        // Manifest
        const manifest: any = {
            name: themeName,
            theme: category,
            category: "slots",
            evaluatorType: isLines ? "slots-lines" : "slots-scatter",
            reels: Array(5).fill(null).map(() => 
                Array(18).fill(null).map(() => finalSymbols[Math.floor(Math.random() * finalSymbols.length)])
            ),
            rows: isLines ? 3 : 4
        };

        if (isLines) {
            manifest.paylines = STANDARD_PAYLINES;
        }

        // Profile
        const paytable: any = {};
        symbols.forEach((s: string) => {
            if (isLines) {
                paytable[s] = {
                    "3": Math.floor(Math.random() * 5) + 2,
                    "4": Math.floor(Math.random() * 20) + 10,
                    "5": Math.floor(Math.random() * 80) + 40
                };
            } else {
                paytable[s] = {
                    "8": Math.floor(Math.random() * 2) + 1,
                    "10": Math.floor(Math.random() * 5) + 3,
                    "12": Math.floor(Math.random() * 50) + 20
                };
            }
        });

        const profile = {
            profileName: "standard",
            minBet: isLines ? 1 : 10,
            maxBet: 1000,
            volatility: archetype.volatility,
            rtp: archetype.rtp,
            paytable
        };

        fs.writeFileSync(path.join(gameDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
        fs.writeFileSync(path.join(profilesDir, 'standard.json'), JSON.stringify(profile, null, 2));

        if (i % 10 === 0) console.log(`   [${i}/100] Created ${themeName} (${manifest.evaluatorType})`);
    }

    console.log(`✅ Finished refining 100 themes in ${BASE_PATH}`);
}

run().catch(console.error);
