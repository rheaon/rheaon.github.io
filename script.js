// JavaScript source code
let btn = document.getElementById('skinBtn');
btn.onclick = function() {
    document.body.classList.toggle('dark');
}

let copyBtn = document.getElementById('copyEmailBtn');
copyBtn.onclick = function() {
    let email = '3253808852@qq.com';
    navigator.clipboard.writeText(email);
    let toast = document.getElementById('toastMsg');
    toast.textContent = '邮箱已复制';
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);
}
///////////////////////留言板//////////////////////////////
let submitBtn = document.getElementById('submitMsgBtn');
let msgListDiv = document.getElementById('msgList');
let messages = [];

function loadMessages() {
    let saved = localStorage.getItem('messages');
    if (saved) {
        messages = JSON.parse(saved);
        displayMessages();
    }
}

function saveMessages() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

function displayMessages() {
    msgListDiv.innerHTML = '';
    for (let i = 0; i < messages.length; i++) {
        let msgDiv = document.createElement('div');
        msgDiv.className = 'msg-item';
        msgDiv.innerHTML = '<strong>' + messages[i].name + '</strong> 说：<br>' + messages[i].content;
        msgListDiv.appendChild(msgDiv);
    }
}

submitBtn.onclick = function() {
    let name = document.getElementById('msgName').value;
    let content = document.getElementById('msgContent').value;

    if (name === '' || content === '') {
        let toast = document.getElementById('toastMsg');
        toast.textContent = '请填写名字和留言内容';
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
        }, 2000);
        return;
    }

    messages.push({ name: name, content: content });
    saveMessages();
    displayMessages();

    document.getElementById('msgName').value = '';
    document.getElementById('msgContent').value = '';

    let toast = document.getElementById('toastMsg');
    toast.textContent = '留言已提交';
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);
}

loadMessages();
/////////////////////////每日一句//////////////////////////////
let quotes = [
    "✨ 且将新火试新茶，诗酒趁年华 ✨",
    "🌸 人生若只如初见，何事秋风悲画扇 🌸",
    "🍰 人生如逆旅，我亦是行人 🍰",
    "🎵 速度70迈，心情是自由自在 🎵",
];
let quoteP = document.getElementById('randomQuote');
let quoteBtn = document.getElementById('quoteBtn');
///////////////////////////拜访人数///////////////////////////
quoteBtn.onclick = function() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteP.innerHTML = quotes[randomIndex];
}

let visitCount = localStorage.getItem('visitCount');
if (visitCount === null) {
    visitCount = 1;
} else {
    visitCount = Number(visitCount) + 1;
}
localStorage.setItem('visitCount', visitCount);
document.getElementById('visitCount').innerText = visitCount;


let hobbyItems = document.querySelectorAll('.hobby-item');

for (let i = 0; i < hobbyItems.length; i++) {
    hobbyItems[i].onclick = function() {
        let targetId = this.getAttribute('data-target');
        let target = document.getElementById(targetId);
        
        if (target.style.display === 'none') {
            target.style.display = 'block';
        } else {
            target.style.display = 'none';
        }
    }
}
///////////////////////显示时间///////////////////////
function updateTime() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let timeString = '现在是' + year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;
    document.getElementById('liveTime').innerText = timeString;
}
updateTime();
setInterval(updateTime, 1000);
//////统计留言/////////
function updateMsgCount() {
let count = messages.length;
let msgCountSpan = document.getElementById('msgCount');
if (msgCountSpan) {
msgCountSpan.innerText = count;
}
}

///////////////////////返回顶部///////////////////////
let backBtn = document.getElementById('backToTop');

window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backBtn.style.display = 'block';
    } else {
        backBtn.style.display = 'none';
    }
}

backBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}