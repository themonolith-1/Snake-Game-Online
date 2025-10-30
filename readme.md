# 🎮 PIXEL SQUARKE - The Ultimate Retro Snake Experience

**A modern, neon-styled remake of the classic Snake game with advanced features and stunning visuals.**

## ✨ Features

- **🎨 Modern Neon UI Design**: Cyberpunk-inspired interface with animated backgrounds and glowing effects
- **🎪 Enhanced Main Menu**: Interactive player customization with real-time previews
- **🐍 13 Snake Styles**: From classic neon green to rainbow and fire effects
- **🎭 7 Visual Patterns**: Solid, striped, dotted, gradient, outline, glow, and checkered patterns
- **🏟️ Two Game Modes**: Classic arena and open world with AI bots
- **🤖 AI Bot System**: Intelligent bots with random styles in Open World mode
- **🍎 Special Apple Types**: Blue, red, yellow, and special apples with unique effects
- **🏆 Dynamic Leaderboard**: Persistent scoring with animated rankings
- **⚡ Smooth Animations**: CSS3 animations and transitions throughout
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🎹 Enhanced Controls**: WASD + Arrow keys + Space for pause

## Setup Instructions

1. **Requirements**
   - PHP 7.0+ (with file write permissions)
   - A web browser

2. **Installation**
   - Download or clone this repository.
   - Place the folder in your web server's root directory (e.g., `htdocs` for XAMPP, `www` for WAMP, or your server's public directory).

3. **File Permissions**
   - Ensure the web server can write to `scores.json` (or the directory, if the file does not exist yet).
   - On Linux/Mac, you may need to run:
     ```
     chmod 666 scores.json
     ```
     or
     ```
     touch scores.json && chmod 666 scores.json
     ```

4. **Running the Game**
   - Start your local PHP server (if not using Apache/Nginx):
     ```
     php -S localhost:8000
     ```
   - Open your browser and go to:
     ```
     http://localhost:8000/index.php
     ```
     or the appropriate URL for your setup.

5. **Gameplay**
   - Enter your player name on the main menu
   - Choose from 13 snake styles (Neon Green, Electric Blue, Rainbow, Fire, etc.)
   - Select a visual effect (Solid, Glow, Gradient, Striped, etc.)
   - Pick your battle arena (Classic Arena or Open World Battle)
   - Use WASD or Arrow Keys to control your snake
   - Press Space to pause/resume the game
   - Collect apples to grow and increase your score
   - Compete for the top spot on the Hall of Fame leaderboard!

## 📁 File Structure

- `index.php` - **Main Menu**: Neon-styled player customization interface
- `game.php` - **Game Arena**: Enhanced game canvas with modern UI
- `scoreboard.php` - **Hall of Fame**: Animated leaderboard with rankings
- `submit_score.php` - **Score API**: AJAX endpoint for saving high scores
- `scores.json` - **Score Database**: Persistent score storage (auto-created)
- `snakeGame.js` - **Classic Mode**: Traditional arena gameplay logic
- `openWorldGame.js` - **Open World**: Advanced mode with AI bots and camera
- `LICENSE` - **MIT License**: Open-source license information
- `readme.md` - **Documentation**: This comprehensive guide

## 🚀 Game Features Breakdown

### 🎨 **Visual Styles**
- **Snake Colors**: Neon Green, Electric Blue, Cyber Orange, Mystic Purple, Hot Pink, Laser Red, Solar Yellow, Digital Cyan, Ghost White, RGB Rainbow, Flame Effect, Aqua Crystal, Forest Matrix
- **Visual Effects**: Solid Block, Striped, Dotted Matrix, Gradient Flow, Neon Outline, Glow Effect, Checkered

### 🏟️ **Game Modes**
- **Classic Arena**: Traditional bounded gameplay with walls
- **Open World Battle**: Infinite scrolling world with AI competitors

### 🎮 **Enhanced UI Elements**
- Animated background grid with moving patterns
- Glowing neon borders with rotating gradients  
- Real-time color previews in selection menus
- Smooth loading transitions and hover effects
- Cyberpunk-themed typography (Orbitron & Space Mono fonts)

## 📋 Planned Modular Structure

- `/modules/` - Modular JS components (bots, apples, camera, effects)
- `/assets/` - Game assets (sounds, images, fonts)
- `/css/` - External stylesheets for themes
- `/themes/` - Additional UI themes (retro, minimal, etc.)

## 📝 Technical Notes

- **No Database Required**: All scores stored in lightweight JSON format
- **Modern CSS3**: Utilizes advanced animations, gradients, and effects
- **Responsive Design**: Mobile-optimized interface with touch controls
- **Performance Optimized**: Efficient rendering and smooth 60fps gameplay
- **Cross-Browser Compatible**: Works on all modern browsers
- **Progressive Enhancement**: Graceful fallbacks for older browsers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Enjoy the game!
