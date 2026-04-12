#!/bin/bash
#
# Agentic Desktop Installer & Launcher v0.2.0
# Automatically downloads dependencies and runs Agentic Desktop
#

set -e

# Configuration
VERSION="0.2.0"
JAR_URL="https://zo.pub/brodiblanco/agentic-v0.2.0/Agentic-v0.2.0-Desktop.jar"
INSTALL_DIR="$HOME/.agentic"
CONFIG_FILE="$INSTALL_DIR/config.json"

colors() {
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
}

check_java() {
    echo "Checking Java installation..."
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge 17 ]; then
            echo "✓ Java $JAVA_VERSION detected"
            return 0
        fi
    fi
    
    echo "${RED}✗ Java 17+ not found${NC}"
    echo ""
    echo "Install Java 17:"
    echo "  Ubuntu/Debian: sudo apt-get install openjdk-17-jdk"
    echo "  macOS: brew install openjdk@17"
    echo "  Download: https://adoptium.net/"
    exit 1
}

download_jar() {
    echo "Checking for Agentic v$VERSION..."
    
    mkdir -p "$INSTALL_DIR"
    
    if [ -f "$INSTALL_DIR/Agentic-Desktop-$VERSION.jar" ]; then
        echo "✓ Agentic v$VERSION already installed"
        return 0
    fi
    
    echo "Downloading Agentic Desktop v$VERSION..."
    if command -v wget &> /dev/null; then
        wget --progress=bar:force -O "$INSTALL_DIR/Agentic-Desktop-$VERSION.jar" "$JAR_URL" 2>&1 | tail -5
    elif command -v curl &> /dev/null; then
        curl -# -L -o "$INSTALL_DIR/Agentic-Desktop-$VERSION.jar" "$JAR_URL" 2>&1 | tail -5
    else
        echo "${RED}✗ wget or curl required${NC}"
        exit 1
    fi
    
    echo "✓ Download complete"
}

create_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "Creating default config..."
        cat > "$CONFIG_FILE" << 'EOF'
{
    "mesh_server": "https://agentic-mesh-server-brodiblanco.zocomputer.io",
    "node_id": 2,
    "node_name": "DESKTOP",
    "auto_connect": true,
    "theme": "dark"
}
EOF
        echo "✓ Config created at $CONFIG_FILE"
    fi
}

create_launcher() {
    LAUNCHER="$HOME/.local/bin/agentic"
    
    if [ ! -f "$LAUNCHER" ]; then
        echo "Creating system launcher..."
        mkdir -p "$HOME/.local/bin"
        
        cat > "$LAUNCHER" << 'EOF'
#!/bin/bash
# Agentic Desktop Launcher
exec java -Dagentic.config="$HOME/.agentic/config.json" \
          -jar "$HOME/.agentic/Agentic-Desktop-0.2.0.jar" "$@"
EOF
        chmod +x "$LAUNCHER"
        
        # Add to PATH if needed
        if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
            echo "${YELLOW}Note: Run 'source ~/.bashrc' to update PATH${NC}"
        fi
        
        echo "✓ Created 'agentic' command"
        echo "   Usage: agentic"
    fi
}

run_agentic() {
    echo ""
    echo "${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo "${GREEN}║     Starting Agentic Desktop v0.2.0    ║${NC}"
    echo "${GREEN}╚══════════════════════════════════════════╝${NC}"
    echo ""
    
    cd "$INSTALL_DIR"
    
    # Run with proper JVM options
    java \
        -Dagentic.config="$CONFIG_FILE" \
        -Dagentic.version="$VERSION" \
        -Dcompose.desktop.window.width=1280 \
        -Dcompose.desktop.window.height=900 \
        -jar "Agentic-Desktop-$VERSION.jar" \
        "$@" 2>&1 &
    
    PID=$!
    echo "${GREEN}✓ Agentic started (PID: $PID)${NC}"
    echo ""
    echo "Server: https://agentic-mesh-server-brodiblanco.zocomputer.io"
    echo "Node ID: 2 (DESKTOP)"
    echo ""
    echo "Logs: tail -f $INSTALL_DIR/agentic.log"
    
    # Create log file
    exec 1>>"$INSTALL_DIR/agentic.log" 2>&1
}

print_help() {
    cat << 'EOF'
Agentic Desktop Installer v0.2.0

Usage: ./install-agentic.sh [OPTIONS]

Options:
  --install    Download and install only
  --run        Run Agentic (default)
  --reinstall  Re-download and install
  --update     Update to latest version
  --help       Show this help

Examples:
  ./install-agentic.sh           # Install and run
  ./install-agentic.sh --install  # Install only
  ./install-agentic.sh --run      # Run only (if installed)

EOF
}

main() {
    colors
    
    case "${1:-run}" in
        --help|-h)
            print_help
            exit 0
            ;;
        --install)
            check_java
            download_jar
            create_config
            create_launcher
            echo ""
            echo "${GREEN}✓ Installation complete${NC}"
            echo "   Run: ./install-agentic.sh --run"
            ;;
        --run)
            if [ ! -f "$INSTALL_DIR/Agentic-Desktop-$VERSION.jar" ]; then
                echo "Agentic not found. Installing first..."
                check_java
                download_jar
                create_config
                create_launcher
            fi
            run_agentic
            ;;
        --reinstall|--update)
            rm -f "$INSTALL_DIR/Agentic-Desktop-$VERSION.jar" 2>/dev/null || true
            check_java
            download_jar
            create_config
            create_launcher
            run_agentic
            ;;
        *)
            echo "Unknown option: $1"
            print_help
            exit 1
            ;;
    esac
}

main "$@"
