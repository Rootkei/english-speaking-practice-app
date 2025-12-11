// ===== Configuration =====
const CONFIG = {
    maxSentences: 10,
    // Backend API endpoint (configured in config.js)
    apiEndpoint: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.API_BASE_URL)
        ? APP_CONFIG.API_BASE_URL + '/api/generate-sentences'
        : 'http://localhost:5000/api/generate-sentences',
    themeStorageKey: 'theme_preference',
    historyStorageKey: 'vocabulary_history',
    bookmarksStorageKey: 'bookmarked_sentences',
    sentenceCountKey: 'sentence_count_preference',
    speechRateKey: 'speech_rate_preference',
    voicePreferenceKey: 'voice_preference',
    genderPreferenceKey: 'gender_preference',
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
    // Theme
    themeToggle: document.getElementById('themeToggle'),

    // History & Bookmarks
    historyBtn: document.getElementById('historyBtn'),
    bookmarksBtn: document.getElementById('bookmarksBtn'),
    bookmarkCount: document.getElementById('bookmarkCount'),
    historyModal: document.getElementById('historyModal'),
    bookmarksModal: document.getElementById('bookmarksModal'),
    closeHistory: document.getElementById('closeHistory'),
    closeBookmarks: document.getElementById('closeBookmarks'),
    historyList: document.getElementById('historyList'),
    bookmarksList: document.getElementById('bookmarksList'),
    clearHistory: document.getElementById('clearHistory'),

    // Buy Me Coffee
    buyMeCoffeeBtn: document.getElementById('buyMeCoffeeBtn'),
    coffeeModal: document.getElementById('coffeeModal'),
    closeCoffee: document.getElementById('closeCoffee'),

    // Sentence Count
    sentenceCount: document.getElementById('sentenceCount'),

    // Pronunciation
    speechRate: document.getElementById('speechRate'),
    voiceSelect: document.getElementById('voiceSelect'),
    genderSelect: document.getElementById('genderSelect'),

    // Toast
    toast: document.getElementById('toast'),

    // User Settings
    toggleUserSettings: document.getElementById('toggleUserSettings'),
    userSettingsContent: document.getElementById('userSettingsContent'),

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

// ===== Initialize =====
function init() {
    // Initialize theme
    initTheme();

    // Initialize features
    initSentenceCount();
    updateBookmarkCount();
    initVoiceSettings();

    console.log(`✓ Backend API: ${CONFIG.apiEndpoint}`);

    // Add event listeners
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.toggleUserSettings.addEventListener('click', toggleUserSettings);
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.randomBtn.addEventListener('click', handleRandom);
    elements.wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    });

    // History & Bookmarks
    elements.historyBtn.addEventListener('click', () => {
        displayHistory();
        openModal(elements.historyModal);
    });
    elements.bookmarksBtn.addEventListener('click', () => {
        displayBookmarks();
        openModal(elements.bookmarksModal);
    });
    elements.closeHistory.addEventListener('click', () => closeModal(elements.historyModal));
    elements.closeBookmarks.addEventListener('click', () => closeModal(elements.bookmarksModal));
    elements.clearHistory.addEventListener('click', clearAllHistory);

    // Buy Me Coffee
    elements.buyMeCoffeeBtn.addEventListener('click', () => {
        openModal(elements.coffeeModal);
    });
    elements.closeCoffee.addEventListener('click', () => closeModal(elements.coffeeModal));

    // Sentence Count
    elements.sentenceCount.addEventListener('change', updateSentenceCount);

    // Pronunciation
    elements.speechRate.addEventListener('change', updateSpeechRate);
    elements.voiceSelect.addEventListener('change', updateVoicePreference);
    elements.genderSelect.addEventListener('change', updateGenderPreference);

    // Close modals on background click
    elements.historyModal.addEventListener('click', (e) => {
        if (e.target === elements.historyModal) closeModal(elements.historyModal);
    });
    elements.bookmarksModal.addEventListener('click', (e) => {
        if (e.target === elements.bookmarksModal) closeModal(elements.bookmarksModal);
    });
    elements.coffeeModal.addEventListener('click', (e) => {
        if (e.target === elements.coffeeModal) closeModal(elements.coffeeModal);
    });
}

// ===== Theme Functions =====
function initTheme() {
    // Get saved theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem(CONFIG.themeStorageKey) || 'dark';

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);

    console.log(`✓ Theme initialized: ${savedTheme}`);
}

function toggleTheme() {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Toggle to opposite theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save to localStorage
    localStorage.setItem(CONFIG.themeStorageKey, newTheme);

    console.log(`✓ Theme changed to: ${newTheme}`);
}

// ===== Settings Functions =====
function toggleUserSettings() {
    const isExpanded = elements.userSettingsContent.classList.toggle('expanded');
    elements.toggleUserSettings.querySelector('.toggle-arrow').style.transform =
        isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
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
    // Show loading
    showLoading();

    try {
        const sentences = await fetchSentencesFromBackend(word);
        displaySentences(word, sentences);
    } catch (error) {
        console.error('Error generating sentences:', error);
        showToast(`Error: ${error.message}`, 'error');
        elements.sentencesContainer.innerHTML = `
            <div class="error-message">
                <h3>❌ Failed to generate sentences</h3>
                <p>${error.message}</p>
                <p>Please make sure the backend server is running.</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

async function fetchSentencesFromBackend(word) {
    const requestBody = {
        word: word,
        maxSentences: CONFIG.maxSentences
    };

    const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const sentences = await response.json();

    // Validate response
    if (!Array.isArray(sentences) || sentences.length === 0) {
        throw new Error('No sentences generated');
    }

    return sentences;
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

    // Make highlighted words clickable for pronunciation
    makeWordsClickable();

    // Save to history
    saveToHistory(word, sentences);
}

function createSentenceCard(sentence, number, word) {
    const card = document.createElement('div');
    card.className = 'sentence-card';

    // Highlight the word in the sentence
    const highlightedText = highlightWord(sentence.text, word);

    // Check if bookmarked
    const bookmarked = isBookmarked(word, sentence.text);

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
        <div class="sentence-actions">
            <button class="action-btn bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-word="${word}" aria-label="Bookmark">
                ${bookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
            </button>
            <button class="action-btn copy-btn" aria-label="Copy">
                📋 Copy
            </button>
        </div>
    `;

    // Add click event to play button
    const playBtn = card.querySelector('.play-btn');
    playBtn.addEventListener('click', () => speakSentence(sentence.text, playBtn));

    // Add bookmark button event
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', () => {
        if (bookmarkBtn.classList.contains('bookmarked')) {
            // Find and remove bookmark
            const bookmarks = loadBookmarks();
            const bookmark = bookmarks.find(b => b.word === word && b.sentence.text === sentence.text);
            if (bookmark) {
                removeBookmark(bookmark.id);
                bookmarkBtn.classList.remove('bookmarked');
                bookmarkBtn.innerHTML = '☆ Bookmark';
            }
        } else {
            addBookmark(word, sentence);
            bookmarkBtn.classList.add('bookmarked');
            bookmarkBtn.innerHTML = '⭐ Bookmarked';
        }
    });

    // Add copy button event
    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        copyToClipboard(sentence.text);
    });

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

    // Use user's pronunciation settings
    const voice = getPreferredVoice();
    const rate = parseFloat(elements.speechRate.value);

    if (voice) {
        utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

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

    console.log(`🔊 Speaking sentence (${voice?.name || 'default'}, ${rate}x)`);
}

function showLoading() {
    elements.loadingIndicator.classList.remove('hidden');
    elements.currentWord.classList.add('hidden');
    elements.sentencesContainer.innerHTML = '';
}

function hideLoading() {
    elements.loadingIndicator.classList.add('hidden');
}

// ===== History Functions =====
function saveToHistory(word, sentences) {
    const history = loadHistory();
    const historyItem = {
        id: Date.now(),
        word: word,
        sentences: sentences,
        createdAt: new Date().toISOString()
    };

    history.unshift(historyItem); // Add to beginning

    // Keep only last 50 items
    if (history.length > 50) {
        history.splice(50);
    }

    localStorage.setItem(CONFIG.historyStorageKey, JSON.stringify(history));
    console.log(`✓ Saved "${word}" to history`);
}

function loadHistory() {
    const data = localStorage.getItem(CONFIG.historyStorageKey);
    return data ? JSON.parse(data) : [];
}

function deleteHistoryItem(id) {
    let history = loadHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(CONFIG.historyStorageKey, JSON.stringify(history));
    displayHistory();
    showToast('History item deleted', 'success');
}

function clearAllHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem(CONFIG.historyStorageKey);
        displayHistory();
        showToast('All history cleared', 'success');
    }
}

function displayHistory() {
    const history = loadHistory();
    const container = elements.historyList;

    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 No history yet</p>
                <p class="empty-hint">Start generating sentences to build your learning history!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="item-header">
                <span class="item-word">${item.word}</span>
                <span class="item-date">${formatDate(item.createdAt)}</span>
            </div>
            <div class="item-actions">
                <button class="item-btn" onclick="loadHistoryItem(${item.id})">📖 View</button>
                <button class="item-btn delete" onclick="deleteHistoryItem(${item.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function loadHistoryItem(id) {
    const history = loadHistory();
    const item = history.find(h => h.id === id);
    if (item) {
        elements.wordInput.value = item.word;
        displaySentences(item.word, item.sentences);
        closeModal(elements.historyModal);
        showToast(`Loaded "${item.word}"`, 'success');
    }
}

// ===== Bookmarks Functions =====
function addBookmark(word, sentence) {
    const bookmarks = loadBookmarks();
    const bookmarkId = `${word}_${Date.now()}`;

    const bookmark = {
        id: bookmarkId,
        word: word,
        sentence: sentence,
        createdAt: new Date().toISOString()
    };

    bookmarks.unshift(bookmark);
    localStorage.setItem(CONFIG.bookmarksStorageKey, JSON.stringify(bookmarks));
    updateBookmarkCount();
    showToast('Sentence bookmarked!', 'success');
    console.log(`✓ Bookmarked sentence from "${word}"`);
}

function removeBookmark(id) {
    let bookmarks = loadBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== id);
    localStorage.setItem(CONFIG.bookmarksStorageKey, JSON.stringify(bookmarks));
    displayBookmarks();
    updateBookmarkCount();
    showToast('Bookmark removed', 'success');
}

function loadBookmarks() {
    const data = localStorage.getItem(CONFIG.bookmarksStorageKey);
    return data ? JSON.parse(data) : [];
}

function isBookmarked(word, sentenceText) {
    const bookmarks = loadBookmarks();
    return bookmarks.some(b => b.word === word && b.sentence.text === sentenceText);
}

function displayBookmarks() {
    const bookmarks = loadBookmarks();
    const container = elements.bookmarksList;

    if (bookmarks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 No bookmarks yet</p>
                <p class="empty-hint">Click the star icon on sentences to bookmark them!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-item">
            <div class="item-header">
                <span class="item-word">${bookmark.word}</span>
                <span class="item-date">${formatDate(bookmark.createdAt)}</span>
            </div>
            <p class="sentence-text">${highlightWord(bookmark.sentence.text, bookmark.word)}</p>
            <p class="sentence-vietnamese">${bookmark.sentence.vietnamese || ''}</p>
            <div class="item-actions">
                <button class="item-btn" onclick="copyToClipboard(\`${escapeQuotes(bookmark.sentence.text)}\`)">📋 Copy</button>
                <button class="item-btn delete" onclick="removeBookmark('${bookmark.id}')">🗑️ Remove</button>
            </div>
        </div>
    `).join('');
}

function updateBookmarkCount() {
    const count = loadBookmarks().length;
    if (count > 0) {
        elements.bookmarkCount.textContent = count;
        elements.bookmarkCount.classList.remove('hidden');
    } else {
        elements.bookmarkCount.classList.add('hidden');
    }
}

// ===== Sentence Count Functions =====
function initSentenceCount() {
    const savedCount = localStorage.getItem(CONFIG.sentenceCountKey) || '10';
    elements.sentenceCount.value = savedCount;
    CONFIG.maxSentences = parseInt(savedCount);
}

function updateSentenceCount() {
    const count = elements.sentenceCount.value;
    CONFIG.maxSentences = parseInt(count);
    localStorage.setItem(CONFIG.sentenceCountKey, count);
    console.log(`✓ Sentence count updated to ${count}`);
}

// ===== Copy to Clipboard =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('❌ Failed to copy', 'error');
    });
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.remove('hidden');

    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

// ===== Modal Functions =====
function openModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// ===== Utility Functions =====
function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

function escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ===== Word Pronunciation Functions =====
let availableVoices = [];

function initVoiceSettings() {
    // Load saved preferences
    const savedRate = localStorage.getItem(CONFIG.speechRateKey) || '1.0';
    const savedVoice = localStorage.getItem(CONFIG.voicePreferenceKey) || 'en-US';
    const savedGender = localStorage.getItem(CONFIG.genderPreferenceKey) || 'female';

    elements.speechRate.value = savedRate;
    elements.voiceSelect.value = savedVoice;
    elements.genderSelect.value = savedGender;

    // Load available voices
    loadVoices();

    console.log(`✓ Voice settings initialized: ${savedVoice} (${savedGender}) at ${savedRate}x speed`);
}

function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
    if (availableVoices.length === 0) {
        // Voices not loaded yet, wait for event
        speechSynthesis.onvoiceschanged = () => {
            availableVoices = speechSynthesis.getVoices();
        };
    }
}

function getPreferredVoice() {
    const localePreference = elements.voiceSelect.value;
    const genderPreference = elements.genderSelect.value;

    // Filter by locale first
    let localeVoices = availableVoices.filter(v => v.lang === localePreference || v.lang.replace('_', '-').startsWith(localePreference));

    // If no exact locale match, try loose match
    if (localeVoices.length === 0) {
        localeVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    }

    // Heuristic mapping for gender based on voice names
    // This isn't perfect as Speech API doesn't standardly expose gender, but works for many common voices (Google, Microsoft)
    let genderVoice = localeVoices.find(v => {
        const name = v.name.toLowerCase();
        if (genderPreference === 'female') {
            return name.includes('super') || name.includes('female') || name.includes('woman') || name.includes('girl') || name.includes('samantha') || name.includes('zira') || name.includes('google us english') || name.includes('google uk english female');
        } else {
            return name.includes('male') && !name.includes('female') || name.includes('man') || name.includes('boy') || name.includes('david') || name.includes('daniel') || name.includes('google uk english male');
        }
    });

    // Fallback logic
    if (!genderVoice) {
        // For Google voices specifically, usually:
        // US English -> Female
        // UK English Female / Male are explicit

        // If we want female and couldn't find explicit female, pick the first one (often female default)
        // If we want male, try to avoid known female names
        if (genderPreference === 'male') {
            genderVoice = localeVoices.find(v => {
                const name = v.name.toLowerCase();
                return !name.includes('female') && !name.includes('woman') && !name.includes('girl') && !name.includes('samantha') && !name.includes('zira');
            });
        }

        // If still nothing, just take the first available for that locale
        if (!genderVoice && localeVoices.length > 0) {
            genderVoice = localeVoices[0];
        }
    }

    // Ultimate fallback if nothing matches locale
    if (!genderVoice && availableVoices.length > 0) {
        genderVoice = availableVoices[0];
    }

    return genderVoice;
}

function updateGenderPreference() {
    const gender = elements.genderSelect.value;
    localStorage.setItem(CONFIG.genderPreferenceKey, gender);
    console.log(`✓ Gender preference updated to ${gender}`);
}

function speakWord(word, element) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    const voice = getPreferredVoice();
    const rate = parseFloat(elements.speechRate.value);

    if (voice) {
        utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Add visual feedback
    if (element) {
        element.classList.add('speaking');
        utterance.onend = () => {
            element.classList.remove('speaking');
        };
    }

    speechSynthesis.speak(utterance);
    console.log(`🔊 Speaking: "${word}" (${voice?.name || 'default'}, ${rate}x)`);
}

function updateSpeechRate() {
    const rate = elements.speechRate.value;
    localStorage.setItem(CONFIG.speechRateKey, rate);
    console.log(`✓ Speech rate updated to ${rate}x`);
}

function updateVoicePreference() {
    const voice = elements.voiceSelect.value;
    localStorage.setItem(CONFIG.voicePreferenceKey, voice);
    console.log(`✓ Voice preference updated to ${voice}`);
}

function makeWordsClickable() {
    // Add click event to all highlighted words
    document.querySelectorAll('.highlight').forEach(wordElement => {
        wordElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = wordElement.textContent.trim();
            speakWord(word, wordElement);
        });
    });
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
