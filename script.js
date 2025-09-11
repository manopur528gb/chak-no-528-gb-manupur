// نیویگیشن مینو ٹوگل
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

// سرچ فنکشن
function searchContent() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const sections = document.getElementsByTagName('section');
    for (let section of sections) {
        const text = section.innerText.toLowerCase();
        section.style.display = text.includes(input) ? 'block' : 'none';
    }
}

// لائٹ باکس کیلئے گیلری انیشیلیزیشن
document.addEventListener('DOMContentLoaded', () => {
    lightGallery(document.querySelector('.gallery'), {
        speed: 500,
        download: false
    });
});

// کیلنڈر فنکشنز
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function updateCalendar() {
    const monthNames = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
    document.getElementById('calendar-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    // ایونٹس کو دستی طور پر اپ ڈیٹ کریں (مثال کے طور پر)
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = `
        <li><strong>11 ${monthNames[currentMonth]}:</strong> ویب سائٹ کا حتمی لانچ</li>
        <li><strong>15 ${monthNames[currentMonth]}:</strong> گاؤں کا سالانہ میلہ</li>
        <li><strong>20 ${monthNames[currentMonth]}:</strong> گورنمنٹ گرلز سکول میں تعلیمی تقریب</li>
    `;
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

updateCalendar();

// نیوز فنکشن
function addNews() {
    const newsInput = document.getElementById('news-input').value;
    if (newsInput) {
        const newsList = document.getElementById('news-list');
        const li = document.createElement('li');
        li.textContent = newsInput;
        newsList.appendChild(li);
        document.getElementById('news-input').value = '';
    }
}

// چیٹ بوٹ فنکشنز
let isVoiceOn = false;
let recognition = null;

function toggleVoice() {
    isVoiceOn = !isVoiceOn;
    const toggleButton = document.getElementById('toggle-voice');
    toggleButton.textContent = isVoiceOn ? 'آواز بند' : 'آواز آن';
    if (isVoiceOn) {
        speak('سلام! میں مانوپور چیٹ بوٹ ہوں، آپ کیسے مدد کر سکتا ہوں؟');
    }
}

function speak(text) {
    if ('speechSynthesis' in window && isVoiceOn) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ur-PK'; // اردو کے لیے
        utterance.rate = 0.9; // بھاری آواز
        utterance.pitch = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

function startSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'ur-PK';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            document.getElementById('chatbot-input').value = speechResult;
            sendMessage();
        };

        recognition.onerror = function(event) {
            console.error('صوتی ان پٹ میں خرابی:', event.error);
        };

        recognition.start();
        document.getElementById('mic-button').classList.add('active');
    } else {
        alert('صوتی ان پٹ آپ کے براؤزر میں سپورٹ شدہ نہیں۔ Chrome استعمال کریں۔');
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input').value;
    if (input) {
        const chatBody = document.getElementById('chatbot-body');
        const userMessage = document.createElement('p');
        userMessage.textContent = input;
        userMessage.className = 'user-message';
        chatBody.appendChild(userMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        // بوت کا جواب
        let botResponse = '';
        if (input.toLowerCase().includes('سلام')) {
            botResponse = 'وا علیکم السلام! میں آپ کی کس طرح مدد کر سکتا ہوں؟';
        } else if (input.toLowerCase().includes('تاریخ')) {
            botResponse = 'مانوپور کی تاریخ 1887ء میں شروع ہوئی جب گوگیرہ برانچ نہر نے اسے زرخیز بنایا۔ مزید جاننے کے لیے ویب سائٹ کے "تاریخی پس منظر" سیکشن کو دیکھیں۔';
        } else if (input.toLowerCase().includes('ثقافت')) {
            botResponse = 'مانوپور کی ثقافت میں کبڈی، مساجد، اور روایتی کھانوں جیسے جلیبی شامل ہیں۔ مزید تفصیلات "مذہبی و ثقافتی پہلو" میں ملاحظہ کریں۔';
        } else {
            botResponse = 'معذرت، میں اس سوال کا جواب نہیں جانتا۔ براہ کرم کچھ اور پوچھیں یا "مدد" کہیں۔';
        }

        const botMessage = document.createElement('p');
        botMessage.textContent = botResponse;
        botMessage.className = 'bot-message';
        chatBody.appendChild(botMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        if (isVoiceOn) {
            speak(botResponse);
        }

        document.getElementById('chatbot-input').value = '';
        if (recognition) {
            recognition.stop();
            document.getElementById('mic-button').classList.remove('active');
        }
    }
}

// اینیمیشنز
const sections = document.querySelectorAll('.animate-section');
const options = {
    threshold: 0.1
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
