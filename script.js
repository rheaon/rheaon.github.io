const SUPABASE_URL = "https://lzubeowxtlqmtypzgxrv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWJlb3d4dGxxbXR5cHpneHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NzYxOTgsImV4cCI6MjA5MTQ1MjE5OH0.Fsjs0ZqdJ5V-cdkdLAgJxgwKpUHEp3kO4MIRnhy7pEo";

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
if (document.getElementById('visitCount')) {
    document.getElementById('visitCount').innerText = visitCount;
}


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

let currentPage = 1;
const pageSize = 5;  // 每页显示5条留言
let totalMessages = 0; 

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
            currentPage = 1; 
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
        // 1. 先获取总留言数
        let countRes = await fetch(SUPABASE_URL + "/rest/v1/messages?select=id", {
            headers: { "apikey": SUPABASE_KEY }
        });
        let allData = await countRes.json();
        totalMessagesCount = allData.length;
        
        // 2. 计算偏移量
        let start = (currentPage - 1) * pageSize;
        
        // 3. 分页获取留言
        let res = await fetch(
            SUPABASE_URL + `/rest/v1/messages?select=*&order=created_at.desc&limit=${pageSize}&offset=${start}`,
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
        
        // 4. 添加分页按钮
        addPaginationControls();
        
    } catch (error) {
        console.error("加载留言出错:", error);
        document.getElementById("msgList").innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">加载留言失败，请刷新重试</div>';
    }
}

// 添加分页按钮
function addPaginationControls() {
    let totalPages = Math.ceil(totalMessagesCount / pageSize);
    
    // 移除旧的分页控件
    let oldControls = document.getElementById("paginationControls");
    if (oldControls) {
        oldControls.remove();
    }
    
    // 创建分页控件
    let paginationDiv = document.createElement("div");
    paginationDiv.id = "paginationControls";
    paginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin-top: 20px;
        padding: 10px;
    `;
    
    // 上一页按钮
    let prevBtn = document.createElement("button");
    prevBtn.textContent = "⬅ 上一页";
    prevBtn.style.cssText = `
        background: pink;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    if (currentPage === 1) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = "0.5";
        prevBtn.style.cursor = "not-allowed";
    }
    prevBtn.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            loadMessages();
        }
    };
    
    // 页码显示
    let pageSpan = document.createElement("span");
    pageSpan.textContent = `第 ${currentPage} / ${totalPages || 1} 页`;
    pageSpan.style.cssText = `
        color: #666;
        font-size: 14px;
    `;
    
    // 下一页按钮
    let nextBtn = document.createElement("button");
    nextBtn.textContent = "下一页 ➡";
    nextBtn.style.cssText = `
        background: pink;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    if (currentPage >= totalPages) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = "0.5";
        nextBtn.style.cursor = "not-allowed";
    }
    nextBtn.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadMessages();
        }
    };
    
    paginationDiv.appendChild(prevBtn);
    paginationDiv.appendChild(pageSpan);
    paginationDiv.appendChild(nextBtn);
    
    // 添加到留言板
    let msgBoard = document.querySelector('.message-board');
    msgBoard.appendChild(paginationDiv);
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
            // 重新获取总数
            let countRes = await fetch(SUPABASE_URL + "/rest/v1/messages?select=id", {
                headers: { "apikey": SUPABASE_KEY }
            });
            let allData = await countRes.json();
            let newTotal = allData.length;
            let totalPages = Math.ceil(newTotal / pageSize);
            
            // 如果当前页没有数据了且不是第一页，跳到上一页
            if (currentPage > totalPages && currentPage > 1) {
                currentPage--;
            }
            loadMessages();
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

// 补充缺失的函数
function copyEmail() {
    let email = '3253808852@qq.com';
    navigator.clipboard.writeText(email);
    showToast('邮箱已复制~');
}

function changeQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteP.innerHTML = quotes[randomIndex];
}

// 页面加载时获取留言
document.addEventListener("DOMContentLoaded", function() {
    loadMessages();
});
/*
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
});*/
