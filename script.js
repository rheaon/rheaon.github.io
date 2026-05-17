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
    let email = 'rheaon@qq.com';
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
// ========================
// ✨ 鼠标移动小星星特效 ✨
// ========================

(function() {
    // 星星的颜色池（粉嫩系）
    const colors = [
        '#FFB6C1', // 浅粉红
        '#FFC0CB', // 粉红
        '#FF69B4', // 热粉红
        '#FFB07C', // 杏色
        '#FFD700', // 金色
        '#FFA07A', // 亮鲑鱼
        '#FF85B3'  // 樱花粉
    ];

    // 创建画布
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;
    let lastTime = 0;

    // 设置画布样式（覆盖全屏，不干扰点击）
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';  // 让鼠标可以穿透画布
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    // 星星粒子类
    class StarParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 4;  // 4~12px
            this.color = color;
            this.alpha = 1;
            this.decay = 0.02 + Math.random() * 0.03;  // 消失速度
            this.vx = (Math.random() - 0.5) * 2;  // 轻微飘动
            this.vy = (Math.random() - 0.5) * 2 - 0.5; // 轻微向上飘
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            this.size *= 0.98;
            return this.alpha > 0;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            
            // 画四角星形状 ✨
            let spikes = 4;
            let outerRadius = this.size;
            let innerRadius = this.size * 0.4;
            
            for (let i = 0; i < spikes * 2; i++) {
                let radius = i % 2 === 0 ? outerRadius : innerRadius;
                let angle = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 4;
                let x = this.x + Math.cos(angle) * radius;
                let y = this.y + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // 调整画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 鼠标移动时生成星星
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        let now = Date.now();
        // 控制生成频率，避免太多星星（每30ms最多一个）
        if (now - lastTime < 30) return;
        lastTime = now;
        
        // 随机颜色
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        // 一次生成 1~3 个星星
        let starCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < starCount; i++) {
            let offsetX = (Math.random() - 0.5) * 10;
            let offsetY = (Math.random() - 0.5) * 10;
            particles.push(new StarParticle(mouseX + offsetX, mouseY + offsetY, color));
        }
        
        // 限制最大粒子数（避免卡顿）
        if (particles.length > 150) {
            particles = particles.slice(-100);
        }
    });

    // 动画循环
    function animate() {
        if (!ctx) return;
        
        // 清空画布（使用透明清除，制造拖尾效果）
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新并绘制所有粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            let alive = particles[i].update();
            if (alive) {
                particles[i].draw(ctx);
            } else {
                particles.splice(i, 1);
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // 可选：点击时额外爆出一圈星星
    document.addEventListener('click', function(e) {
        let color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 8; i++) {
            let angle = (Math.PI * 2 * i) / 8;
            let offsetX = Math.cos(angle) * 8;
            let offsetY = Math.sin(angle) * 8;
            let star = new StarParticle(e.clientX + offsetX, e.clientY + offsetY, color);
            star.vx = (Math.random() - 0.5) * 3;
            star.vy = (Math.random() - 0.5) * 3 - 1;
            particles.push(star);
        }
    });
})();
// ========================
// 🌤️ 可折叠天气组件 🌤️
// ========================
// 天气描述中文翻译
function translateWeatherDesc(desc) {
    const translations = {
        'Sunny': '晴天',
        'Clear': '晴朗',
        'Partly cloudy': '局部多云',
        'Cloudy': '多云',
        'Overcast': '阴天',
        'Light rain': '小雨',
        'Moderate rain': '中雨',
        'Heavy rain': '大雨',
        'Rain': '雨',
        'Thunderstorm': '雷阵雨',
        'Snow': '雪',
        'Light snow': '小雪',
        'Fog': '雾',
        'Mist': '薄雾',
        'Haze': '霾'
    };
    return translations[desc] || desc;
}
(async function() {
    // 可以改成你喜欢的城市
    const DEFAULT_CITY = '南京';
    
    // 天气图标映射
    function getWeatherIcon(weatherCode, isDay) {
        if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
        if (weatherCode >= 300 && weatherCode < 400) return '🌧️';
        if (weatherCode >= 500 && weatherCode < 600) return '🌧️';
        if (weatherCode >= 600 && weatherCode < 700) return '❄️';
        if (weatherCode >= 700 && weatherCode < 800) return '🌫️';
        if (weatherCode === 800) return isDay ? '☀️' : '🌙';
        if (weatherCode === 801) return isDay ? '🌤️' : '☁️';
        if (weatherCode === 802) return '☁️';
        if (weatherCode === 803 || weatherCode === 804) return '☁️';
        return '🌈';
    }
    
    // 获取天气数据
    async function fetchWeather(city) {
        try {
            const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data || !data.current_condition) {
                throw new Error('获取天气失败');
            }
            
            const current = data.current_condition[0];
            const area = data.nearest_area[0];
            
            return {
                temp: current.temp_C,
                desc: current.weatherDesc[0].value,
                weatherCode: parseInt(current.weatherCode),
                isDay: current.isDayTime === '1',
                location: area.areaName[0].value,
                humidity: current.humidity,
                windSpeed: current.windspeedKmph
            };
        } catch (error) {
            console.error('天气API出错:', error);
            return null;
        }
    }
    
    // 备用API
    async function fetchWeatherBackup() {
        try {
            const lat = 32.06;
            const lon = 118.78;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia/Shanghai`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data || !data.current_weather) {
                throw new Error('获取天气失败');
            }
            
            const current = data.current_weather;
            let desc = '';
            if (current.temperature > 28) desc = '炎热';
            else if (current.temperature > 20) desc = '温暖';
            else if (current.temperature > 10) desc = '凉爽';
            else if (current.temperature > 0) desc = '寒冷';
            else desc = '极寒';
            
            return {
                temp: Math.round(current.temperature),
                desc: desc,
                weatherCode: current.weathercode || 800,
                isDay: true,
                location: '南京',
                humidity: '--',
                windSpeed: current.windspeed
            };
        } catch (error) {
            console.error('备用天气API出错:', error);
            return null;
        }
    }
    
    // 更新紧凑栏（只显示图标、温度、城市）
    function updateCompact(weather) {
        const smallIcon = document.getElementById('weatherSmallIcon');
        const smallTemp = document.getElementById('weatherSmallTemp');
        const smallCity = document.getElementById('weatherSmallCity');
        
        if (smallIcon && weather) {
            smallIcon.textContent = getWeatherIcon(weather.weatherCode, weather.isDay);
        }
        if (smallTemp && weather) {
            smallTemp.textContent = `${weather.temp}°C`;
        }
        if (smallCity && weather) {
            let cityName = weather.location;
            if (cityName.length > 8) cityName = cityName.slice(0, 6) + '..';
            smallCity.textContent = cityName;
        }
    }
    
    // 更新详细面板
    async function updateDetail() {
        const weatherInfo = document.getElementById('weatherInfo');
        if (!weatherInfo) return;
        
        weatherInfo.innerHTML = '<div class="weather-loading">🌤️ 加载详细天气...</div>';
        
        let weather = await fetchWeather(DEFAULT_CITY);
        if (!weather) {
            weather = await fetchWeatherBackup();
        }
        
        if (!weather) {
            weatherInfo.innerHTML = '<div class="weather-loading">⚠️ 加载失败<br>点击刷新重试</div>';
            return;
        }
        
        const icon = getWeatherIcon(weather.weatherCode, weather.isDay);
        
        weatherInfo.innerHTML = `
    <div class="weather-icon">${icon}</div>
    <div class="weather-temp">${weather.temp}°C</div>
    <div class="weather-desc">${translateWeatherDesc(weather.desc)}</div>
    <div class="weather-city">📍 ${weather.location}</div>
    <div style="font-size: 12px; color: #999; margin-top: 8px;">
        💧 湿度 ${weather.humidity}% &nbsp;|&nbsp; 🌬️ 风速 ${weather.windSpeed} km/h
    </div>
`;
        
        return weather;
    }
    
    // 初始化天气（加载紧凑栏和详情）
    async function initWeather() {
        // 先加载紧凑栏数据
        let weather = await fetchWeather(DEFAULT_CITY);
        if (!weather) {
            weather = await fetchWeatherBackup();
        }
        
        if (weather) {
            updateCompact(weather);
        } else {
            const smallCity = document.getElementById('weatherSmallCity');
            if (smallCity) smallCity.textContent = '加载失败';
        }
        
        // 预加载详情（但不显示）
        await updateDetail();
    }
    
    // 折叠/展开功能
    function setupToggle() {
        const header = document.getElementById('weatherHeader');
        const detail = document.getElementById('weatherDetail');
        const expandBtn = document.getElementById('weatherExpandBtn');
        
        if (!header || !detail) return;
        
        header.onclick = function(e) {
            // 防止点到刷新按钮时触发
            if (e.target.classList && e.target.classList.contains('weather-refresh')) {
                return;
            }
            
            const isHidden = detail.style.display === 'none';
            if (isHidden) {
                detail.style.display = 'block';
                if (expandBtn) expandBtn.classList.add('rotated');
            } else {
                detail.style.display = 'none';
                if (expandBtn) expandBtn.classList.remove('rotated');
            }
        };
    }
    
    // 刷新按钮功能
    function setupRefresh() {
        const refreshBtn = document.getElementById('refreshWeatherBtn');
        if (!refreshBtn) return;
        
        refreshBtn.onclick = async function(e) {
            e.stopPropagation();  // 防止触发折叠
            
            const oldText = refreshBtn.textContent;
            refreshBtn.textContent = '刷新中...';
            
            // 刷新详细面板
            const weather = await updateDetail();
            if (weather) {
                updateCompact(weather);
            }
            
            setTimeout(() => {
                refreshBtn.textContent = oldText;
            }, 800);
        };
    }
    
    // 启动
    function start() {
        const weatherCard = document.getElementById('weatherCard');
        if (!weatherCard) return;
        
        initWeather();
        setupToggle();
        setupRefresh();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
// ========================
// 🎵 正在听的音乐卡片（图片封面版）🎵
// ========================

(function() {
    // 你的歌单 - 可以放本地图片路径或网络图片链接
    const playlist = [
        {
            title: "The Bird Song",
            artist: "Noah Floersch",
            cover: "歌曲/The Bird Song.jpg", 
            review: "She was a bird, I was an arrow."
        },
        {
            title: "ヒッチコック(希区柯克)",
            artist: "ヨルシカ",
            cover: "歌曲/希区柯克.jpg",
            review: "无论何时都想被风吹着，只想看着蓝天，也是一种任性吗"
        },
        {
            title: "花鳥風月",
            artist: "SEKI NO OWARI",
            cover: "歌曲/花鸟风月.jpg",
            review: "夏の空を見上げる"
        },
        {
            title: "再见以前先说再见",
            artist: "陶喆",
            cover: "歌曲/再见以前先说再见.jpg",
            review: "请你给我一个拥抱，为我祝福和祈祷"
        },
        {
            title: "Creepin' up on You",
            artist: "Darren Hayes",
            cover: "歌曲/Creepin' up on You.jpg",
            review: "No one else can love you like I do."
        },
        {
            title: "メガネを外して",
            artist: "乃紫",
            cover: "歌曲/相反的你和我.jpg",
            review: "所有人保持苹果肌扁平！"
        },
        {
            title: "I LOVE ME!",
            artist: "友成空",
            cover: "歌曲/I LOVE ME.jpg",
            review: "Yeah, I love me."
        },
        {
            title: "革命道中 - On The Way",
            artist: "アイナ・ジ・エンド",
            cover: "歌曲/革命道中.jpg",
            review:"感觉有点中二气息"
        },
        {
            title: "周末画报",
            artist: "薛凯琪",
            cover: "歌曲/周末画报.jpg",
            review: "犹如周末递来，一张画报"
        },
        {
            title: "情绪回收站",
            artist: "失落花园_",
            cover: "歌曲/情绪回收站.jpg",
            review: "纯音乐，请欣赏"
        },
        {
            title: "蝴蝶",
            artist: "陶喆",
            cover: "歌曲/蝴蝶.jpg",
            review: "每次一见到你，心里好平静"
        },
        {
            title: "想和你迎着台风去看海",
            artist: "桑拿猫黑糖/洛天依",
            cover: "歌曲/想和你迎着台风看海.jpg",
            review: "我们顶着被风吹乱的头发，一起唱呐呐呐"
        },
        {
            title: "her",
            artist: "JVKE",
            cover: "歌曲/her.jpg",
            review: "I didn't know what I was looking for,till I found her."

    ];
    
    let currentIndex = 0;
    
    // 获取DOM元素
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    const musicCoverImg = document.getElementById('musicCoverImg');
    const musicReview = document.getElementById('musicReview');
    const prevBtn = document.getElementById('prevMusicBtn');
    const nextBtn = document.getElementById('nextMusicBtn');
    const randomBtn = document.getElementById('randomMusicBtn');
    
    // 更新显示的音乐
    function updateMusic(index) {
        const song = playlist[index];
        if (!song) return;
        
        // 更新封面图片
        if (song.cover) {
            musicCoverImg.src = song.cover;
        } else {
            // 没有图片时的占位
            musicCoverImg.src = '';
            musicCoverImg.style.background = "linear-gradient(135deg, #ffb6c1, #ff69b4)";
        }
        
        // 更新文字信息
        musicTitle.textContent = song.title;
        musicArtist.textContent = song.artist;
        musicReview.textContent = `“${song.review}”`;
        
        // 添加切换动画
        const card = document.querySelector('.music-card');
        if (card) {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        }
        
        // 保存当前索引到localStorage
        localStorage.setItem('currentMusicIndex', index);
    }
    
    // 下一首
    function nextMusic() {
        currentIndex = (currentIndex + 1) % playlist.length;
        updateMusic(currentIndex);
    }
    
    // 上一首
    function prevMusic() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        updateMusic(currentIndex);
    }
    
    // 随机一首
    function randomMusic() {
        let newIndex = Math.floor(Math.random() * playlist.length);
        while (newIndex === currentIndex && playlist.length > 1) {
            newIndex = Math.floor(Math.random() * playlist.length);
        }
        currentIndex = newIndex;
        updateMusic(currentIndex);
    }
    
    // 加载上次听的歌
    function loadSavedMusic() {
        const savedIndex = localStorage.getItem('currentMusicIndex');
        if (savedIndex !== null && savedIndex >= 0 && savedIndex < playlist.length) {
            currentIndex = parseInt(savedIndex);
        } else {
            currentIndex = Math.floor(Math.random() * playlist.length);
        }
        updateMusic(currentIndex);
    }
    
    // 绑定事件
    function bindEvents() {
        if (prevBtn) prevBtn.onclick = prevMusic;
        if (nextBtn) nextBtn.onclick = nextMusic;
        if (randomBtn) randomBtn.onclick = randomMusic;
    }
    
    // 启动
    function init() {
        const musicCard = document.querySelector('.music-card');
        if (!musicCard) return;
        
        loadSavedMusic();
        bindEvents();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();