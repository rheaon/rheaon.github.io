// JavaScript source code
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("skinBtn").onclick = () => {
        document.body.classList.toggle("dark");
    };

    // 这里也把其他按钮绑定事件放进来
    document.getElementById("copyEmailBtn").onclick = copyEmail;
    document.getElementById("quoteBtn").onclick = changeQuote;
});

////////////
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
/*let submitBtn = document.getElementById('submitMsgBtn');
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
/////////////////////////
function loadOnlineMessages() {
    let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTdFvJpkcHTwkVcclH6gLhu8BWbJyUiCY4u7riwAK5P3cC41aBHMZ7t8Fg5zypYyw6AgAcZxpF7s8L/pub?output=csv";

    fetch(url)
        .then(res => res.text())
        .then(data => {
            let rows = data.split("\n");
            let html = "";

            for (let i = 1; i < rows.length; i++) { // 跳过表头
                let cols = rows[i].split(",");
                if (cols.length >= 3) {
                    let name = cols[1];
                    let content = cols[2];

                    html += `<div class="msg-item">
                        <strong>${name}</strong>：<br>${content}
                    </div>`;
                }
            }

            document.getElementById("msgList").innerHTML = html;
        });
}
loadOnlineMessages();
function loadOnlineMessages() {
    let url = "https://docs.google.com/forms/d/e/1FAIpQLScATZAyNeMOhfTV41R33YDMhQHWp1xcaahMG0t4W1wx7Nj0Xw/viewform?embedded=true";

    fetch(url)
        .then(res => res.text())
        .then(data => {
            let rows = data.split("\n");
            let html = "";

            for (let i = rows.length - 1; i > 0; i--) { // 倒序显示
                let cols = rows[i].split(",");

                if (cols.length >= 3) {
                    let name = cols[1];
                    let content = cols[2];

                    html += `<div class="msg-item">
                        <strong>${name}</strong>：<br>${content}
                    </div>`;
                }
            }

            document.getElementById("msgList").innerHTML = html;
        });
}

loadOnlineMessages();*/

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
/////////////////
///////////////// Supabase 留言板 /////////////////
const SUPABASE_URL = "https://lzubeowxtlqmtypzgxrv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWJlb3d4dGxxbXR5cHpneHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NzYxOTgsImV4cCI6MjA5MTQ1MjE5OH0.Fsjs0ZqdJ5V-cdkdLAgJxgwKpUHEp3kO4MIRnhy7pEo";

async function submitMessage() {
    let name = document.getElementById("nameInput").value;
    let content = document.getElementById("contentInput").value;

    if (!name || !content) {
        showToast("请填写名字和留言内容~");
        return;
    }

    try {
        let response = await fetch(SUPABASE_URL + "/rest/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY
            },
            body: JSON.stringify({ name, content })
        });

        if (response.ok) {
            document.getElementById("contentInput").value = "";
            document.getElementById("nameInput").value = "";
            showToast("留言已发送！✨");
            loadMessages(); // 重新加载留言
        } else {
            showToast("发送失败，请稍后再试");
        }
    } catch (error) {
        console.error("提交留言出错:", error);
        showToast("网络错误，请稍后再试");
    }
}

async function loadMessages() {
    try {
        let res = await fetch(
            SUPABASE_URL + "/rest/v1/messages?select=*&order=created_at.desc",
            {
                headers: {
                    "apikey": SUPABASE_KEY
                }
            }
        );

        let data = await res.json();
        let html = "";

        for (let msg of data) {
            let time = msg.created_at ? new Date(msg.created_at).toLocaleString() : "刚刚";
            
            html += `
            <div class="msg-item" style="background: #f5f5f5; margin: 10px 0; padding: 12px; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #ff69b4;">💬 ${escapeHtml(msg.name)}</strong>
                    <span style="font-size: 12px; color: #999;">${time}</span>
                </div>
                <div style="margin: 8px 0; color: #333;">${escapeHtml(msg.content)}</div>
                <button onclick="deleteMessage('${msg.id}')" style="background: #ff6b6b; color: white; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 12px;">删除</button>
            </div>`;
        }

        if (data.length === 0) {
            html = '<div style="text-align: center; color: #999; padding: 20px;">暂无留言，来抢沙发吧~ ✨</div>';
        }

        document.getElementById("msgList").innerHTML = html;
    } catch (error) {
        console.error("加载留言出错:", error);
        document.getElementById("msgList").innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">加载留言失败，请刷新重试</div>';
    }
}

async function deleteMessage(id) {
    if (!confirm("确定要删除这条留言吗？")) return;
    
    try {
        let response = await fetch(SUPABASE_URL + "/rest/v1/messages?id=eq." + id, {
            method: "DELETE",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY
            }
        });

        if (response.ok) {
            showToast("留言已删除");
            loadMessages(); // 重新加载留言列表
        } else {
            showToast("删除失败");
        }
    } catch (error) {
        console.error("删除留言出错:", error);
        showToast("删除失败，请稍后再试");
    }
}

// 辅助函数：防止XSS攻击
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// 显示提示信息
function showToast(msg) {
    let toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);
}

// 页面加载时获取留言
document.addEventListener("DOMContentLoaded", function() {
    loadMessages();
    
    // 其他初始化代码...
    document.getElementById("skinBtn").onclick = () => {
        document.body.classList.toggle("dark");
    };
    document.getElementById("copyEmailBtn").onclick = copyEmail;
    document.getElementById("quoteBtn").onclick = changeQuote;
});