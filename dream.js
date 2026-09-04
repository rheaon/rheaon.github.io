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

<h3 class="dream-date">
${dream.date}
</h3>

<h2 class="dream-title">
${dream.title}
</h2>

<p class="dream-content">
${dream.content}
</p>

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

const {error}=await supabaseClient
.from("dreams")
.insert({
    date:date,
    title:title,
    content:content,
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


await supabaseClient
.from("dreams")
.insert({

date:dream.date,

title:dream.title,

content:dream.content,

user_id:user.id

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


let result=[];

let current=null;



lines.forEach(line=>{


line=line.trim();


if(/^\d{1,2}\.\d{1,2}$/.test(line)){


if(current){

result.push(current);

}


let parts=line.split(".");


let month=parts[0].padStart(2,"0");

let day=parts[1].padStart(2,"0");



current={

date:`2026-${month}-${day}`,

title:`${month}月${day}日的梦`,

content:""

};


}

else{


if(current){

current.content += line+"\n";

}


}



});


if(current){

result.push(current);

}


return result;


}
