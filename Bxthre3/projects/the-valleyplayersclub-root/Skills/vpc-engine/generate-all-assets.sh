#!/bin/bash
# VPC Asset Batch Generator
# Run when you have credits or alternative generation available

cd /home/workspace/Bxthre3/projects/the-valleyplayersclub-project

# === PHARAOHS GOLD (Slots - Egypt) ===
echo "Generating Pharaohs Gold assets..."
python3 Skills/vpc-engine/engine.py build --id pharaohs-gold-egypt-20260407-100347 > .gen/pharaohs-gold-prompts.txt

# === SPACE HUNTER (Shooter) ===
echo "Generating Space Hunter assets..."
python3 Skills/vpc-engine/engine.py build --id space-hunter-space-20260407-100346 > .gen/space-hunter-prompts.txt

# === JUNGLE JEWELS (Match-3) ===
echo "Generating Jungle Jewels assets..."
python3 Skills/vpc-engine/engine.py build --id jungle-jewels-jungle-20260407-100346 > .gen/jungle-jewels-prompts.txt

# === CRYPTO DROP (Plinko) ===
echo "Generating Crypto Drop assets..."
python3 Skills/vpc-engine/engine.py build --id crypto-drop-crypto-20260407-100347 > .gen/crypto-drop-prompts.txt

echo "All prompts generated. Run individual generation commands from .gen/ folder"