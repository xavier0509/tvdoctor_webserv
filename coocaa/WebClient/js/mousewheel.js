var EventUtil={
  getEvent:function(event){return event?event:window.event;},
    //滚轮事件对象的 wheelDelta/FF DOMMouseScroll
  getWheelDelta:function(event){
    if(event.wheelDelta){//ff以外的浏览器
            //在最新版的opera中window返回undefined ， 在opera9.5中返回对象 在9.5版本之前的版本中wheelDelta的正负号颠倒的
      return (window.opera&&window.opera.version()<9.5?-event.wheelDelta:event.wheelDelta);
      }else{return -event.detail*40;}//ff
    },
  //事件处理程序
  addHandler:function(element,type,handler){
    if(element.addEventListener){element.addEventListener(type,handler,false)}//DOM2
    else if(element.attachEvent){element.attachEvent('on'+type,handler);}//ie
    else{element['on'+type]=handler;}//DOM0
    }
}

var a=document.getElementById('box');

EventUtil.addHandler(a,'click',function(){});//注册点击事件
EventUtil.addHandler(document,'mousewheel',handleMouseWheel);//注册ie的滚轮事件
EventUtil.addHandler(document,'DOMMouseScroll',handleMouseWheel);//注册ff的滚轮事件

function handleMouseWheel(e){
                e=EventUtil.getEvent(e);
                var delta=EventUtil.getWheelDelta(e);
        if (delta>0) {page1()};
        if (delta<0) {page2()};

}

a.click();//js触发点击事件

//怎么用js触发向上滚动 和向下滚动事件呢