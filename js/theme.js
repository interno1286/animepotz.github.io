function start_mess_close() {
  localStorage.setItem('start_mess', '1')
  document.getElementById('start_mess').setAttribute("style", "display:none;");
  document.getElementById('android_app').setAttribute("style", "display:none;");
  document.getElementById('ios_app').setAttribute("style", "display:none;");
}

window.onload = function() {
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    if (localStorage.getItem('start_mess') != '1') {
      function detectOS() {
          const platform = navigator.platform.toLowerCase(),
              iosPlatforms = ['iphone', 'ipad', 'ipod', 'ipod touch'];

          if (platform.includes('mac')) return 'MacOS';
          if (iosPlatforms.includes(platform)) return 'iOS';
          if (platform.includes('win')) return 'Windows';
          if (/android/.test(navigator.userAgent.toLowerCase())) return 'Android';
          if (/linux/.test(platform)) return 'Linux';

          return 'unknown';
      }
      if (detectOS() == 'Android') {
        document.getElementById('start_mess').setAttribute("style", "display:block;");
        document.getElementById('android_app').setAttribute("style", "display:block;");
      } else if (detectOS() == 'iOS') {
        document.getElementById('start_mess').setAttribute("style", "display:block;");
        document.getElementById('ios_app').setAttribute("style", "display:block;");
      } else if (detectOS() == 'MacOS') {
        document.getElementById('start_mess').setAttribute("style", "display:block;");
        document.getElementById('ios_app').setAttribute("style", "display:block;");
      }
    }
  }


  if (localStorage.getItem('my_theme') == 'auto') {
    document.getElementById('b_theme1').setAttribute("style", "display:none;");
    document.getElementById('b_theme2').setAttribute("style", "display:none;");
    document.getElementById('b_auto').setAttribute("style", "");
    $('link[href="css/auto.css"]').attr('href', 'css/auto.css');
  } else if (localStorage.getItem('my_theme') == 'theme1') {
    document.getElementById('b_theme2').setAttribute("style", "display:none;");
    document.getElementById('b_theme1').setAttribute("style", "");
    document.getElementById('b_auto').setAttribute("style", "display:none;");
    $('link[href="css/auto.css"]').attr('href', 'css/theme1.css');
  } else if (localStorage.getItem('my_theme') == 'theme2') {
    document.getElementById('b_theme1').setAttribute("style", "display:none;");
    document.getElementById('b_theme2').setAttribute("style", "");
    document.getElementById('b_auto').setAttribute("style", "display:none;");
    $('link[href="css/auto.css"]').attr('href', 'css/theme2.css');
  } else {
    localStorage.setItem('my_theme', 'auto');
    document.getElementById('b_theme1').setAttribute("style", "display:none;");
    document.getElementById('b_theme2').setAttribute("style", "display:none;");
    document.getElementById('b_auto').setAttribute("style", "");
    $('link[href="css/auto.css"]').attr('href', 'css/auto.css');
  }
  var loader1 = $("#loader1").width();
  if (loader1 != '130px') {
    timer = setInterval(function () {
      var loader1 = $("#loader1").width();
      if (loader1 != '130') {
        document.getElementById('loader1').setAttribute("style", `width: calc(${loader1}px + 1px)`);
      }
    }, 1000)
  }
  var width1 = document.documentElement.clientWidth;
  var tallage = 90;
  var result = width1 / 100 * tallage; //вычисление процентов
  if (width1 <= '880') {
    var block_header = document.getElementsByClassName('block_header');
    for (var i = 0; i < block_header.length; i++) {
      block_header[i].setAttribute("style" , "width:" + width1 + "px;");
    }
  }
  var block_header_small = document.getElementsByClassName('block_header_small');
  for (var i = 0; i < block_header_small.length; i++) {
    block_header_small[i].setAttribute("style" , "width:" + result + "px;");
  }

  if (width1 <= '600') {
    var small_bac = document.getElementsByClassName('small_bac');
    for (var i = 0; i < small_bac.length; i++) {
      small_bac[i].setAttribute("style" , "width:" + width1 + "px;");
    }
  } else {
    var small_bac = document.getElementsByClassName('small_bac');
    for (var i = 0; i < small_bac.length; i++) {
      small_bac[i].setAttribute("style" , "width:" + result + "px;");
    }
  }


};


function preloader_none() {
  var preloader = document.getElementById("preloader");
  var preloader_preload = document.getElementById("preloader_preload");
  function fadeOutnojquery(el){
    el.style.opacity = 1;
    var interpreloader = setInterval(
      function(){
        el.style.opacity = el.style.opacity - 0.05;
        if (el.style.opacity <=0.05){
          clearInterval(interpreloader);
          preloader_preload.style.display = "none";
          preloader.style.display = "none";
        }
      },16
    );
  }
  setTimeout(function(){
    document.getElementById('loader1').setAttribute("style", 'width: 130px');
    fadeOutnojquery(preloader_preload);
    fadeOutnojquery(preloader);
  },400);
};



function theme_auto() {
  localStorage.setItem('my_theme', 'theme1');
  document.getElementById('b_theme1').setAttribute("style", "");
  document.getElementById('b_theme2').setAttribute("style", "display:none;");
  document.getElementById('b_auto').setAttribute("style", "display:none;");
  $('link[href="css/auto.css"]').attr('href', 'css/theme1.css');
};
function theme1() {
  localStorage.setItem('my_theme', 'theme2');
  document.getElementById('b_theme2').setAttribute("style", "");
  document.getElementById('b_theme1').setAttribute("style", "display:none;");
  document.getElementById('b_auto').setAttribute("style", "display:none;");
  $('link[href="css/theme1.css"]').attr('href', 'css/theme2.css');
};
function theme2() {
  localStorage.setItem('my_theme', 'auto');
  document.getElementById('b_auto').setAttribute("style", "");
  document.getElementById('b_theme2').setAttribute("style", "display:none;");
  document.getElementById('b_theme1').setAttribute("style", "display:none;");
  $('link[href="css/theme2.css"]').attr('href', 'css/auto.css');
};





setTimeout(function(){
  // var width1 = document.documentElement.clientWidth;
  // var tallage = 90;
  // var result = width1 / 100 * tallage; //вычисление процентов
  // if (width1 <= '880') {
  //   var block_header = document.getElementsByClassName('block_header');
  //   for (var i = 0; i < block_header.length; i++) {
  //     block_header[i].setAttribute("style" , "width:" + width1 + "px;");
  //   }
  // }
  // var block_header_small = document.getElementsByClassName('block_header_small');
  // for (var i = 0; i < block_header_small.length; i++) {
  //   block_header_small[i].setAttribute("style" , "width:" + result + "px;");
  // }
  //
  // if (width1 <= '600') {
  //   var small_bac = document.getElementsByClassName('small_bac');
  //   for (var i = 0; i < small_bac.length; i++) {
  //     small_bac[i].setAttribute("style" , "width:" + width1 + "px;");
  //   }
  // } else {
  //   var small_bac = document.getElementsByClassName('small_bac');
  //   for (var i = 0; i < small_bac.length; i++) {
  //     small_bac[i].setAttribute("style" , "width:" + result + "px;");
  //   }
  // }
  window.addEventListener("resize", function() {
    var width1 = document.documentElement.clientWidth;
    var tallage = 90;
    var result = width1 / 100 * tallage; //вычисление процентов
    if (width1 <= '880') {
      var block_header = document.getElementsByClassName('block_header');
      for (var i = 0; i < block_header.length; i++) {
        block_header[i].setAttribute("style" , "width:" + width1 + "px;");
      }
    } else {
      var block_header = document.getElementsByClassName('block_header');
      for (var i = 0; i < block_header.length; i++) {
        block_header[i].setAttribute("style" , "");
      }
    }

    if (width1 <= '600') {
      var small_bac = document.getElementsByClassName('small_bac');
      for (var i = 0; i < small_bac.length; i++) {
        small_bac[i].setAttribute("style" , "width:" + width1 + "px;");
      }
    } else {
      var small_bac = document.getElementsByClassName('small_bac');
      for (var i = 0; i < small_bac.length; i++) {
        small_bac[i].setAttribute("style" , "width:" + result + "px;");
      }
    }


    var block_header_small = document.getElementsByClassName('block_header_small');

    for (var i = 0; i < block_header_small.length; i++) {
      block_header_small[i].setAttribute("style" , "width:" + result + "px;");
    }
  }, false);
},400);
//
// var block_header_small = document.getElementsByClassName('block_header_small');
// block_header_small.setAttribute("style" , "width:" + result + "px;display: inline-block;");


// function Login() {
//   var formData = new FormData();
//   formData.append('name', 'Tom');
//   formData.append('age', 23);
//
//   var request = new XMLHttpRequest();
//   function reqReadyStateChange() {
//       if (request.readyState == 4 && request.status == 200)
//           document.getElementById("output").innerHTML=request.responseText;
//   }
//
//   request.open("POST", "http://localhost:8080/display.php");
//   request.onreadystatechange = reqReadyStateChange;
//   request.send(formData);
// }

// let subscribe = {
//   subscribe: ''
// };
//
// let json = JSON.stringify(subscribe);
//
// console.log(json);
//
// var exampleSocket = new WebSocket("wss://api.anilibria.tv/v2/ws/");
// exampleSocket.send(json);



// var msg = {
//   subscribe: {
//     season: {
//       year: 2022
//     }
//   }
// };
// // var msg = {
// //   subscribe: {}
// // };
// let json = JSON.stringify(msg);
// console.log(json);

// // Пример создания объекта
// let ws = new WebSocket("wss://api.anilibria.tv/v2/webSocket/");
// ws.onmessage = function(event) {
//     console.log('Получены данные ', event.data);
// };
// ws.onopen = function() {
//     console.log('Соединение установлено.');
//     ws.send(json);
// };
// ws.onclose = function(event) {
//     if (event.wasClean) {
//         console.log('Соединение закрыто чисто');
//     } else {
//        console.log('Обрыв соединения');  // при остановке сервера
//     }
//     console.log('Код: '+ event.code +' причина: '+event.reason);
// };
// ws.onerror = function(error) {
//   console.log("Ошибка " + error.message);
// };
// let socket = new WebSocket("wss://api.anilibria.tv/v2/webSocket/");
//
// socket.onopen = function(e) {
//   console.log("[open] Соединение установлено");
//   console.log("[send] Отправляем данные на сервер");
//   var div = document.createElement('div');
//   document.getElementById('block_notif').appendChild(div);
//   div.className = 'notif';
//   div.setAttribute("style", 'transition: .3s ease;color: var(--card-text-color-2);padding: 10px 10px;width: 100%;background: var(--card-background-3);margin-bottom: 10px;opacity: 0.9;');
//   div.innerHTML = '<p style="width: 100%;word-wrap: break-word;" onclick="notif_none()">Соединение установлено</p>';
//   socket.send(json);
// };
//
// socket.onmessage = function(event) {
//   console.log(`[message] Данные получены с сервера: ${event.data}`);
//   var div = document.createElement('div');
//   document.getElementById('block_notif').appendChild(div);
//   div.className = 'notif';
//   div.setAttribute("style", 'transition: .3s ease;color: var(--card-text-color-2);padding: 10px 10px;width: 100%;background: var(--card-background-3);margin-bottom: 10px;opacity: 0.9;');
//   div.innerHTML = '<p style="width: 100%;word-wrap: break-word;" onclick="notif_none()">'+event.data+'</p>';
//   // setTimeout(function(){
//   //   var block_header = document.getElementsByClassName('notif');
//   //   for (var i = 0; i < block_header.length; i++) {
//   //     block_header[i].setAttribute("style" , "transition: .3s ease;display:none;");
//   //   }
//   // },5000);
// };
// socket.onclose = function(event) {
//   if (event.wasClean) {
//     console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
//     var div = document.createElement('div');
//     document.getElementById('block_notif').appendChild(div);
//     div.className = 'notif';
//     div.setAttribute("style", 'transition: .3s ease;color: var(--card-text-color-2);padding: 10px 10px;width: 100%;background: var(--card-background-3);margin-bottom: 10px;opacity: 0.9;');
//     div.innerHTML = '<p style="width: 100%;word-wrap: break-word;" onclick="notif_none()">Соединение закрыто чисто, код='+event.code+' причина'+event.reason+'</p>';
//   } else {
//     // например, сервер убил процесс или сеть недоступна
//     // обычно в этом случае event.code 1006
//     console.log('[close] Соединение прервано');
//     var div = document.createElement('div');
//     document.getElementById('block_notif').appendChild(div);
//     div.className = 'notif';
//     div.setAttribute("style", 'transition: .3s ease;color: var(--card-text-color-2);padding: 10px 10px;width: 100%;background: var(--card-background-3);margin-bottom: 10px;opacity: 0.9;');
//     div.innerHTML = '<p style="width: 100%;word-wrap: break-word;" onclick="notif_none()">Соединение прервано</p>';
//   }
// };
// socket.onerror = function(error) {
//   console.log(`[error] ${error.message}`);
//   var div = document.createElement('div');
//   document.getElementById('block_notif').appendChild(div);
//   div.className = 'notif';
//   div.setAttribute("style", 'transition: .3s ease;color: var(--card-text-color-2);padding: 10px 10px;width: 100%;background: var(--card-background-3);margin-bottom: 10px;opacity: 0.9;');
//   div.innerHTML = '<p style="width: 100%;word-wrap: break-word;" onclick="notif_none()">'+error.message+'</p>';
// };
//
// function notif_none() {
//   setTimeout(function(){
//     var block_header = document.getElementsByClassName('notif');
//     for (var i = 0; i < block_header.length; i++) {
//       block_header[i].setAttribute("style" , "transition: .3s ease;display:none;");
//     }
//   },300);
// }
