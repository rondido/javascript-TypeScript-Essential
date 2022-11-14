interface Store {
  currentPage : number;
  feeds: NewsFeed[];
}
interface News  {
  readonly id:number;
  readonly time_ago:string;
  readonly title:string;
  readonly url:string;
  readonly user:string;
  readonly content:string;
}

//해당 뉴스에 대한 타입
//& news type과 합쳐진다.
interface NewsFeed extends News  {
  readonly comments_count :number;
  readonly points:number;  
  read?:boolean;
}


// 해당 뉴스를 클릭 한 후 내용에 대한 타입
interface newsDetail extends News {
 
  readonly comments:NewsComment[];
}

interface NewsComment extends News  { 
  readonly comments:NewsComment[];
  readonly level:number;
}


const ajax : XMLHttpRequest = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

//전역상태관리
const store:Store = {
  currentPage: 1,
  feeds: [],
};

function apllyApiMixins(targetClass:any, baseClasses:any[]){
  baseClasses.forEach(baseClass => {
      Object.getOwnPropertyNames(baseClass.prototype).forEach(name =>{
        const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

        if(descriptor){
          Object.defineProperty(targetClass.prototype,name,descriptor);
        }
      })
  });
}

class Api {
   getRequest<ajaxResponse>(ur:string): ajaxResponse{
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();
  
    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi{
  getData(): NewsFeed[]{
   return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi{
  getData(id: string): newsDetail{
    return this.getRequest<newsDetail>(CONTENT_URL.replace('@id',id));
   
  }
}
interface NewsFeedApi extends Api{};
interface NewsDetailApi extends Api{};
apllyApiMixins(NewsFeedApi, [Api]);
apllyApiMixins(NewsDetailApi, [Api]);

class View{
  template:string;
  container:HTMLElement;
  constructor(containerId:string,template:string){
    const containerElment = document.getElementById(containerId);

    if(!containerElment){
      throw '최상위 컨테이너가 없어 UI를 진행하지 못함';
    }
    this.container = containerElment;
    this.template = template;
  }
   updateView(html:string): void{    
      this.container.innerHTML = html;      
  }
}

class NewsFeedView extends View{
  api:NewsFeedApi;
  feeds:NewsFeed[];
  constructor(containerId:string){
    let template:string = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
    `;
    super(containerId,template);
    this.api = new NewsFeedApi();
    this.feeds= store.feeds;
    
    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeeds();
    }
  
   
   
  }
  render(): void{
    const newsList:string[] = [];

     for (let i = (store.currentPage - 1) * 5; i < store.currentPage * 5; i++) {
      newsList.push(`
      <div class="p-6 ${
        newsFeed[i].read ? "bg-red-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
          <div class="flex-auto">
              <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
                newsFeed[i].comments_count
              }</div>
          </div>
          </div>
          <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
              <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
              <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
          </div>
      </div>    
      `);
    }
    template = template.replace("{{__news_feed__}}", newsList.join(""));
    template = template.replace(
      "{{__prev_page__}}",
      String(store.currentPage > 1 ? store.currentPage - 1 : 1)
    );
    template = template.replace("{{__next_page__}}", String(store.currentPage + 1));
    updateView(template);
  }

  makeFeeds() : void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
    
  }
}


class NewsDetailView extends View{
  constructor(){
  
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsDetail.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsDetail.content}
        </div>
  
        {{__comments__}}
  
      </div>
    </div>
  `;
 
    router(){
      const id = location.hash.substr(7);
      const api = new NewsDetailApi();
      const newsDetail : newsDetail = api.getData(id);

      for (let i = 0; i < store.feeds.length; i++) {
        if (store.feeds[i].id === Number(id)) {
          store.feeds[i].read = true;
          break;
        }
      }
    
    
      updateView( template.replace(
        "{{__comments__}}",
        makeComment(newsDetail.comments)
      ));
    }
    
  }
   makeComment(comments:NewsComment[]): string {
    const commentString = [];
  
    for (let i = 0; i < comments.length; i++) {
      const comment : NewsComment = comments[i];
      commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>      
    `);
  
      if (comment.comments.length > 0) {
        commentString.push(makeComment(comment.comments));
      }
      
    }
  
    return commentString.join("");
  }
 
  

}



function router():void {
  const routePath = location.hash;

  if (routePath === "") {
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}



window.addEventListener("hashchange", router);

router();
