const supabaseUrl = "https://lzubeowxtlqmtypzgxrv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dWJlb3d4dGxxbXR5cHpneHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NzYxOTgsImV4cCI6MjA5MTQ1MjE5OH0.Fsjs0ZqdJ5V-cdkdLAgJxgwKpUHEp3kO4MIRnhy7pEo";
const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);
//写登录//
async function login(){
    const email =
    document.getElementById("email").value;
    const password =
    document.getElementById("password").value;
    const {data,error} =
    await supabaseClient.auth.signInWithPassword({
        email,
        password
    });
    if(error){
        alert(error.message);
        return;
    }
    alert("登录成功");
    loadMonths();
    loadDreams();
}
//读取梦境//
async function loadDreams(){
const {
    data:userData
}=await supabaseClient.auth.getUser();
const user=userData.user;
if(!user){
    alert("请先登录");
    return;
}
let month =
document.getElementById("monthSelect").value;
let query =
supabaseClient
.from("dreams")
.select("*")
.order("date",{ascending:false});
if(month !== "all"){
    query =
    query
    .gte("date", month+"-01")
    .lt("date", getNextMonth(month)+"-01");
}
const {data,error}=await query;
if(error){
console.log(error);
return;
}
const box=
document.getElementById("dreamList");
box.innerHTML="";
data.forEach(dream=>{
box.innerHTML += `
<div class="dream-card">
    <h3 class="dream-date">${dream.date}</h3>
    <h2 class="dream-title">${dream.title}</h2>
    <p class="dream-content">${dream.content}</p>
    <div class="dream-tags">
    ${
        dream.tags
            ? dream.tags.split(",").map(tag => `#${tag}`).join(" ")
            : ""
    }
</div>
</div>
`;
});
}
async function loadMonths(){
    const {data,error}=await supabaseClient
    .from("dreams")
    .select("date")
    .order("date",{ascending:false});
    if(error){
        console.log(error);
        return;
    }
    const select =
    document.getElementById("monthSelect");
    let months=[];
    data.forEach(item=>{
        let month=item.date.slice(0,7);
        if(!months.includes(month)){
            months.push(month);
        }
    });
    months.forEach(month=>{
        select.innerHTML += `
        <option value="${month}">
        ${month}
        </option>
        `;
    });
}
function getNextMonth(month){
let [year,m]=month.split("-");
let date =
new Date(year,m,1);
date.setMonth(
date.getMonth()+1
);
return date
.toISOString()
.slice(0,7);
}
function showAddBox(){
    document.getElementById("addBox")
    .style.display="block";
}
async function addDream(){
const {
    data:userData
}=await supabaseClient.auth.getUser();
const user=userData.user;
if(!user){
    alert("请先登录");
    return;
}
let date =
document.getElementById("dreamDate").value;
let title =
document.getElementById("dreamTitle").value;
let content = 
document.getElementById("dreamContent").value;
const tags = generateTags(content);
const {error}=await supabaseClient 
.from("dreams") 
.insert({ 
    date:date, 
    title:title, 
    content:content, 
    tags:tags.join(","), 
    user_id:user.id 
});
if(error){
    alert(error.message);
    return;
}
alert("保存成功");
loadMonths();
loadDreams();
}
function showImportBox(){
document.getElementById("importBox")
.style.display="block";
}
async function importDreams(){
const text =
document.getElementById("importText").value;
const {
data:userData
}=await supabaseClient.auth.getUser();
const user=userData.user;
if(!user){
alert("请先登录");
return;
}
let dreams = parseDreamText(text);
for(let dream of dreams){ 
const tags = generateTags(dream.content);
await supabaseClient 
.from("dreams") 
.insert({ 
    date: dream.date,
    title: dream.title,
    content: dream.content,
    tags: tags.join(","),
    user_id: user.id
});
}
alert(
"导入完成，共 "+dreams.length+" 条"
);
loadMonths();
loadDreams();
}
function parseDreamText(text){
    let lines = text.split("\n");
    let result = [];
    let current = null;
    // 默认年份
    let currentYear = new Date().getFullYear();
    lines.forEach(line => {
        line = line.trim();
        // 空行直接跳过
        if(!line){
            return;
        }
        // =========================
        // 识别年份：2024 / 2024年
        // =========================
        if(/^\d{4}年?$/.test(line)){
            currentYear = parseInt(line.replace("年",""));
            return;
        }
        // =========================
        // 识别完整日期：
        // 2024.8.7
        // 2024-8-7
        // 2024/8/7
        // =========================
        let fullDateMatch = line.match(
            /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/
        );
        if(fullDateMatch){
            if(current){
                result.push(current);
            }
            let year = fullDateMatch[1];
            let month = fullDateMatch[2].padStart(2,"0");
            let day = fullDateMatch[3].padStart(2,"0");
            current = {
                date: `${year}-${month}-${day}`,
                title: `${month}月${day}日的梦`,
                content: ""
            };
            return;
        }
        // =========================
        // 识别普通日期：
        // 8.7
        // 8-7
        // 8/7
        // =========================
        let shortDateMatch = line.match(
            /^(\d{1,2})[.\-/](\d{1,2})$/
        );
        if(shortDateMatch){
            if(current){
                result.push(current);
            }
            let month = shortDateMatch[1].padStart(2,"0");
            let day = shortDateMatch[2].padStart(2,"0");
            current = {
                date: `${currentYear}-${month}-${day}`,
                title: `${month}月${day}日的梦`,
                content: ""
            };
            return;
        }
        // =========================
        // 普通正文
        // =========================
        if(current){
            current.content += line + "\n";
        }
    });
    if(current){
        result.push(current);
    }
    return result;
}
// 监听整个页面的键盘事件
document.addEventListener('keydown', function(event) {
  // 如果按下的是回车键（keyCode 13 或 key 'Enter'）
  if (event.key === 'Enter') {
    // 检查当前焦点是否在邮箱或密码输入框
    const activeElement = document.activeElement;
    if (activeElement.id === 'email' || activeElement.id === 'password') {
      event.preventDefault(); // 防止意外提交
      login(); // 调用你的登录函数
    }
  }
});
function generateTags(content) {
    const tags = [];
    const rules = {
        "学校": ["学校", "老师", "同学", "上课","健美操", "考试", "作业", "教室", "高中", "大学","小学","课","李娟","开学","食堂"],
        "朋友": ["朋友", "同学", "闺蜜", "好友", "fxy","yst","wq","花久泪"],
        "家人": ["妈妈", "爸爸", "家人","小花子", "姐姐", "hzh", "何子涵"],
        "游戏": ["游戏", "打游戏", "动森", "steam", "game","switch","舟","p5","暖暖","恋与"],
        "娱乐": ["番", "听歌", "演唱会"],
        "穿越": ["皇帝", "太监", "当老师", "第三视角", "杀","四叔","怀孕"],
        "网站": ["网站", "网页", "GitHub", "代码", "程序", "Supabase"],
        "情感": ["表白","女朋友","结婚","分手"],
        "日常": ["吃饭", "睡觉", "出去玩", "逛街", "回家", "旅行"],
        "情绪": ["开心", "难过", "生气", "害怕", "紧张", "伤心", "焦虑", "激动"]
    };
    for (const tag in rules) {
        for (const keyword of rules[tag]) {
            if (content.includes(keyword)) {
                tags.push(tag);
                break;
            }
        }
    }
    // 一个标签都没有时，默认归到「日常」
    if (tags.length === 0) {
        tags.push("日常");
    }
    return tags;
}
async function fixOldTags(){
    const { data: dreams, error } = await supabaseClient
        .from("dreams")
        .select("id, content")
        .is("tags", null);
    if(error){
        console.log(error);
        alert("读取旧梦境失败：" + error.message);
        return;
    }
    if(!dreams || dreams.length === 0){
        alert("没有发现需要补标签的梦境");
        return;
    }
    let count = 0;
    for(const dream of dreams){
        const tags = generateTags(dream.content);
        const { error } = await supabaseClient
            .from("dreams")
            .update({
                tags: tags.join(",")
            })
            .eq("id", dream.id);
        if(error){
            console.log("更新失败：", dream.id, error);
        }else{
            count++;
        }
    }
    alert("旧梦境标签补完！共更新 " + count + " 条");
    loadDreams();
}
async function rebuildAllTags(){
    const { data: dreams, error } = await supabaseClient
        .from("dreams")
        .select("id, content");
    if(error){
        console.log(error);
        alert("读取梦境失败：" + error.message);
        return;
    }
    if(!dreams || dreams.length === 0){
        alert("没有找到梦境");
        return;
    }
    let count = 0;
    for(const dream of dreams){
        const tags = generateTags(dream.content || "");
        const { error } = await supabaseClient
            .from("dreams")
            .update({
                tags: tags.join(",")
            })
            .eq("id", dream.id);
        if(error){
            console.log("更新失败：", dream.id, error);
        }else{
            count++;
        }
    }
    alert("标签重新生成完成！共更新 " + count + " 条梦境");
    loadDreams();
}