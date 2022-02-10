// Проверка того, что наш браузер поддерживает Service Worker API.
if ('serviceWorker' in navigator) {
    // Весь код регистрации у нас асинхронный.
    navigator.serviceWorker.register('./sw.js')
      .then(() => navigator.serviceWorker.ready.then((worker) => {
        worker.sync.register('syncdata');
      }))
      .catch((err) => console.log(err));
}



// Загрузка тайтлов Анилибрии в кеш браузера
function load_api_cash(index_article, n) {
  var api_cash = localStorage.getItem('my_api_cash');
  // Если в кеше браузера нет тайтлов
  // 1. Грузим сначала 100 тайтлов
  // 2. Открываем страницу с результатом для нужной страницы
  // 3. Запускаем функцию дозагрузки тайтлов
  if (!api_cash) {
    url = "https://api.anilibria.tv/v2/getUpdates?remove=player.alternative_player,posters.original,player.playlist,torrents&limit=100"
    fetch(url)
    .then(function (response) {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
      }
      return Promise.resolve(response)
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      localStorage.setItem('my_api_cash_date', Math.floor(new Date().getTime()/1000.0)); // Записываем в браузер текущее время
      localStorage.setItem('my_api_cash', JSON.stringify(data));                         // Записываем в браузер 100 тайтлов
      article(index_article, n); // Открываем страницу с результатом для нужной страницы

      load_all__api_cash(); // Запускаем функцию дозагрузки тайтлов в кеш

    })
    .catch(function (error) {
      console.log('error', error)
    })
  } else {
    // Если в кеше меньше или равно 100 тайтлам, тапускаем функцию дозагрузки тайтлов в кеш
    var arr_api = JSON.parse(localStorage.getItem('my_api_cash'));
    if (arr_api.length <= 100) {
      load_all__api_cash();
      article(index_article, n); // Открываем страницу с результатом для нужной страницы
    } else {
      // Если в браузере есть кэш тайтлов
      // Отправляем запрос на получение тайтлов вышедших после времени загрузки кэша
      var api_cash = localStorage.getItem('my_api_cash');
      var date_api_cash = localStorage.getItem('my_api_cash_date');
      url = "https://api.anilibria.tv/v2/getChanges?remove=player.alternative_player,posters.original,player.playlist,torrents&limit=-1&since="+date_api_cash
      fetch(url)
      .then(function (response) {
        if (response.status !== 200) {
          return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length != 0) {
          let a = data.reverse();
          let b = JSON.parse(localStorage.getItem('my_api_cash'));
          for(var i=0; i<a.length; ++i) {
            var myIndex = b.findIndex(function (wizard) {
              return wizard.id === a[i]["id"];
            });
            if (myIndex !== -1) {
                b.splice(myIndex, 1);
                console.log('Есть совпадения');
            } else {
              console.log('Нет совпадений');
            }
            b.unshift(a[i]);
          }
          localStorage.setItem('my_api_cash_date', Math.floor(new Date().getTime()/1000.0)); // Записываем в браузер текущее время
          localStorage.setItem('my_api_cash', JSON.stringify(b));                            // Записываем в браузер все новые тайтлы

          var index_location = document.location.pathname;
          if (index_location == '/catalog' || index_location == '/' || index_location == '/index') {
            // console.log(a);
            Update_Article(a);
          }
        }
      })
      .catch(function (error) {
        console.log('error', error)
      })

      article(index_article, n); // Открываем страницу с результатом для нужной страницы
    }
  }
}

// Функция дозагрузки тайтлов
function load_all__api_cash() {
  message_body('Идёт загрузка кеша, подождите немного', 1); // Отправляем сообщение
  var api_cash = localStorage.getItem('my_api_cash');
  url = "https://api.anilibria.tv/v2/getUpdates?remove=player.alternative_player,posters.original,player.playlist,torrents&limit=-1&after=100"
  fetch(url)
  .then(function (response) {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText))
    }
    return Promise.resolve(response)
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if (data.length != 0) {
      let a = data.reverse();
      let b = JSON.parse(localStorage.getItem('my_api_cash'));
      for(var i=0; i<a.length; ++i) {
        b.push(a[i]);
      }
      localStorage.setItem('my_api_cash_date', Math.floor(new Date().getTime()/1000.0)); // Записываем в браузер текущее время
      localStorage.setItem('my_api_cash', JSON.stringify(b));                            // Записываем в браузер все оставшиеся тайтлы
      var arr = b;
      var index_location = document.location.pathname;
      if (index_location == '/catalog') {
        article('Catalog', '1');
      }
    }
    message_body('Кеш загружен'); // Отправляем сообщение
  })
  .catch(function (error) {
    console.log('error', error)
  })
}

// Функция удаления всех тайтлов из кэша
function del_cash() {
  localStorage.setItem('my_api_cash', '');
}

// Функция сортировки тайтлов
function load_sortingTitles(index_article, n) {
  document.getElementById('error').setAttribute("style", `display:none;`);
  var my_home_style = localStorage.getItem('my_home_style');
  if (!my_home_style || my_home_style == '1') {
    // Удаляем все тайтлы со страницы
    var container_favorites = document.getElementById("article_block");
    var elements_favorites = container_favorites.getElementsByClassName("article");
    while (elements_favorites[0]) {
        elements_favorites[0].parentNode.removeChild(elements_favorites[0]);
    }
    article(index_article, n); // Открываем страницу с отсортированным результатом для нужной страницы
  } else if (my_home_style == '2'){
    // Удаляем все тайтлы со страницы
    var container_favorites = document.getElementById("article_block");
    var elements_favorites = container_favorites.getElementsByClassName("article_design_2");
    while (elements_favorites[0]) {
        elements_favorites[0].parentNode.removeChild(elements_favorites[0]);
    }
    article(index_article, n); // Открываем страницу с отсортированным результатом для нужной страницы
  }

}

// Функция определения нужной страницы
function article(index_article, n) {
  var paramsString = document.location.search;
  var searchParams = new URLSearchParams(paramsString);

  var code_s = searchParams.get("code");
  var year_s = searchParams.get("year");
  var genres_s = searchParams.get("genres");
  var voice_s = searchParams.get("voice");
  var timing_s = searchParams.get("timing");
  var translator_s = searchParams.get("translator");
  var editing_s = searchParams.get("editing");
  var decor_s = searchParams.get("decor");
  var type_s = searchParams.get("type");

  var search_s = searchParams.get("q");

  var n,
      arr_filter_genres,
      arr_api,
      genres,
      data,
      max_art = 24, // Количество тайтлов на странице
      art = 0;

  localStorage.setItem('my_page', 0); // Устанавливаем первоначальное количество страниц

  if (index_article == 'Home') {

    // Получаем из кэша браузера жанры которые нельзя отображать
    var cookie_genres = localStorage.getItem('my_genres');
    if (cookie_genres) {
      genres = cookie_genres.split(/\s*,\s*/);
    } else {
      localStorage.setItem('my_genres', '');
      cookie_genres = localStorage.getItem('my_genres');
      genres = cookie_genres.split(/\s*,\s*/);
    }

    // Получаем из кэша браузера все тайтлы
    arr_api = JSON.parse(localStorage.getItem('my_api_cash'));

    // Удаляем из результата жанры которые нельзя отображать
    arr = arr_api.filter(function(item) {
    for (var key in genres) {
        if (item.genres.includes(genres[key]))
          return false;
      }
      return true;
    });

    load_new(n, arr); // Запускаем функцию вывода тайтлов на страницу

  } else if (index_article == 'Catalog') {

    // Получаем из кэша браузера жанры которые нельзя отображать
    var cookie_genres = localStorage.getItem('my_genres');
    if (cookie_genres) {
      genres = cookie_genres.split(/\s*,\s*/);
    } else {
      localStorage.setItem('my_genres', '');
      cookie_genres = localStorage.getItem('my_genres');
      genres = cookie_genres.split(/\s*,\s*/);
    }

    // Получаем из кэша браузера все тайтлы
    arr_api = JSON.parse(localStorage.getItem('my_api_cash'));

    // Удаляем из результата жанры которые нельзя отображать
    arr_filter_genres = arr_api.filter(function(item) {
    for (var key in genres) {
        if (item.genres.includes(genres[key]))
          return false;
      }
      return true;
    });

    // Получаем значения посе фильтров и поисков
    var genres_sort = document.getElementById("Genres_block").value;
    var years_sort = document.getElementById("Years_block").value;
    var season_sort = document.getElementById("Season_block").value;
    var sorting = document.getElementById("Sorting_block").value;

    var arr_s1 = arr_filter_genres.filter(function(item) {if (genres_sort != '0'){if (item.genres.includes(genres_sort)){return true}}else{return true}});
    var arr_s2 = arr_s1.filter(function(item) {if (years_sort != '0'){if (item.season.year == years_sort){return true}}else{return true}});
    var arr_s3 = arr_s2.filter(function(item) {if (season_sort != '0'){if (item.season.code == season_sort){return true}}else{return true}});

    var arr_f1 = arr_s3.filter(function(item) {if (voice_s){if (item.team.voice.includes(voice_s)){return true}}else{return true}});
    var arr_f2 = arr_f1.filter(function(item) {if (timing_s ){if (item.team.timing.includes(timing_s)){return true}}else{return true}});
    var arr_f3 = arr_f2.filter(function(item) {if (translator_s){if (item.team.translator.includes(translator_s)){return true}}else{return true}});
    var arr_f4 = arr_f3.filter(function(item) {if (editing_s){if (item.team.editing.includes(editing_s)){return true}}else{return true}});
    var arr_f5 = arr_f4.filter(function(item) {if (decor_s){if (item.team.decor.includes(decor_s)){return true}}else{return true}});
    var arr_f6 = arr_f5.filter(function(item) {if (type_s){if (item.type.code == type_s){return true}}else{return true}});
    var arr_f7 = arr_f6.filter(function(item) {if (genres_s){if (item.genres.includes(genres_s)){return true}}else{return true}});
    var arr_f8 = arr_f7.filter(function(item) {if (year_s){if (item.season.year == year_s){return true}}else{return true}});
    arr = arr_f8.filter(function(item) {if (code_s){if (item.season.code == code_s){return true}}else{return true}});

    // Получаем значения из блока сортировки
    var checkbox_sorting = '1';
    if (document.querySelector('#checkbox_sorting:checked')) {
       checkbox_sorting = '0';
    }
    if (sorting == '0') {
      if (checkbox_sorting == '1'){arr;}else{arr;}
    } else if(sorting == 'year'){
      if (checkbox_sorting == '1'){arr.sort((a, b) => (a.season['year'] > b.season['year']) ? 1 : -1);}else {arr.sort((a, b) => (a.season['year'] < b.season['year']) ? 1 : -1);}
    } else if(sorting == 'codes'){
      if (checkbox_sorting == '1'){arr.sort((a, b) => (a.code > b.code) ? 1 : -1);}else{arr.sort((a, b) => (a.code < b.code) ? 1 : -1);}
    } else if(sorting == 'in_favorites'){
      if (checkbox_sorting == '1'){arr.sort((a, b) => (a.in_favorites > b.in_favorites) ? 1 : -1);}else{arr.sort((a, b) => (a.in_favorites < b.in_favorites) ? 1 : -1);}
    } else if(sorting == 'series'){
      if (checkbox_sorting == '1'){arr.sort((a, b) => (a.type['series'] > b.type['series']) ? 1 : -1);}else{arr.sort((a, b) => (a.type['series'] < b.type['series']) ? 1 : -1);}
    } else if(sorting == 'code'){
      if (checkbox_sorting == '1'){arr.sort((a, b) => (a.type['code'] > b.type['code']) ? 1 : -1);}else{arr.sort((a, b) => (a.type['code'] < b.type['code']) ? 1 : -1);}
    } else{
      if (checkbox_sorting == '1'){arr;}else{arr;}
    }

    // // Редактируем selected у select с задержкой 400мс (изза ожидания подгрузки жанров и годов в option)
    // setTimeout(function(){
    //   if (genres_s) {document.getElementById('Genres_block').value = genres_s;}
    //   if (year_s) {document.getElementById('Years_block').value = year_s;}
    //   if (code_s) {document.getElementById('Season_block').value = code_s;}
    // },400);

    load_new(n, arr); // Запускаем функцию вывода тайтлов на страницу

  } else if (index_article == 'Search') {

    // Получаем из кэша браузера жанры которые нельзя отображать
    var cookie_genres = localStorage.getItem('my_genres');
    if (cookie_genres) {
      genres = cookie_genres.split(/\s*,\s*/);
    } else {
      localStorage.setItem('my_genres', '');
      cookie_genres = localStorage.getItem('my_genres');
      genres = cookie_genres.split(/\s*,\s*/);
    }

    // Получаем из кэша браузера все тайтлы
    arr_api = JSON.parse(localStorage.getItem('my_api_cash'));

    // Удаляем из результата жанры которые нельзя отображать
    arr_filter_genres = arr_api.filter(function(item) {
    for (var key in genres) {
        if (item.genres.includes(genres[key]))
          return false;
      }
      return true;
    });

    // Настраиваем библиотеку fuse.js
    const fuse = new Fuse(arr_filter_genres, {
      includeScore: true,
      minMatchCharLength: 4,
      shouldSort: true,
      // keys: ['names.ru', 'names.en', 'code', 'description']
      keys: ['names.ru', 'names.en', 'code']
    })
    arr = fuse.search(search_s);

    load_new_search(n, arr); // Запускаем функцию вывода тайтлов на страницу
  }
}


// Функция вывода тайтлов на страницу
function load_new(n) {
  var n,
      data,
      max_art = 24, // Количество тайтлов на странице
      art = 0;

// Увеличение количества тайтлов на странице
  if (n == 1) {
    var edit = parseInt(localStorage.getItem('my_page'));
    var art = art + edit;
    var max_art = max_art + edit;
    if (max_art >= arr.length) {
      var max_art = arr.length
    }
    data = arr.slice(art, max_art);
    localStorage.setItem('my_page', max_art);
  } else if (n == 2) {
    data = arr.slice(0, arr.length);
    localStorage.setItem('my_page', arr.length);
  } else {
    data = arr.slice(art, max_art);
  }

// Вывод ошибки при отсутствии тайтлов
  if (data == '') {
    document.getElementById('error').setAttribute("style", `display:block;`);
  }

// Цикл вывода тайтлов на страницу
  for (var i = 0; i < data.length; i++) {
    var series_t = data[i]["type"]["series"];
    var string_t = data[i]["type"]["code"];
    var series_text,
        series_type,
        genres = '';
    if (data[i]["player"]["series"]["last"]) {
      if (series_t) {
        series_text = 'Серия '+data[i]["player"]["series"]["last"]+'/'+series_t;
      }else {
        series_text = 'Серия '+data[i]["player"]["series"]["last"];
      }
    } else {
      series_text = 'Серия '+series_t;
    }
    if (series_t == null && string_t != '0' && string_t != '2' && string_t != '3' && string_t != '4') {
      series_type = series_text;
    } else if(series_t == null && string_t == null) {
      series_type = series_text;
    } else if(string_t == '4') {
      series_type = 'Спешл';
    } else if(string_t == '0') {
      series_type = 'Фильм';
    } else if(string_t == '3') {
      series_type = 'ONA';
    } else if(string_t == '2') {
      series_type = 'OVA';
    } else {
      series_type = series_text;
    }
    var div = document.createElement('div');
    document.getElementById('article_block').appendChild(div);

    var my_home_style = localStorage.getItem('my_home_style');
    if (!my_home_style || my_home_style == '1') {
      if(data[i]["genres"][2] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
      } else if(data[i]["genres"][1] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
      } else if(data[i]["genres"][0] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
      }
      div.className = 'article';
      div.setAttribute("style", "background-image: url('https://www.anilibria.tv"+data[i]["posters"]["medium"]["url"]+"')");
      div.innerHTML += `
          <a class="article-text"  href="release?id=${data[i]["id"]}">
            <p class="article-name"  style="-webkit-line-clamp: 3;line-clamp: 3;">${data[i]["names"]["ru"]}</p>
            ${genres}
            <p class="article-description">${data[i]["description"]}</p>
          </a>
          <div class="article_ser">${series_type}</div>`;
    } else if (my_home_style = '2') {
      if(data[i]["genres"][2] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
      } else if(data[i]["genres"][1] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
      } else {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
      }
      div.className = 'article_design_2';
      div.innerHTML += `
          <a href="release?id=${data[i]["id"]}">
            <img src="https://www.anilibria.tv${data[i]["posters"]["medium"]["url"]}" alt="">
            <div class="text_block_design_2">
              <p class="article_name_design_2"  style="-webkit-line-clamp: 1;line-clamp: 1;">${data[i]["names"]["ru"]}</p>
              ${genres}
              <p class="article_description_design_2" style="-webkit-line-clamp: 5;line-clamp: 5;">${data[i]["description"]}</p>
            </div>
          </a>`;
    }

  }


  preloader_none(); // Запускаем функцию закрытия анимации загрузки страницы
}

// Функция вывода тайтлов по поиску на страницу
function load_new_search(n) {
  var n,
      data,
      max_art = 24, // Количество тайтлов на странице
      art = 0;

// Увеличение количества тайтлов на странице
  if (n == 1) {
    var edit = parseInt(localStorage.getItem('my_page'));
    var art = art + edit;
    var max_art = max_art + edit;
    if (max_art >= arr.length) {
      var max_art = arr.length
    }
    data = arr.slice(art, max_art);
    localStorage.setItem('my_page', max_art);
  } else if (n == 2) {
    data = arr.slice(0, arr.length);
    localStorage.setItem('my_page', arr.length);
  } else {
    data = arr.slice(art, max_art);
  }

// Вывод ошибки при отсутствии тайтлов
  if (data == '') {
    document.getElementById('error').setAttribute("style", `display:block;`);
  }

// Цикл вывода тайтлов на страницу
  for (var i = 0; i < data.length; i++) {
    var series_t = data[i]['item']["type"]["series"];
    var string_t = data[i]['item']["type"]["code"];
    var series_text,
        series_type,
        genres = '';
    if (data[i]['item']["player"]["series"]["last"]) {
      if (series_t) {
        series_text = 'Серия '+data[i]['item']["player"]["series"]["last"]+'/'+series_t;
      }else {
        series_text = 'Серия '+data[i]['item']["player"]["series"]["last"];
      }
    } else {
      series_text = 'Серия '+series_t;
    }
    if (series_t == null && string_t != '0' && string_t != '2' && string_t != '3' && string_t != '4') {
      series_type = series_text;
    } else if(series_t == null && string_t == null) {
      series_type = series_text;
    } else if(string_t == '4') {
      series_type = 'Спешл';
    } else if(string_t == '0') {
      series_type = 'Фильм';
    } else if(string_t == '3') {
      series_type = 'ONA';
    } else if(string_t == '2') {
      series_type = 'OVA';
    } else {
      series_type = series_text;
    }
    var div = document.createElement('div');
    document.getElementById('article_block').appendChild(div);
    var my_home_style = localStorage.getItem('my_home_style');
    if (!my_home_style || my_home_style == '1') {
      if(data[i]['item']["genres"][2] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]['item']["genres"][0]+' | '+data[i]['item']["genres"][1]+' | '+data[i]['item']["genres"][2] + '</p>';
      } else if(data[i]['item']["genres"][1] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]['item']["genres"][0]+' | '+data[i]['item']["genres"][1] + '</p>';
      } else if(data[i]['item']["genres"][0] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]['item']["genres"][0] + '</p>';
      }
      div.className = 'article';
      div.setAttribute("style", "background-image: url('https://www.anilibria.tv"+data[i]['item']["posters"]["medium"]["url"]+"')");
      div.innerHTML += `
          <a class="article-text"  href="release?id=${data[i]['item']["id"]}">
            <p class="article-name"  style="-webkit-line-clamp: 3;line-clamp: 3;">${data[i]['item']["names"]["ru"]}</p>
            ${genres}
            <p class="article-description">${data[i]['item']["description"]}</p>
          </a>
          <div class="article_ser">${series_type}</div>`;
    } else if (my_home_style = '2') {
      if(data[i]['item']["genres"][2] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]['item']["genres"][0]+' | '+data[i]['item']["genres"][1]+' | '+data[i]['item']["genres"][2] + '</p>';
      } else if(data[i]['item']["genres"][1] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]['item']["genres"][0]+' | '+data[i]['item']["genres"][1] + '</p>';
      } else {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]['item']["genres"][0] + '</p>';
      }
      div.className = 'article_design_2';
      div.innerHTML += `
          <a href="release?id=${data[i]['item']["id"]}">
            <img src="https://www.anilibria.tv${data[i]['item']["posters"]["medium"]["url"]}" alt="">
            <div class="text_block_design_2">
              <p class="article_name_design_2"  style="-webkit-line-clamp: 1;line-clamp: 1;">${data[i]['item']["names"]["ru"]}</p>
              ${genres}
              <p class="article_description_design_2" style="-webkit-line-clamp: 5;line-clamp: 5;">${data[i]['item']["description"]}</p>
            </div>
          </a>`;
    }

  }


  preloader_none(); // Запускаем функцию закрытия анимации загрузки страницы
}

// Функция добавления тайтла на страницу после его добавления
function Update_Article(arr_update) {
  var n,
      arr_filter_genres,
      arr_api,
      genres,
      data;
  // Получаем из кэша браузера жанры которые нельзя отображать
  var cookie_genres = localStorage.getItem('my_genres');
  if (cookie_genres) {
    genres = cookie_genres.split(/\s*,\s*/);
  } else {
    localStorage.setItem('my_genres', '');
    cookie_genres = localStorage.getItem('my_genres');
    genres = cookie_genres.split(/\s*,\s*/);
  }

  // Получаем из кэша браузера все тайтлы
  arr_api = arr_update;

  // Удаляем из результата жанры которые нельзя отображать
  arr = arr_api.filter(function(item) {
  for (var key in genres) {
      if (item.genres.includes(genres[key]))
        return false;
    }
    return true;
  });

  var data = arr;

  for (var i = 0; i < data.length; i++) {
    // console.log(data[i]);
    var series_t = data[i]["type"]["series"];
    var string_t = data[i]["type"]["code"];
    var last_t = data[i]["player"]["series"]["last"];
    var series_type;
    if (series_t == null && string_t != '0' && string_t != '2' && string_t != '3' && string_t != '4') {
      series_type = 'Серия '+ last_t;
    } else if(series_t == null && string_t == null) {
      series_type = 'Серия '+ last_t;
    } else if(string_t == '4') {
      series_type = 'Спешл';
    } else if(string_t == '0') {
      series_type = 'Фильм';
    } else if(string_t == '3') {
      series_type = 'ONA';
    } else if(string_t == '2') {
      series_type = 'OVA';
    } else {
      series_type = 'Серия '+last_t+'/'+series_t;
    }
    var my_home_style = localStorage.getItem('my_home_style');
    if (!my_home_style || my_home_style == '1') {
      if(data[i]["genres"][2] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
      } else if(data[i]["genres"][1] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
      } else if(data[i]["genres"][0] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
      }
      document.getElementById('article_block').insertAdjacentHTML('afterbegin', `
        <div class="article" style="background-image: url('https://www.anilibria.tv${data[i]["posters"]["medium"]["url"]}')">
          <a class="article-text"  href="release?id=${data[i]["id"]}">
            <p class="article-name"  style="-webkit-line-clamp: 3;line-clamp: 3;">${data[i]["names"]["ru"]}</p>
            ${genres}
            <p class="article-description">${data[i]["description"]}</p>
          </a>
          <div class="article_ser">${series_type}</div>
        </div>`);
    } else if (my_home_style = '2') {
      if(data[i]["genres"][2] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
      } else if(data[i]["genres"][1] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
      } else {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
      }
      document.getElementById('article_block').insertAdjacentHTML('afterbegin', `
        <div class="article_design_2">
          <a href="release?id=${data[i]["id"]}">
            <img src="https://www.anilibria.tv${data[i]["posters"]["medium"]["url"]}" alt="">
            <div class="text_block_design_2">
              <p class="article_name_design_2"  style="-webkit-line-clamp: 1;line-clamp: 1;">${data[i]["names"]["ru"]}</p>
              ${genres}
              <p class="article_description_design_2" style="-webkit-line-clamp: 5;line-clamp: 5;">${data[i]["description"]}</p>
            </div>
          </a>
        </div>`);
    }
  }
}


// Функция вывода тайтлов в блок Тип 2
function article_favorites(url_pop, block_id, arr_filter_genres) {
  var block_id

  fetch(url_pop)
  .then(function (response) {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText))
    }
    return Promise.resolve(response)
  })
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    var data_id_2 = '';
    for (var i = 0; i < data.length; i++) {
      var comma = "";
      var i2 = i+1;
      if (i2 != data.length) {
        comma = ",";
      }
      var data_id_3 = data[i]['id'] + comma;
      data_id_2 += data_id_3;
    }
    let data_id = data_id_2.split(/\s*,\s*/);
    var arr2 = arr_filter_genres.filter(function(item) {
      for (var key in data_id) {
        if (item.id == data_id[key])
          return true;
      }
    });

    // Запускаем функцию вывода тайтлов на страницу
    load_favorites(arr2, block_id);
    preloader_none();
  })

  .catch(function (error) {
    console.log('error', error)
  })
}

// Функция вывода тайтлов в блок по его block_id
function load_favorites(arr, block_id) {
  var data = arr;
  for (let i = 0; data[i]; i++) {
    var series_t = data[i]["type"]["series"];
    var string_t = data[i]["type"]["code"];
    var series_text;
    if (data[i]["player"]["series"]["last"]) {
      if (series_t) {
        series_text = 'Серия '+data[i]["player"]["series"]["last"]+'/'+series_t;
      }else {
        series_text = 'Серия '+data[i]["player"]["series"]["last"];
      }
    } else {
      series_text = 'Серия '+series_t;
    }
    var series_type;
    if (series_t == null && string_t != '0' && string_t != '2' && string_t != '3' && string_t != '4') {
      series_type = series_text;
    } else if(series_t == null && string_t == null) {
      series_type = series_text;
    } else if(string_t == '4') {
      series_type = 'Спешл';
    } else if(string_t == '0') {
      series_type = 'Фильм';
    } else if(string_t == '3') {
      series_type = 'ONA';
    } else if(string_t == '2') {
      series_type = 'OVA';
    } else {
      series_type = series_text;
    }

    var div = document.createElement('div');
    document.getElementById(block_id).appendChild(div);
    var genres = '';
    var my_home_style = localStorage.getItem('my_home_style');
    if (!my_home_style || my_home_style == '1') {
      if(data[i]["genres"][2] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
      } else if(data[i]["genres"][1] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
      } else if(data[i]["genres"][0] != undefined) {
        genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
      }
      div.className = 'article';
      div.setAttribute("style", "background-image: url('https://www.anilibria.tv"+data[i]["posters"]["medium"]["url"]+"')");
      div.innerHTML += `
          <a class="article-text"  href="release?id=${data[i]["id"]}">
            <p class="article-name"  style="-webkit-line-clamp: 3;line-clamp: 3;">${data[i]["names"]["ru"]}</p>
            ${genres}
            <p class="article-description">${data[i]["description"]}</p>
          </a>
          <div class="article_ser">${series_type}</div>`;
    } else if (my_home_style = '2') {
      if(data[i]["genres"][2] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
      } else if(data[i]["genres"][1] != undefined) {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
      } else {
        genres = '<p class="article_description_design_2" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
      }
      div.className = 'article_design_2';
      div.innerHTML += `
          <a href="release?id=${data[i]["id"]}">
            <img src="https://www.anilibria.tv${data[i]["posters"]["medium"]["url"]}" alt="">
            <div class="text_block_design_2">
              <p class="article_name_design_2"  style="-webkit-line-clamp: 1;line-clamp: 1;">${data[i]["names"]["ru"]}</p>
              ${genres}
              <p class="article_description_design_2" style="-webkit-line-clamp: 5;line-clamp: 5;">${data[i]["description"]}</p>
            </div>
          </a>`;
    }
  }
}





// Функция вывода тайтлов в блок слайдера отсортированных по популярности
function article_small_favorites(block_id) {
  // Получаем из кэша браузера все тайтлы
  var arr_api = JSON.parse(localStorage.getItem('my_api_cash'));

  // Получаем из кэша браузера жанры которые нельзя отображать
  var cookie_genres = localStorage.getItem('my_genres');
  if (cookie_genres) {
    genres = cookie_genres.split(/\s*,\s*/);
  } else {
    localStorage.setItem('my_genres', '');
    cookie_genres = localStorage.getItem('my_genres');
    genres = cookie_genres.split(/\s*,\s*/);
  }

  // Удаляем из результата жанры которые нельзя отображать
  arr = arr_api.filter(function(item) {
  for (var key in genres) {
      if (item.genres.includes(genres[key]))
        return false;
    }
    return true;
  });

  // Получаем значения посе фильтра
  arr.sort((a, b) => (a.in_favorites < b.in_favorites) ? 1 : -1);

  // Получаем 20 тайтлов
  arr_small = arr.slice(0, 20);

  // Запускаем функцию вывода тайтлов на страницу
  load_small(arr_small, block_id);
}

// Функция вывода тайтлов в блок слайдера ожидаемых сегодня
function article_small_dey(url_pop, block_id) {
  var block_id
  fetch(url_pop)
  .then(function (response) {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText))
    }
    return Promise.resolve(response)
  })
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    var days = ['6','0','1','2','3','4','5'];
    var d = new Date();
    var n = d.getDay();
    var my_date = days[n];
    if (days[n] = '0') {
      var data_day = data[0]["list"];
    } else if (days[n] = '1') {
      var data_day = data[1]["list"];
    } else if (days[n] = '2') {
      var data_day = data[2]["list"];
    } else if (days[n] = '3') {
      var data_day = data[3]["list"];
    } else if (days[n] = '4') {
      var data_day = data[4]["list"];
    } else if (days[n] = '5') {
      var data_day = data[5]["list"];
    } else if (days[n] = '6') {
      var data_day = data[6]["list"];
    }

    for (let i = 0; data_day[i]; i++) {
      // Получаем из кэша браузера все тайтлы
      var arr_api = JSON.parse(localStorage.getItem('my_api_cash'));

      // Получаем из кэша браузера жанры которые нельзя отображать
      var cookie_genres = localStorage.getItem('my_genres');
      if (cookie_genres) {
        genres = cookie_genres.split(/\s*,\s*/);
      } else {
        localStorage.setItem('my_genres', '');
        cookie_genres = localStorage.getItem('my_genres');
        genres = cookie_genres.split(/\s*,\s*/);
      }

      // Удаляем из результата жанры которые нельзя отображать
      arr_filter_genres = arr_api.filter(function(item) {
      for (var key in genres) {
          if (item.genres.includes(genres[key]))
            return false;
        }
        return true;
      });

      // Получаем значения посе фильтра
      arr_small = arr_filter_genres.filter(function(item) {if (item.id == data_day[i]['id']){return true}});

      // Запускаем функцию вывода тайтлов на страницу
      load_small(arr_small, block_id);
    }

  })

  .catch(function (error) {
    console.log('error', error)
  })
}

// Функция вывода тайтлов в блок слайдера
function load_small(arr_small, block_id) {
  var data = arr_small;
  for (let i = 0; data[i]; i++) {
    var series_t = data[i]["type"]["series"];
    var string_t = data[i]["type"]["code"];
    var series_text;
    if (data[i]["player"]["series"]["last"]) {
      if (series_t) {
        series_text = 'Серия '+data[i]["player"]["series"]["last"]+'/'+series_t;
      }else {
        series_text = 'Серия '+data[i]["player"]["series"]["last"];
      }
    } else {
      series_text = 'Серия '+series_t;
    }
    var series_type;
    if (series_t == null && string_t != '0' && string_t != '2' && string_t != '3' && string_t != '4') {
      series_type = series_text;
    } else if(series_t == null && string_t == null) {
      series_type = series_text;
    } else if(string_t == '4') {
      series_type = 'Спешл';
    } else if(string_t == '0') {
      series_type = 'Фильм';
    } else if(string_t == '3') {
      series_type = 'ONA';
    } else if(string_t == '2') {
      series_type = 'OVA';
    } else {
      series_type = series_text;
    }

    var div = document.createElement('div');
    document.getElementById(block_id).appendChild(div);
    div.className = 'article';
    div.setAttribute("style", "background-image: url('https://www.anilibria.tv"+data[i]["posters"]["medium"]["url"]+"');margin-top: 45px;width: 200px;height: 290px;");
    var genres = '';
    if(data[i]["genres"][2] != undefined) {
      genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1]+' | '+data[i]["genres"][2] + '</p>';
    } else if(data[i]["genres"][1] != undefined) {
      genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0]+' | '+data[i]["genres"][1] + '</p>';
    } else if(data[i]["genres"][0] != undefined) {
      genres = '<p class="article-description" style="margin-bottom: 5px;">'+data[i]["genres"][0] + '</p>';
    }
    div.innerHTML = `
        <a class="article-text"  href="release?id=${data[i]["id"]}">
          <p class="article-name" style="-webkit-line-clamp: 3;line-clamp: 3;">${data[i]["names"]["ru"]}</p>
          ${genres}
          <p class="article-description" style="-webkit-line-clamp: 8;line-clamp: 8;">${data[i]["description"]}</p>
        </a>
        <div class="article_ser" style="margin-top: 200px;">${series_type}</div>
      `;
  }
}



function message_body(text, display) {
  var div = document.createElement('div');
  document.getElementById('block_notif').appendChild(div);
  div.className = 'notif';
  div.setAttribute("style", 'transition: .3s ease;color: var(--card-text-color-2);padding: 10px 10px;width: 100%;background: var(--card-background-3);margin-bottom: 10px;opacity: 0.9;');
  div.innerHTML = `<p style="width: 100%;word-wrap: break-word;" onclick="notif_none()">${text}</p>`;
  if (display != 1) {
    setTimeout(function(){
      var block_header = document.getElementsByClassName('notif');
      for (var i = 0; i < block_header.length; i++) {
        notif_none();
      }
    },5000);
  }
}
function notif_none() {
  setTimeout(function(){
    var block_header = document.getElementsByClassName('notif');
    for (var i = 0; i < block_header.length; i++) {
      block_header[i].setAttribute("style" , "margin-top: -70px; transition: .3s ease;");
      setTimeout(function(){
        var container_favorites = document.getElementById("block_notif");
        var elements_favorites = container_favorites.getElementsByClassName("notif");
        while (elements_favorites[0]) {
            elements_favorites[0].parentNode.removeChild(elements_favorites[0]);
        }
      },300);
    }
  },300);
}

// Функция прокрутки вверх
function Scroll_to_top() {
  'use strict';

  function trackScroll() {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopBtn.classList.add('back_to_top-show');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('back_to_top-show');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  var goTopBtn = document.querySelector('.back_to_top');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);
};


// WebSocket
const socket = new WebSocket('wss://api.anilibria.tv/v2/ws/');
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({
      "subscribe": {
        "title_update": {
              "title": {
                  "season": {
                    "year": "*"
                  }
              }
          }
      }
      // "filter": "id,names.ru"
    }));
});

socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
    let data_WebSocket = JSON.parse(event.data);
    if (data_WebSocket['type'] == 'title_update') {
      load_api_cash(); // Если появился новый тайтл,
    }
});
