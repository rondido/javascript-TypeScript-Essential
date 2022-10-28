const ajax = new XMLHttpRequest();  //ajsx를 통해 받아올려고 준비
const content = document.createElement("div");
const root = document.getElementById('root');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

ajax.open('GET', NEWS_URL, false); // fasle를 통해 동기적으로 가져오겠다고 정의
ajax.send(); //이 코드를 통해 데이터를 가지고 옴.

const newsFeed = JSON.parse(ajax.response);

const ul = document.createElement("ul");

window.addEventListener('hashchange', function(){
    //location을통해 id를 가져온다..
    const id = location.hash.substr(1);
    
    ajax.open('GET', CONTENT_URL.replace('@id', id), false);
    ajax.send();

    const newContent  = JSON.parse(ajax.response);
    const title = this.document.createElement("h1");
    
    title.innerHTML = newContent.title;
    content.appendChild(title);
});

for(let i =0; i<10; i++){
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href= `#${newsFeed[i].id}`;
    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

   

    li.appendChild(a);
    ul.appendChild(li);
}

root.appendChild(ul);
root.appendChild(content);
