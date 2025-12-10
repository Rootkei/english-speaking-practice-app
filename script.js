// ===== Configuration =====
const CONFIG = {
    maxSentences: 10,
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    storageKey: 'groq_api_key',
    randomWords: [
        'adventure', 'beautiful', 'challenge', 'discover', 'elegant',
        'freedom', 'grateful', 'harmony', 'inspire', 'journey',
        'knowledge', 'luminous', 'magnificent', 'nurture', 'opportunity',
        'passion', 'quality', 'resilient', 'serenity', 'transform',
        'unique', 'vibrant', 'wisdom', 'excellence', 'zenith',
        'achieve', 'believe', 'create', 'dream', 'explore',
        'flourish', 'genuine', 'happiness', 'imagine', 'joyful'
    ]
};

// ===== DOM Elements =====
const elements = {
    // Settings
    toggleSettings: document.getElementById('toggleSettings'),
    settingsContent: document.getElementById('settingsContent'),
    toggleArrow: document.querySelector('.toggle-arrow'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    toggleApiKey: document.getElementById('toggleApiKey'),
    saveApiKey: document.getElementById('saveApiKey'),
    apiStatus: document.getElementById('apiStatus'),

    // Main controls
    wordInput: document.getElementById('wordInput'),
    generateBtn: document.getElementById('generateBtn'),
    randomBtn: document.getElementById('randomBtn'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    currentWord: document.getElementById('currentWord'),
    wordDisplay: document.getElementById('wordDisplay'),
    sentencesContainer: document.getElementById('sentencesContainer')
};

// ===== State Management =====
let currentSpeech = null;
let apiKey = localStorage.getItem(CONFIG.storageKey) || '';

// ===== Initialize =====
function init() {
    // Load saved API key
    if (apiKey) {
        elements.apiKeyInput.value = apiKey;
        showApiStatus('API key loaded from storage', 'success');
    }

    // Add event listeners
    elements.toggleSettings.addEventListener('click', toggleSettings);
    elements.toggleApiKey.addEventListener('click', toggleApiKeyVisibility);
    elements.saveApiKey.addEventListener('click', saveApiKey);
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.randomBtn.addEventListener('click', handleRandom);
    elements.wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    });
}

// ===== Settings Functions =====
function toggleSettings() {
    const isExpanded = elements.settingsContent.classList.toggle('expanded');
    elements.settingsContent.classList.toggle('hidden', !isExpanded);
    elements.toggleArrow.classList.toggle('rotated', isExpanded);
}

function toggleApiKeyVisibility() {
    const type = elements.apiKeyInput.type === 'password' ? 'text' : 'password';
    elements.apiKeyInput.type = type;
    elements.toggleApiKey.textContent = type === 'password' ? '👁️' : '🙈';
}

function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();

    if (!key) {
        showApiStatus('Please enter an API key', 'error');
        return;
    }

    // Basic validation
    if (key.length < 20) {
        showApiStatus('API key seems too short. Please check and try again.', 'error');
        return;
    }

    // Save to localStorage
    localStorage.setItem(CONFIG.storageKey, key);
    apiKey = key;

    showApiStatus('✓ API key saved successfully!', 'success');
}

function showApiStatus(message, type) {
    elements.apiStatus.textContent = message;
    elements.apiStatus.className = `api-status ${type}`;
    elements.apiStatus.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.apiStatus.classList.add('hidden');
    }, 5000);
}

// ===== Main Functions =====
function handleGenerate() {
    const word = elements.wordInput.value.trim();

    if (word) {
        generateSentences(word);
    } else {
        handleRandom();
    }
}

function handleRandom() {
    const randomWord = CONFIG.randomWords[Math.floor(Math.random() * CONFIG.randomWords.length)];
    elements.wordInput.value = randomWord;
    generateSentences(randomWord);
}

async function generateSentences(word) {
    // Check if API key is set
    if (!apiKey) {
        showApiStatus('Please set your Gemini API key first', 'error');
        toggleSettings(); // Open settings
        return;
    }

    // Show loading
    showLoading();

    try {
        const sentences = await fetchSentencesFromGroq(word);
        displaySentences(word, sentences);
    } catch (error) {
        console.error('Error generating sentences:', error);
        showApiStatus(`Error: ${error.message}`, 'error');
        elements.sentencesContainer.innerHTML = `
            <div class="error-message">
                <h3>❌ Failed to generate sentences</h3>
                <p>${error.message}</p>
                <p>Please check your API key and try again.</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

async function fetchSentencesFromGroq(word) {
    const prompt = `Generate exactly ${CONFIG.maxSentences} example sentences using the word "${word}". 
Each sentence should:
1. Use the word "${word}" in a natural, contextual way
2. Be in different contexts (e.g., business, education, personal development, travel, technology, etc.)
3. Be clear and easy to understand for English learners
4. Be between 10-20 words long

Format your response as a JSON array with this structure:
[
  {
    "text": "The sentence using the word ${word}",
    "vietnamese": "Bản dịch tiếng Việt của câu trên",
    "context": "Brief context category (e.g., Business, Education, Travel)",
    "contextVietnamese": "Bản dịch tiếng Việt của context (ví dụ: Kinh doanh, Giáo dục, Du lịch)"
  }
]

IMPORTANT: You must provide accurate Vietnamese translations for both the sentence and the context category.

Return ONLY the JSON array, no additional text or explanation.`;

    const requestBody = {
        model: CONFIG.model,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.9,
        max_tokens: 2048,
        top_p: 0.95
    };

    const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate sentences. Please check your API key.');
    }

    const data = await response.json();

    // Extract the generated text from Groq response
    const generatedText = data.choices[0].message.content;

    // Parse JSON from the response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
        throw new Error('Invalid response format from API');
    }

    const sentences = JSON.parse(jsonMatch[0]);

    // Validate and ensure we have exactly 10 sentences
    if (!Array.isArray(sentences) || sentences.length === 0) {
        throw new Error('No sentences generated');
    }

    return sentences.slice(0, CONFIG.maxSentences);
}

function displaySentences(word, sentences) {
    // Show current word
    elements.wordDisplay.textContent = word;
    elements.currentWord.classList.remove('hidden');

    // Clear previous sentences
    elements.sentencesContainer.innerHTML = '';

    // Create sentence cards
    sentences.forEach((sentence, index) => {
        const card = createSentenceCard(sentence, index + 1, word);
        elements.sentencesContainer.appendChild(card);
    });
}

function createSentenceCard(sentence, number, word) {
    const card = document.createElement('div');
    card.className = 'sentence-card';

    // Highlight the word in the sentence
    const highlightedText = highlightWord(sentence.text, word);

    card.innerHTML = `
        <div class="sentence-header">
            <span class="sentence-number">${number}</span>
            <button class="play-btn" aria-label="Play sentence">
                🔊
            </button>
        </div>
        <p class="sentence-text">${highlightedText}</p>
        <p class="sentence-vietnamese">${sentence.vietnamese || ''}</p>
        <p class="sentence-context">
            <span class="context-label">Context: ${sentence.context}</span>
            ${sentence.contextVietnamese ? `<span class="context-vietnamese"> (${sentence.contextVietnamese})</span>` : ''}
        </p>
    `;

    // Add click event to play button
    const playBtn = card.querySelector('.play-btn');
    playBtn.addEventListener('click', () => speakSentence(sentence.text, playBtn));

    return card;
}

function highlightWord(text, word) {
    // Case-insensitive word highlighting
    const regex = new RegExp(`\\b(${escapeRegex(word)})\\b`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function speakSentence(text, button) {
    // Cancel any ongoing speech
    if (currentSpeech) {
        window.speechSynthesis.cancel();
    }

    // Remove playing class from all buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.classList.remove('playing');
    });

    // Create new speech synthesis
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure speech settings
    utterance.rate = 0.9; // Slightly slower for learning
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use an English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice =>
        voice.lang.startsWith('en-') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en-'));

    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    // Add playing state
    button.classList.add('playing');

    // Event handlers
    utterance.onend = () => {
        button.classList.remove('playing');
        currentSpeech = null;
    };

    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        button.classList.remove('playing');
        currentSpeech = null;
    };

    // Speak
    currentSpeech = utterance;
    window.speechSynthesis.speak(utterance);
}

function showLoading() {
    elements.loadingIndicator.classList.remove('hidden');
    elements.currentWord.classList.add('hidden');
    elements.sentencesContainer.innerHTML = '';
}

function hideLoading() {
    elements.loadingIndicator.classList.add('hidden');
}

// ===== Initialize Speech Synthesis =====
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
} else {
    console.warn('Speech synthesis not supported in this browser');
}

// ===== Start Application =====
init();

console.log('%c🎯 English Speaking Practice', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
console.log('%cPowered by Groq AI', 'color: #22d3ee; font-size: 14px;');
