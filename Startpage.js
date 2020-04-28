/*  Localstorage:
 *  key is the site name
 *  value is the site url
 */

$('#main *, #edit-container *').keydown((event) => {
  if (event.keyCode === 9) {
    event.preventDefault();
    $('#search').focus();
    $('html').scrollTop(0);
  }
});

function hideList() {
  $('#links').fadeOut(250);
  $('#search').width('184px');
}

function showList() {
  $('#links').fadeIn(250);
  if ($('#search').val().length > 0) {
    $('#search').width('400px');
  }
}

function compare(a, b) {
  const itemA = a.name.toLowerCase();
  const itemB = b.name.toLowerCase();

  if (itemA > itemB) {
    return 1;
  }
  if (itemA < itemB) {
    return -1;
  }
  return 0;
}

function initializeList() {
  $("#links").html("");
  updateList("");
}

function updateList(substring, index) {
  $("#links").html("");

  let links;
  let arr = [];

  if (localStorage['bookmarks']) {
    links = JSON.parse(localStorage['bookmarks']);
  } else {
    links = {};
  }

  for (let obj of Object.entries(links)) {
    if (obj[0].toString().toLowerCase().includes(substring.toLowerCase())) {
      arr.push({
        'name': decodeURIComponent(obj[0]),
        'url': obj[1]
      });
    }
  }

  arr.sort(compare);

  for (let i = 0; i < arr.length; i++) {
    $("#links").append("<a href='" + arr[i].url + "'>" + arr[i].name + "</a>");
  }

  if (index) {
    $('#links a').eq(index).addClass('selected');
  } else {
    $('#links a').eq(0).addClass('selected');
  }
}

function addSite() {
  const siteName = $("#sitename").val();
  let siteURL = $("#siteurl").val();
  const encoded = encodeURIComponent(siteName);

  if (!(siteURL.includes("https://") || siteURL.includes("http://"))) {
    siteURL = "https://" + siteURL;
  }

  let links;

  if (localStorage['bookmarks']) {
    links = JSON.parse(localStorage['bookmarks']);
  } else {
    links = {};
  }

  links[encoded] = siteURL;

  localStorage['bookmarks'] = JSON.stringify(links);

  updateList('');
  $('#sitename').val('');
  $('#siteurl').val('');
  $('#sitename').focus();
  updateEditList();
}

//	Hit enter while adding a site
$("#siteurl").keyup(function (event) {
  if (event.keyCode === 13) {
    if ($("#sitename").val() != "" && $("#siteurl").val() != "") {
      addSite();
    }
  }
});

$('#search').keydown(function (event) {
  const index = $('#links a.selected').index();
  const length = $('#links a').length;

  if (event.keyCode === 9) { //  Hit tab
    event.preventDefault();
    $('#links a.selected').toggleClass('selected');
    $('#links a').eq((index + 1) % length).toggleClass('selected');
  } else if (event.keyCode === 38) { // Hit up
    $('#links a.selected').toggleClass('selected');
    $('#links a').eq((index - 1) % length).toggleClass('selected');
  } else if (event.keyCode === 40) { // Hit down
    $('#links a.selected').toggleClass('selected');
    $('#links a').eq((index + 1) % length).toggleClass('selected');
  }
})

// Typing in notes
$('#notes').keyup(() => {
  let value = $('#notes').val();

  localStorage['notes'] = JSON.stringify(value);
})

//	Typing in the search bar
$("#search").keyup(function (event) {
  let value = $(this).val();

  if (value.length > 0) {
    $('#search').width('400px');
  } else {
    $('#search').width('184px');
  }

  //  Hit enter
  if (event.keyCode === 13) {
    if ($("#links").children().length > 0) {
      window.open($("#links a.selected").attr('href'), "_self");
    } else if (value.substring(0, 2) === "y ") {
      window.open("https://youtube.com/search?q=" + value.substring(2), "_self");
    } else if (value.substring(0, 2) === "g ") {
      window.open("https://google.com/search?q=" + value.substring(2), "_self");
    } else if (value.substring(0, 2) === "d ") {
      window.open("https://duckduckgo.com/?q=" + encodeURIComponent(value.substring(2)), "_self");
    } else if (value.substring(0, 3) === "/r/") {
      window.open("https://reddit.com" + value, "_self");
    } else if (value.substring(0, 2) === "m ") {
      window.open("https://mangadex.org/search?title=" + value.substring(2), "_self");
    } else if (value.substring(0, 3) === "wi ") {
      window.open("https://en.wikipedia.org/w/index.php?search=" + value.substring(3), "_self");
    } else if (value.substring(0, 5) === "dict ") {
      window.open("https://www.merriam-webster.com/dictionary/" + value.substring(5), "_self");
    } else if (value.substring(0, 3) === "wa ") {
      window.open("https://www.wolframalpha.com/input/?i=" + encodeURIComponent(value.substring(3)), "_self");
    } else if (value.length > 1 && value[0] === "/" && value[value.length - 1] === "/") {
      window.open("https://boards.4channel.org/" + value.substring(1, value.length - 1), "_self");
    } else if (value.includes(".")) {
      if (value.includes("http")) {
        window.open(value, "_self");
      } else {
        window.open("https://" + encodeURIComponent(value), "_self");
      }
    } else {
      window.open("https://duckduckgo.com/?q=" + value, "_self");
    }
  } else if (event.keyCode === 27) { //	Hit escape instead of enter
    if (value == "") {
      $(this).blur();
    }

    $('#search').width('184px');
    $(this).val("");
    value = $(this).val();
    updateList("");
  } else if (event.keyCode === 9 || (event.keyCode >= 37 && event.keyCode <= 40)) {

  } else if (event.keyCode === 37 || event.keyCode === 39) {} else {
    updateList(value);
  }

  if (value === "help") {
    $("#modal").fadeIn(200);
  } else {
    $("#modal").fadeOut(200);
  }
});

function updateTime() {
  var date = new Date($.now());
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear();
  var hour = date.getHours();
  var min = date.getMinutes();
  var greeting = "";

  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (min < 10) {
    min = "0" + min;
  }

  if (hour < 5) {
    greeting = "Good Night!";
  } else if (hour < 12) {
    greeting = "Good Morning!"
  } else if (hour < 16) {
    greeting = "Good Afternoon!";
  } else if (hour < 21) {
    greeting = "Good Evening!";
  } else {
    greeting = "Good Night!";
  }

  var time = hour + ":" + min;
  var dateText = months[month] + " " + day + ", " + year;

  $("#time").text(time);
  $("#greeting").text(greeting);
  $("#date").text(dateText)
}

function openEdit() {
  // if (!editOpened) {
  // 	$("#edit-container").fadeIn(300);
  // 	$("#edit").animate({right: "375px"}, 200);
  // 	$("#add").fadeOut(200);
  // 	editOpened = !editOpened;
  // } else {
  // 	$("#edit-container").fadeOut(150);
  // 	$("#edit").animate({right: "30px"}, 400);
  // 	$("#add").fadeIn(200);
  // 	editOpened = !editOpened;
  // }
}

function deleteSite(site) {
  let links;

  if (localStorage['bookmarks']) {
    links = JSON.parse(localStorage['bookmarks']);
  } else {
    links = {};
  }

  delete links[encodeURIComponent(site)];

  console.log(links);

  localStorage['bookmarks'] = JSON.stringify(links);

  updateEditList();
  updateList($("#search").val());
}

function updateEditList() {
  $('#edit-container').html('');

  let links;

  if (localStorage['bookmarks']) {
    links = JSON.parse(localStorage['bookmarks']);
  } else {
    links = {};
  }

  const arr = [];

  for (let obj of Object.entries(links)) {
    arr.push({
      'name': decodeURIComponent(obj[0]),
      'url': obj[1]
    });
  }

  arr.sort(compare);

  for (var i = 0; i < arr.length; i++) {
    $("#edit-container").append("<div><p>" + arr[i].name + "</p><p>" + arr[i].url + "</p><button type='button' onclick=deleteSite('" + arr[i].name + "')>Delete</button>");
  }
}

function getWeather() {
  $.get("https://api.openweathermap.org/data/2.5/weather?zip=19120&appid=6b2d34c1fdae064a380bfb26b3d6af1a&units=imperial", (data) => {
    const condition = data.weather[0].description;
    const temperature = Math.round(data.main.temp);
    const low = Math.round(data.main.temp_min);
    const high = Math.round(data.main.temp_max);
    const location = data.name;
    $("#weather").text(location + ' // ' + condition + ' ' + temperature + ' // ' + low + ' to ' + high);
  });
}

function getWallpaper() {
  var hour = new Date($.now()).getHours();
  const light = ['morning.gif', 'sakuratrain.gif', 'island.png', 'deer.gif', 'vendings.gif', 'readingonthetrain.gif'];
  const dark = ['waterfall.jpg', 'vending.gif', 'rain.gif', 'clover.gif', 'fish.gif', 'pond.gif', 'slums.gif', 'constellation.png', 'deloreon.gif'];
  let path = 'url(';

  if (hour >= 6 && hour < 18) {
    path += 'light/' + light[Math.floor(Math.random() * light.length)] + ')';
  } else {
    path += 'dark/' + dark[Math.floor(Math.random() * dark.length)] + ')';
  }

  $('html').css('background-image', path);
}

$(document).ready(function () {
  $("#modal").hide(0);
  $('#modal').css('visibility', 'visible');
  if (localStorage['notes']) {
    $('#notes').val(JSON.parse(localStorage['notes']));
  }
  initializeList();
  updateTime();
  updateEditList();
  getWeather();
  getWallpaper();

  setInterval(function () {
    updateTime()
  }, 1000);
});