#!/usr/bin/env python3
"""Audio Asset Pipeline - SFX and Music generation specs"""
import json
from pathlib import Path
from typing import Dict, List

class AudioPipeline:
    """Generates audio asset specifications for Unity integration"""
    
    SFX_CATEGORIES = {
        "slots": ["spin", "stop", "win_small", "win_medium", "win_big", "win_jackpot", "button_click", "error"],
        "shooter": ["fire", "hit", "explosion", "spawn", "powerup", "reload", "empty", "bonus"],
        "match3": ["swap", "match3", "match4", "match5", "cascade", "shuffle", "powerup_activate"],
        "plinko": ["drop", "bounce", "land_bucket", "multiplier", "jackpot"]
    }
    
    def __init__(self, theme: str):
        self.theme = theme
        self.audio_specs = []
        
    def generate_sfx_specs(self, game_type: str) -> List[Dict]:
        """Generate SFX specifications with theme-appropriate descriptions"""
        
        theme_moods = {
            "western": "spaghetti western, twangy guitar, wooden percussion, tumbleweed whistle",
            "crypto": "digital glitch, electronic blips, futuristic synth, cyberpunk bass",
            "space": "sci-fi hum, laser zap, cosmic whoosh, alien transmission",
            "mythology": "epic orchestra, ancient drum, divine chime, godlike thunder",
            "egypt": "middle eastern flute, desert wind, pharaohic drum, mystical harp",
            "jungle": "tribal drum, tropical bird, waterfall, wooden xylophone",
            "candy": "bubble pop, cute chime, sugary sparkle, playful bounce",
            "vampire": "gothic pipe, bat flutter, blood drip, ominous organ",
            "steampunk": "brass gear clank, steam hiss, clockwork tick, mechanical churn"
        }
        
        mood = theme_moods.get(self.theme, "generic")
        sfx_list = self.SFX_CATEGORIES.get(game_type, ["click", "success", "error"])
        
        specs = []
        for sfx in sfx_list:
            specs.append({
                "id": f"sfx_{sfx}",
                "filename": f"{sfx}.wav",
                "type": "sfx",
                "event": sfx,
                "description": f"{sfx} sound effect - {mood}",
                "duration": "0.5-2s",
                "format": "WAV 44.1kHz 16bit"
            })
        return specs
    
    def generate_music_specs(self, game_type: str) -> List[Dict]:
        """Generate background music loop specifications"""
        
        theme_genres = {
            "western": "western folk, saloon piano, desert ambient",
            "crypto": "synthwave, electronic ambient, cyber lounge",
            "space": "space ambient, sci-fi atmosphere, cosmic drone",
            "mythology": "epic orchestral, divine choir, temple ambience",
            "egypt": "arabic ambient, pyramid mystery, desert night",
            "jungle": "tribal ambient, rainforest, ancient ritual",
            "candy": "cute pop, playful melody, sweet tunes",
            "vampire": "gothic darkwave, haunted castle, blood ritual",
            "steampunk": "mechanical orchestra, brass band, industrial ambient"
        }
        
        genre = theme_genres.get(self.theme, "generic ambient")
        
        return [
            {
                "id": "bgm_lobby",
                "filename": "lobby_music.wav",
                "type": "music",
                "context": "lobby",
                "description": f"Lobby ambient - {genre}, loopable, 60-90 BPM",
                "duration": "60-120s",
                "loop": True,
                "bpm": 75
            },
            {
                "id": "bgm_gameplay",
                "filename": "gameplay_music.wav",
                "type": "music",
                "context": "gameplay",
                "description": f"Gameplay intensity - {genre}, loopable, 100-130 BPM",
                "duration": "60-120s",
                "loop": True,
                "bpm": 110
            },
            {
                "id": "bgm_bonus",
                "filename": "bonus_music.wav",
                "type": "music",
                "context": "bonus",
                "description": f"Bonus round excitement - {genre}, build-up, 120-140 BPM",
                "duration": "30-60s",
                "loop": False,
                "bpm": 130
            }
        ]
    
    def generate_manifest(self, game_type: str) -> Dict:
        """Generate complete audio manifest"""
        return {
            "version": "1.0",
            "theme": self.theme,
            "game_type": game_type,
            "sfx": self.generate_sfx_specs(game_type),
            "music": self.generate_music_specs(game_type),
            "total_assets": len(self.generate_sfx_specs(game_type)) + len(self.generate_music_specs(game_type)),
            "unity_integration": {
                "audio_mixer": f"Mixers/{self.theme}_Mixer.mixer",
                "audio_groups": ["SFX", "Music", "UI", "Ambient"]
            }
        }

if __name__ == "__main__":
    # Test
    pipeline = AudioPipeline("western")
    manifest = pipeline.generate_manifest("slots")
    print(json.dumps(manifest, indent=2))
