/* Data and state */
const initialCoins = 100;
const cardData = [
    { id: 'nat-emergency', name: 'National Emergency Number', sub: 'National Emergency', number: '999', category: 'All', icon: 'assets/emergency.png' },
    { id: 'police', name: 'Police Helpline Number', sub: 'Police', number: '999', category: 'Police', icon: 'assets/police.png' },
    { id: 'fire', name: 'Fire Service Number', sub: 'Fire Service', number: '999', category: 'Fire', icon: 'assets/fire-service.png' },
    { id: 'ambulance', name: 'Ambulance Service', sub: 'Ambulance', number: '1994-999999', category: 'Health', icon: 'assets/ambulance.png' },
    { id: 'women', name: 'Women & Child Helpline', sub: 'Women & Child Helpline', number: '109', category: 'Help', icon: 'assets/emergency.png' },
    { id: 'anti-corruption', name: 'Anti-Corruption Helpline', sub: 'Anti-Corruption', number: '106', category: 'Govt.', icon: 'assets/emergency.png' },
    { id: 'electricity', name: 'Electricity Helpline', sub: 'Electricity Outage', number: '16216', category: 'Electricity', icon: 'assets/emergency.png' },
    { id: 'brac', name: 'Brac Helpline', sub: 'Brac', number: '16445', category: 'NGO', icon: 'assets/brac.png' },
    { id: 'railway', name: 'Bangladesh Railway Helpline', sub: 'Bangladesh Railway', number: '163', category: 'Travel', icon: 'assets/Bangladesh-Railway.png' },
];

const state = {
    hearts: 0,
    coins: initialCoins,
    copies: 0,
    history: [],
};

/* Helpers */
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function formatTime(date) {
    // local time like 02:35 PM, 2025-08-29
    const d = date ?? new Date();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${time}, ${yyyy}-${mm}-${dd}`;
}

function alertMsg(message) {
    window.alert(message);
}

/* Render functions */
function renderCounters() {
    $('#heartCount').textContent = state.hearts;
    $('#coinCount').textContent = state.coins;
    $('#copyCount').textContent = state.copies;
}

function createCard(item) {
    const tpl = $('#cardTemplate');
    const node = tpl.content.firstElementChild.cloneNode(true);

    node.dataset.id = item.id;
    $('.name', node).textContent = item.name;
    $('.sub', node).textContent = item.sub || '';
    $('.hotline-number', node).textContent = item.number;
    $('.badge', node).textContent = item.category;
    const media = $('.card-media', node);
    media.innerHTML = '';
    if (item.icon) {
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = `${item.name} icon`;
        media.appendChild(img);
    }

    $('.heart-btn', node).addEventListener('click', () => {
        state.hearts += 1;
        renderCounters();
    });

    $('.copy-btn', node).addEventListener('click', async () => {
        const textToCopy = item.number;
        try {
            await navigator.clipboard.writeText(textToCopy);
            state.copies += 1;
            renderCounters();
            alertMsg(`Copied ${item.name} number: ${textToCopy}`);
        } catch (e) {
            alertMsg('Copy failed. Please allow clipboard permissions.');
        }
    });

    $('.call-btn', node).addEventListener('click', () => {
        if (state.coins < 20) {
            alertMsg('Not enough coins. Each call costs 20 coins.');
            return;
        }
        const now = new Date();
        const timeLabel = formatTime(now);
        alertMsg(`Calling ${item.name} at ${item.number}`);
        state.coins -= 20;
        renderCounters();
        state.history.push({ name: item.name, number: item.number, at: timeLabel });
        renderHistory();
    });

    return node;
}

function renderCards() {
    const grid = $('#cardsGrid');
    grid.innerHTML = '';
    cardData.forEach(item => {
        const card = createCard(item);
        grid.appendChild(card);
    });
}

function renderHistory() {
    const list = $('#historyList');
    list.innerHTML = '';
    const tpl = $('#historyItemTemplate');
    state.history.forEach(entry => {
        const li = tpl.content.firstElementChild.cloneNode(true);
        $('.history-name', li).textContent = entry.name;
        $('.history-number', li).textContent = entry.number;
        $('.history-time', li).textContent = entry.at;
        list.appendChild(li);
    });
}

/* Events */
function bindGlobalEvents() {
    $('#clearHistoryBtn').addEventListener('click', () => {
        state.history = [];
        renderHistory();
    });
}

/* Init */
function init() {
    renderCounters();
    renderCards();
    renderHistory();
    bindGlobalEvents();
}

document.addEventListener('DOMContentLoaded', init);


