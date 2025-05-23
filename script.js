if (!('speechSynthesis' in window)) {
    document.body.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Sorry, your browser does not support the Web Speech API. Please try using a modern browser like Chrome, Edge, or Firefox.</div>';
}

// Get DOM elements
const textToConvert = document.getElementById('textToConvert');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const errorMsg = document.getElementById('errorMsg');
const voiceSelect = document.getElementById('voiceSelect');
const pitchSlider = document.getElementById('pitch');
const pitchValue = document.getElementById('pitchValue');
const rateSlider = document.getElementById('rate');
const rateValue = document.getElementById('rateValue');
const charCount = document.getElementById('charCount');
const themeToggle = document.getElementById('themeToggle');
const pauseBtn = document.getElementById('pauseBtn');

// Initialize speech synthesis API
const synth = window.speechSynthesis;
let voices = [];
let currentUtterance = null;
let isPaused = false;

function populateVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = voices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

// Set voice options when available
synth.onvoiceschanged = populateVoices;

// Update pitch and rate values dynamically
pitchSlider.addEventListener('input', () => {
    pitchValue.textContent = pitchSlider.value;
});
rateSlider.addEventListener('input', () => {
    rateValue.textContent = rateSlider.value;
});

// Modify voice selection handler
voiceSelect.addEventListener('change', () => {
    if (currentUtterance && !synth.speaking) {
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        currentUtterance.voice = selectedVoice;
    }
});

// Modify convert button click handler
convertBtn.addEventListener('click', () => {
    const text = textToConvert.value;

    if (text.trim() === '') {
        errorMsg.textContent = 'Please enter text to convert!';
        return;
    }

    if (synth.speaking && !isPaused) {
        synth.cancel();
        pauseBtn.disabled = true;
        return;
    }

    errorMsg.textContent = '';

    if (!isPaused) {
        currentUtterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        currentUtterance.voice = selectedVoice;
        currentUtterance.pitch = pitchSlider.value;
        currentUtterance.rate = rateSlider.value;

        currentUtterance.onend = () => {
            pauseBtn.disabled = true;
            isPaused = false;
            toggleLoading(false);
        };

        currentUtterance.onerror = () => {
            toggleLoading(false);
            errorMsg.textContent = 'An error occurred while converting text to speech.';
        };

        toggleLoading(true);
    }

    synth.speak(currentUtterance);
    pauseBtn.disabled = false;
    convertBtn.querySelector('.btn-icon').textContent = '⏹️';
    convertBtn.querySelector(':not(.btn-icon)').textContent = 'Stop';
    provideFeedback('Converting text to speech...', false);
});

// Add pause button handler
pauseBtn.addEventListener('click', () => {
    if (synth.speaking) {
        if (isPaused) {
            synth.resume();
            pauseBtn.querySelector('.btn-icon').textContent = '⏯️';
            pauseBtn.querySelector(':not(.btn-icon)').textContent = 'Pause';
        } else {
            synth.pause();
            pauseBtn.querySelector('.btn-icon').textContent = '▶️';
            pauseBtn.querySelector(':not(.btn-icon)').textContent = 'Resume';
        }
        isPaused = !isPaused;
    }
});

// Clear text area and reset character count
clearBtn.addEventListener('click', () => {
    textToConvert.value = '';
    charCount.textContent = 'Characters: 0';
    errorMsg.textContent = ''; // Clear error message
    synth.cancel();
    pauseBtn.disabled = true;
    convertBtn.querySelector('.btn-icon').textContent = '🔊';
    convertBtn.querySelector(':not(.btn-icon)').textContent = 'Play';
    isPaused = false;
});

// Character and word counter logic
textToConvert.addEventListener('input', () => {
    const text = textToConvert.value;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charLength = text.length;
    charCount.textContent = `Characters: ${charLength} | Words: ${wordCount}`;
});

// Dark mode toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '🌞' : '🌙';
    localStorage.setItem('darkMode', isDark);
});

// Load saved theme
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '🌞';
}

// Loading animation
function toggleLoading(show) {
    document.querySelector('.loading').style.display = show ? 'block' : 'none';
}

// Add speech feedback
function provideFeedback(message, isError = false) {
    errorMsg.textContent = message;
    errorMsg.style.color = isError ? '#ff4757' : '#2ed573';
    setTimeout(() => {
        errorMsg.textContent = '';
    }, 3000);
}

// Save user preferences
function savePreferences() {
    const prefs = {
        pitch: pitchSlider.value,
        rate: rateSlider.value,
        voice: voiceSelect.value,
        darkMode: document.body.classList.contains('dark-mode')
    };
    localStorage.setItem('ttsPreferences', JSON.stringify(prefs));
}

// Load user preferences
function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('ttsPreferences'));
    if (prefs) {
        pitchSlider.value = prefs.pitch;
        rateSlider.value = prefs.rate;
        pitchValue.textContent = prefs.pitch;
        rateValue.textContent = prefs.rate;
        if (prefs.darkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '🌞';
        }
    }
}

// Initialize preferences
document.addEventListener('DOMContentLoaded', loadPreferences);

// Save preferences on change
[pitchSlider, rateSlider].forEach(slider => {
    slider.addEventListener('change', savePreferences);
});