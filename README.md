# Text-to-Speech Converter

A web application that converts text to speech with customizable voice, pitch, and rate controls.

## Features

- Text to speech conversion
- Multiple voice options
- Adjustable pitch and rate
- Pause/Resume functionality
- Dark/Light theme toggle
- Character counter
- Responsive design

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Web Speech API

## Usage

1. Enter text in the input area
2. Select desired voice from dropdown
3. Adjust pitch and rate using sliders
4. Click 'Play' to start conversion
5. Use 'Pause/Resume' to control playback
6. Click 'Clear' to reset

## Installation and Running

1. Clone the repository:
   ```bash
   git clone https://github.com/11-V-SriHarsha/Text-To-Audio.git
   cd Text-To-Audio
   ```

2. Running the app:
   - Double click the `index.html` file, or
   - Use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     # OR using Node.js's http-server
     npx http-server
     ```
   - Open your browser and navigate to:
     - If using Python: `http://localhost:8000`
     - If using http-server: `http://localhost:8080`

3. Browser Support:
   - Make sure you're using a modern browser (Chrome recommended)
   - Allow microphone permissions if prompted

## Browser Compatibility

Works best in modern browsers that support the Web Speech API:
- Chrome
- Edge
- Firefox
- Safari
