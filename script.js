/* ===========================
   script.js — Combined System for Manopur Village Website
   - Integrates LightGallery, News, Calendar, and a smarter Chatbot
   - Provides direct, contextual answers
   - Comprehensive Q&A system with TTS and Speech Recognition support
   =========================== */

/* ---------- LightGallery Initialization ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const galleryElements = document.querySelectorAll('[data-lightgallery="gallery"]');
    galleryElements.forEach(element => {
        lightGallery(element, {
            thumbnail: true,
            animateThumb: false,
            showThumbByDefault: false
        });
    });

    // Chatbot functionality
    setupChatbot();
    
    // News and Calendar functionality
    setupNews();
    setupCalendar();
    
    // Navigation Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const menu = document.getElementById('nav-menu');
            menu.classList.toggle('active');
        });
    }

    // Scroll Animation
    const sections = document.querySelectorAll('.animate-section');
    const options = {
        root: null,
        threshold: 0.2,
        rootMargin: "0px"
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
});

/* ---------- News and Calendar Functions ---------- */
function setupNews() {
    const addNewsBtn = document.getElementById('add-news-btn');
    const newsInput = document.getElementById('news-input');
    const newsList = document.getElementById('news-list');
    
    if (addNewsBtn && newsInput && newsList) {
        addNewsBtn.addEventListener('click', () => {
            if (newsInput.value.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = newsInput.value;
                newsList.appendChild(li);
                newsInput.value = '';
            }
        });
    }
}

let currentMonth = 8; // September 2025 (0-11)
const months = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];

function updateCalendar() {
    document.getElementById('calendar-month').textContent = `${months[currentMonth]} 2025`;
}

function setupCalendar() {
    const prevBtn = document.querySelector('.calendar-nav button:first-child');
    const nextBtn = document.querySelector('.calendar-nav button:last-child');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
            updateCalendar();
        });
        nextBtn.addEventListener('click', () => {
            currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
            updateCalendar();
        });
    }
    updateCalendar();
}

/* ---------- Chatbot System ---------- */
function setupChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbot = document.getElementById('chatbot');
    const closeChatbotBtn = document.getElementById('close-chatbot');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('send-button');
    const micButton = document.getElementById('mic-button');

    // Load voices and set a male voice preference
    let maleVoice = null;
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        maleVoice = voices.find(voice => 
            (voice.lang === 'ur-PK' || voice.lang === 'ur-IN') && 
            (voice.name.includes('male') || voice.name.includes('Zira'))
        );
        if (!maleVoice) {
            maleVoice = voices.find(voice => voice.lang.startsWith('ur'));
        }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    if (chatbotToggle && chatbot) {
        chatbotToggle.addEventListener('click', () => {
            chatbot.classList.add('active');
            speak('السلام علیکم! میں مانوپور چیٹ بوٹ ہوں۔ آپ کیسے مدد کر سکتا ہوں؟');
        });
    }

    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', () => {
            chatbot.classList.remove('active');
            window.speechSynthesis.cancel();
        });
    }

    if (sendButton) sendButton.addEventListener('click', sendMessage);
    if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    if (micButton) micButton.addEventListener('click', startSpeechRecognition);

    // This data structure is now more comprehensive
    const qaPairs = {
        'greetings': ['سلام', 'اسلام علیکم', 'ہائے', 'ہیلو', 'آداب', 'assalam', 'asalamoalikum', 'as-salam'],
        'location': ['مانوپور کہاں ہے', 'پنڈ کتھے اے', 'محل وقوع', 'پنڈ دی لوکیشن', 'مانوپور دا نقشہ', 'نقشہ', 'محل وقوع کی تفصیلات'],
        'history': ['مانوپور کی تاریخ', 'پنڈ دی تریخ', 'تاریخی پس منظر', 'گاؤں کب بنا', 'کدو بنیا', 'قدیمی حالات'],
        'personalities': ['مشہور شخصیات', 'پنڈ دے مشہور لوک', 'اہم بندے', 'نمبردار', 'ماسٹر', 'ڈاکٹر', 'فوجی'],
        'shops': ['دکانیں', 'دوکاندار', 'بازار', 'کریانہ سٹور', 'جلیبی'],
        'education': ['تعلیمی ادارے', 'سکول', 'گورنمنٹ سکول', 'تعلیم'],
        'sports': ['کھیل', 'کبڈی', 'کھیت', 'کبڈی دا میچ'],
        'contact': ['رابطہ', 'کنیکٹ', 'فون نمبر', 'ای میل', 'واٹس ایپ'],
        'weather': ['موسم', 'آج کا موسم', 'موسم کیسا ہے'],
        'events': ['ایونٹس', 'تقریبات', 'میلہ', 'کیلنڈر'],
        'hospital': ['ہسپتال', 'ہیلتھ'],
        'crops': ['فصلیں', 'کھیتی', 'گندم', 'گنا', 'چاول'],
        'culture': ['ثقافتی تقریبات', 'میلہ', 'روایت', 'چوپال', 'ثقافت'],
        'hospitality': ['مہمان نوازی', 'مہمان', 'دیسی کھانے', 'پکوڑے'],
        'date-time': ['آج کی تاریخ', 'آج کا دن', 'کیا وقت ہوا ہے'],
        'general': ['مانوپور کی معلومات', 'پنڈ بارے دسو', 'جانکاری', 'کچھ دسو', 'تسی کون او'],
        'admin': ['نعیم حسن ڈوگر', 'ویب سائٹ دا اونر'],
    };

    const chatbotResponses = {
        'greetings': ['وعلیکم السلام! مانوپور کی دنیا میں خوش آمدید۔ آپ کو کس بارے میں جاننا ہے؟', 'وعلیکم السلام! میں مانوپور کے بارے میں آپ کے سوالوں کا جواب دینے کے لیے حاضر ہوں۔', 'وعلیکم السلام! کیسے ہو؟ میں آپ کی کیا مدد کر سکتا ہوں؟'],
        'location': () => document.getElementById('location').querySelector('p').textContent,
        'history': () => document.getElementById('history').querySelector('p').textContent,
        'personalities': () => document.getElementById('personalities').querySelector('p').textContent,
        'shops': () => document.getElementById('shops').querySelector('p').textContent,
        'education': () => document.getElementById('education').querySelector('p').textContent,
        'sports': () => document.getElementById('sports').querySelector('p').textContent,
        'contact': () => document.getElementById('contact').querySelector('ul').textContent.trim().replace(/\s{2,}/g, ' '),
        'weather': () => {
            const now = new Date();
            const time = now.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
            return `آج ${now.toLocaleDateString('ur-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} کو مانوپور میں موسم گرم اور مرطوب ہے، اور وقت شام ${time} بجے ہے۔`;
        },
        'events': () => document.getElementById('events').querySelector('p').textContent,
        'hospital': () => document.getElementById('location').querySelector('p').textContent.split('.').find(s => s.includes('ہسپتال')),
        'crops': () => document.getElementById('agriculture').querySelector('p').textContent.split('.').find(s => s.includes('فصلیں')),
        'culture': () => document.getElementById('culture').querySelector('p').textContent,
        'hospitality': () => document.getElementById('hospitality').querySelector('p').textContent,
        'date-time': () => {
            const now = new Date();
            const date = now.toLocaleDateString('ur-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const time = now.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
            return `آج ${date} ہے، اور وقت شام ${time} بجے ہے۔`;
        },
        'general': 'میں آپ کے سوال کا جواب دینے کے لیے حاضر ہوں۔ آپ مانوپور کی تاریخ، ثقافت، تعلیم، کھیل، یا کسی بھی موضوع کے بارے میں پوچھ سکتے ہیں۔',
        'admin': 'ویب سائٹ کے بنانے والے اور ایڈمن نعیم حسن ڈوگر ہیں، جن کا تعلق مانوپور سے ہے۔',
    };

    function sendMessage() {
        const chatbotBody = document.getElementById('chatbot-body');
        const message = chatbotInput.value.trim();
        if (message === '') return;

        // User message
        chatbotBody.innerHTML += `<p class="user-message"><strong>آپ:</strong> ${message}</p>`;

        let response = 'معاف کریں، میں اس سوال کو سمجھ نہ سکا۔ آپ دوبارہ کوشش کریں یا کوئی اور سوال پوچھیں!';
        let isGreeting = false;
        
        // Normalize user input for better matching
        const normalizedMessage = message.toLowerCase().replace(/[\u0600-\u06FF\s]+/, (match) => match.replace(/\s+/g, ' '));
        
        // Check for greetings first
        if (qaPairs['greetings'].some(q => normalizedMessage.includes(q))) {
            const greetingResponses = chatbotResponses['greetings'];
            response = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
            isGreeting = true;
        }

        // If not a greeting, find a contextual response
        if (!isGreeting) {
            for (const key in qaPairs) {
                if (key === 'greetings') continue; // Skip greetings here
                if (qaPairs[key].some(q => normalizedMessage.includes(q))) {
                    const res = chatbotResponses[key];
                    response = typeof res === 'function' ? res() : res;
                    break;
                }
            }
        }

        // Append bot response
        chatbotBody.innerHTML += `<p class="bot-message"><strong>بوٹ:</strong> ${response}</p>`;
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Clear input
        chatbotInput.value = '';

        // Speak response
        speak(response);
    }

    /* ---------- Voice and Speech Functions ---------- */
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ur-PK';
            if (maleVoice) {
                utterance.voice = maleVoice;
            }
            utterance.volume = 1;
            utterance.rate = 0.9;
            utterance.pitch = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }

    function startSpeechRecognition() {
        const micButton = document.getElementById('mic-button');
        if (!('webkitSpeechRecognition' in window)) {
            alert('معاف کریں، آپ کا براؤزر صوتی ان پٹ کو سپورٹ نہیں کرتا۔ براہ کرم ٹیکسٹ استعمال کریں۔');
            return;
        }
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ur-PK';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        micButton.classList.add('active');
        recognition.start();

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            chatbotInput.value = speechResult;
            sendMessage();
            micButton.classList.remove('active');
        };

        recognition.onerror = function(event) {
            console.error('صوتی شناخت میں خرابی: ', event.error);
            micButton.classList.remove('active');
            alert('صوتی شناخت میں خرابی ہوئی، براہ کرم دوبارہ کوشش کریں۔');
        };

        recognition.onend = function() {
            micButton.classList.remove('active');
        };
    }
}
