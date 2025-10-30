# Snake Game (PHP Modular Version)

## Features

- Main menu with username input and game mode selection
- Multiple snake colors and patterns
- Classic Box and Open World gamemodes
- Bots with random styles in Open World mode
- Blue, red, yellow, and special apples (with unique effects)
- Scoreboard (persistent, stored in `scores.json`)
- Modular PHP structure
- Modern, modular JavaScript game logic
- AJAX-based score submission

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
   - Enter your username on the main menu.
   - Choose your snake color, pattern, and gamemode.
   - Play the game and try to get a high score!
   - View the scoreboard to see all scores.

## File Structure

- `index.php` - Main menu and username input
- `game.php` - Game page (canvas and JS)
- `scoreboard.php` - Scoreboard display
- `submit_score.php` - AJAX endpoint for saving scores
- `scores.json` - Score data (auto-created)
- `snakeGame.js` - Classic/box mode JavaScript logic
- `openWorldGame.js` - Open world mode JavaScript logic (bots, camera, etc.)
- `readme.md` - This file

## Planned/Recommended Modular Structure

- `/modules/` - (Recommended) For future modular JS files (bots, apples, camera, scoreboard, etc.)
- `/assets/` - (Recommended) For images, sounds, etc.
- `/css/` - (Recommended) For external stylesheets

## Notes

- No database required; scores are stored in a JSON file.
- For production, secure file permissions and sanitize user input as needed.
- The codebase is being refactored for better modularity and maintainability.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Enjoy the game!
