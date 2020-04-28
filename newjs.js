/*
 * Links are saved in localstorage as key value pairs in a JSON string held by localStorage.bookmarks
 */


$('#main *, #edit-container *').keydown((event) => {
  if (event.keyCode === 9) { // keycode 9 is tab key
    event.preventDefault(); // prevent focusing to thee next element
    $('#search').focus();
    $('html').scrollTop(0); // scroll to the top
  }
});

/**
 * Hides the list of links.
 * Used by html onblur and onfocus.
 */
function hideList() {
  $('#links').fadeOut(250);
  $('#search').width('184px');
}

/**
 * Shows the list of links.
 * Used by html onblur and onfocus.
 */
function showList() {
  if ($('#search').val().length > 0) { // if search bar has anything in it
    $('#search').width('400px');
    $('#links').fadeIn(250);
  }
}

/**
 * Compares 2 links using their names.
 * Used by js sort functoin.
 * @returns {number} 1 if a > b, -1 if a < b, 0 if a == b
 */
function compareLinks(a, b) {
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

/**
 * Clears and updates links list.
 * @param {string} substring substring that links must contain
 * @param {number} index index of selected link
 */
function updateList(substring, index) {
  $('#links').html('');

  let links;
  let arr = [];

  if (localStorage.bookmarks) { // If bookmarks exists in localStorage
    links = JSON.parse(localStorage.bookmarks);
  } else {
    links = {};
  }

  if (substring === "*") {
    updateList("", index);
  } else {
    for (let link of Object.entries(links)) {
      if (link[0].toString().toLowerCase().includes(substring.toLowerCase())) {
        arr.push({
          'name': decodeURIComponent(link[0]),
          'url': link[1]
        });
      }
    }

    arr.sort(compareLinks);

    for (let i = 0; i < arr.length; i++) {
      $('#links').append('<a href="' + arr[i].url + '">' + arr[i].name + '</a>'); // create an anchor element for each link in arr
    }

    if (index) { // if index is passed as an argument
      $('#links a').eq(index).addClass('selected');
    } else {
      $('#links a').eq(0).addClass('selected');
    }
  }
}

/**
 * Clears and updates edit container
 */
function updateEditList() {
  $('#edit-container').html('');

  let links;
  const arr = [];

  if (localStorage.bookmarks) {
    links = JSON.parse(localStorage.bookmarks);
  } else {
    links = {};
  }

  for (let link of Object.entries(links)) {
    arr.push({
      'name': decodeURIComponent(link[0]),
      'url': link[1]
    });
  }

  arr.sort(compareLinks);

  for (let i = 0; i < arr.length; i++) {
    $('#edit-container').append('<div><p>' + arr[i].name + '</p><button type="button" onclick=deleteSite("' +
      arr[i].name + '")>Delete</button>');
  }
}

/**
 * Adds a site to saved links.
 */
function addSite() {
  const siteName = $('#sitename').val();
  let siteUrl = $('#siteurl').val();
  const encoded = encodeURIComponent(siteName);

  if (!(siteUrl.includes('https://') || siteUrl.includes('http://'))) {
    siteUrl = 'https://' + siteUrl;
  }

  let links;

  if (localStorage.bookmarks) {
    links = JSON.parse(localStorage.bookmarks);
  } else {
    links = {};
  }
  links[encoded] = siteUrl;

  localStorage.bookmarks = JSON.stringify(links);

  updateList('');
  updateEditList();

  $('#sitename').val('');
  $('#siteurl').val('');

  $('#sitename').focus();
}

/**
 * Deletes a site from saved links.
 * @param {string} site name of site to delete
 */
function deleteSite(site) {
  let links;

  if (localStorage.bookmarks) {
    links = JSON.parse(localStorage.bookmarks);
  } else {
    links = {};
  }

  delete links[encodeURIComponent(site)];

  localStorage.bookmarks = JSON.stringify(links);

  updateEditList();
  updateList($('#search').val());
}

/**
 * Gets date and inserts it to page.
 */
function updateTime() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date($.now());
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  let hour = date.getHours();
  let min = date.getMinutes();
  let greeting;

  if (hour < 10) {
    hour = '0' + hour;
  }

  if (min < 10) {
    min = '0' + min;
  }

  if (hour < 5) {
    greeting = 'Good Night!';
  } else if (hour < 12) {
    greeting = 'Good Morning!';
  } else if (hour < 17) {
    greeting = 'Good Afternoon!';
  } else if (hour < 21) {
    greeting = 'Good Evening!';
  } else {
    greeting = 'Good Night!';
  }

  const time = hour + ':' + min;
  const dateText = ' // ' + month + ' ' + day + ', ' + year;

  $('#time').text(time);
  $('#date').text(dateText);
  $('#greeting').text(greeting);
}

/**
 * Gets weather through openweathermap api and inserts it to page.
 */
function getWeather() {
  $.get('https://api.openweathermap.org/data/2.5/weather?zip=19120&appid=6b2d34c1fdae064a380bfb26b3d6af1a&units=imperial', (data) => {
    const condition = data.weather[0].main;
    const temperature = Math.round(data.main.temp);
    const low = Math.round(data.main.temp_min);
    const high = Math.round(data.main.temp_max);
    const location = data.name;
    $('#weather').text(location + ' // ' + temperature + ' ' + condition + ' // ' + low + ' to ' + high);
  });
}

/**
 * Gets a random wallpaper based on current time.
 */
function getWallpaper() {
  if ($('#gif-walls').prop('checked')) {
    const hour = new Date($.now()).getHours();
    const light = ['morning.gif', 'sakuratrain.gif', 'island.png', 'deer.gif', 'vendings.gif', 'readingonthetrain.gif'];
    const dark = ['waterfall.jpg', 'vending.gif', 'rain.gif', 'clover.gif', 'fish.gif', 'pond.gif', 'slums.gif', 'constellation.png',
      'deloreon.gif'
    ];
    let path = 'url(';
    const darkMode = $('#dark-switch').prop('checked');

    if (hour >= 6 && hour < 18 && !darkMode) {
      path += 'light/' + light[Math.floor(Math.random() * light.length)] + ')';
    } else {
      path += 'dark/' + dark[Math.floor(Math.random() * dark.length)] + ')';
    }

    $('html').css('background-image', path);
    $('html').css('image-rendering', 'crisp-edges');
  } else {
    $('html').css('background-image', 'url("wall.png")');
    $('html').css('image-rendering', 'auto');
  }
}

$(document).ready(() => {
  $('#modal').hide(0);
  $('#modal').css('visibility', 'visible');

  hideList();

  if (localStorage.notes) {
    $('#notes').val(JSON.parse(localStorage.notes));
  }

  if (localStorage.darkMode) {
    $('#dark-switch').prop('checked', JSON.parse(localStorage.darkMode));
  }

  if (localStorage.gifWalls) {
    $('#gif-walls').prop('checked', JSON.parse(localStorage.gifWalls));
  }

  updateList('');
  updateTime();
  updateEditList();
  getWeather();
  getWallpaper();

  setInterval(function () {
    updateTime()
  }, 1000);
})

// Keyup/keydown assignments

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
    event.preventDefault();
    $('#links a.selected').toggleClass('selected');
    $('#links a').eq((index - 1) % length).toggleClass('selected');
  } else if (event.keyCode === 40) { // Hit down
    event.preventDefault();
    $('#links a.selected').toggleClass('selected');
    $('#links a').eq((index + 1) % length).toggleClass('selected');
  }
});

// Typing in notes
$('#notes').keyup(() => {
  let value = $('#notes').val();

  localStorage['notes'] = JSON.stringify(value);
})

//	Typing in the search bar
$("#search").keyup(function (event) {
  let value = $(this).val();

  if (value.length > 0) {
    showList();
    // $('#search').width('400px');
  } else {
    hideList();
    // $('#search').width('184px');
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
      window.open("https://boards.4chan.org/" + value.substring(1, value.length - 1), "_self");
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

// Setting Switches
$('#dark-switch').change(() => {
  localStorage.darkMode = $('#dark-switch').prop('checked');
  getWallpaper();
});

$('#gif-walls').change(() => {
  localStorage.gifWalls = $('#gif-walls').prop('checked');
  getWallpaper();
})
