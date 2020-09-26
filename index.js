"use strict";

let maxResults;

/*GOOGLE BOOKS API*/

const booksURL =
  "https://www.googleapis.com/books/v1/volumes?fields=kind,items(volumeInfo/title,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/description,volumeInfo/imageLinks/thumbnail,volumeInfo/industryIdentifiers,volumeInfo/publishedDate)";
let booksApiKey = config.booksSecretKey;
google.books.load();

/* YOUTUBE API */

const videoURL =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video";
let videoApiKey = config.videoSecretKey;

/* LISTEN NOTES API */

const podcastURL =
  "https://listen-api.listennotes.com/api/v2/search?type=podcast";
let podcastApiKey = config.podcastSecretKey;

const podcastHeader = {
  headers: new Headers({
    "X-ListenAPI-Key": podcastApiKey,
  }),
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (keys) => `${encodeURIComponent(keys)}=${encodeURIComponent(params[keys])}`
  );
  return queryItems.join("&");
}

/*RETURNS EACH TYPE OF RETULT BASED ON SEARCH CRITERIA*/
function getResources(query, maximumResults) {
  /*CREATES THE VIDEO URL DYNAMICALLY*/
  const videoParams = {
    key: videoApiKey,
    q: query,
    maxResults: maximumResults,
  };
  const queryStringVideo = formatQueryParams(videoParams);
  const urlVideo = videoURL + "&" + queryStringVideo;

  /*CREATES THE BOOKS URL DYNAMICALLY*/
  const bookParams = {
    Key: booksApiKey,
    q: query,
    maxResults: maximumResults,
  };
  const queryStringBooks = formatQueryParams(bookParams);
  const urlBooks = booksURL + "&" + queryStringBooks;

  /*CREATES THE PODCAST URL DYNAMICALLY*/
  const podcastParams = {
    Key: podcastApiKey,
    q: query,
    maxResults: maximumResults,
  };

  const queryStringPodcasts = formatQueryParams(podcastParams);
  const urlPodcasts = podcastURL + "&" + queryStringPodcasts;

  fetch(urlVideo)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response1) => {
      fetch(urlBooks)
        .then((response1) => {
          if (response1.ok) {
            return response1.json();
          }
          throw new Error(response1.statusText);
        })
        .then((response2) => {
          fetch(urlPodcasts, podcastHeader)
            .then((response2) => {
              if (response2.ok) {
                return response2.json();
              }
              throw new Error(response2.statusText);
            })
            .then((response3) => {
              // console.log(response1, response2, response3);
              displayResults(response1, response2, response3);
            });
        })
        .catch((err) => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
    });
}

function displayResults(response1, response2, response3) {
  $("#Videos, #Books, #Podcasts").empty();

  //   //VIDEOS//
  for (let i = 0; i < response1.items.length; i++) {
    let videoPubDate = response1.items[i].snippet.publishedAt;
    let videoPubYear = videoPubDate.slice(0, 4);
    let videoChannel = response1.items[i].snippet.channelTitle;
    if (response1.items[i].snippet.description.length > 220) {
      $("#Videos").append(
        `<div class="contentBlockOuter">
    <h3>${response1.items[i].snippet.title}</h3>

    <div class="contentBlock videoWrap">
      <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${
        response1.items[i].id.videoId
      }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <ul class="contentBlockDetails">
        <li>Channel: ${videoChannel}</li>
        <li class="published">Published: ${videoPubYear}</li>
        <li class="description">${
          response1.items[i].snippet.description.slice(0, 219) + " ..."
        }.</li>
      </ul>
    </div>
</div>`
      );
    } else {
      $("#Videos").append(
        `<div class="contentBlockOuter">
    <h3>${response1.items[i].snippet.title}</h3>
    <div class="contentBlock videoWrap">
      <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${response1.items[i].id.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <ul class="contentBlockDetails">
      <ul class="contentBlockDetails">
        <li>Channel: ${videoChannel}</li>
        <li class="published">Published: ${videoPubYear}</li>
        <li class="description">${response1.items[i].snippet.description}.</li>
      </ul>
    </div>
</div>`
      );
    }
  }
  //BOOKS//

  for (let i = 0; i < response2.items.length; i++) {
    let bookPubDate = response2.items[i].volumeInfo.publishedDate;
    let bookPubYear = bookPubDate.slice(0, 4);
    // console.log(bookPubYear);
    // console.log(typeof (response2.items[i].volumeInfo.industryIdentifiers[0].type + ": " + response2.items[i].volumeInfo.industryIdentifiers[0].identifier));
    let previewID =
      response2.items[i].volumeInfo.industryIdentifiers[0].identifier;

    if (response2.items[i].volumeInfo.description.length > 220) {
      $("#Books").append(
        `<div class="contentBlockOuter">
          <h3>${response2.items[i].volumeInfo.title}</h3>
          <div class="contentBlock">
            <div class="contentBlockImages">
              <img src="${
                response2.items[i].volumeInfo.imageLinks.thumbnail
              }"" class="limitWidth" alt="Picture of ${
          response2.items[i].volumeInfo.title
        }'s book cover">
            </div>
            <ul class="contentBlockDetails">
              <li>Author: ${response2.items[i].volumeInfo.authors}</li>
              <li class="published">Published: ${bookPubYear}</li>
              <li class="description">${
                response2.items[i].volumeInfo.description.slice(0, 219) + " ..."
              }</li>
              <button class="btn previewIcon" id="${previewID}"> <i class="fas fa-eye"></i>Preview</button>
            </ul>
          </div>

        </div>
      </div>`
      );
    } else {
      $("#Books").append(
        `<div class="contentBlockOuter">
          <h3>${response2.items[i].volumeInfo.title}</h3>
          <div class="contentBlock">
            <div class="contentBlockImages">
              <img src="${response2.items[i].volumeInfo.imageLinks.thumbnail}"" class="limitWidth" alt="Picture of ${response2.items[i].volumeInfo.title}'s book cover">
            </div>
            <ul class="contentBlockDetails">
              <li>Author: ${response2.items[i].volumeInfo.authors}</li>
              <li class="published">Published: ${bookPubYear}</li>
              <li class="description">${response2.items[i].volumeInfo.description}</li>
              <button class="btn previewIcon id="${previewID}"> <i class="fas fa-eye"></i>Preview</button>
            </ul>
          </div>
        </div>
      `
      );
    }

    $(`#${previewID}`).click(function (e) {
      $(".viewerCanvas").remove();
      const previewer = document.createElement("div");

      previewer.classList = "viewerCanvas";
      $(this).parent().append(previewer);
      let viewer = new google.books.DefaultViewer(
        document.getElementsByClassName("viewerCanvas")[0]
      );
      viewer.load(`ISBN:${previewID}`);
    });
  }

  // //PODCASTS//

  const end =
    response3.results.length < maxResults
      ? response3.results.length
      : maxResults;
  for (let i = 0; i < end; i++) {
    console.log(response3.results[i]);
    let podcastPubDate = new Date(response3.results[i].earliest_pub_date_ms);
    console.log(typeof podcastPubDate);
    let podcastPubYear = podcastPubDate.getFullYear();
    let podcastDesc = response3.results[i].description_original;

    if (response3.results[i].description_original.length > 220) {
      $("#Podcasts").append(`
      <div class="contentBlockOuter">
        <h3>${response3.results[i].title_original}</h3>
        <div class="contentBlock">
          <div class="contentBlockImages">
            <img src="${
              response3.results[i].thumbnail
            }" class="limitWidth"" alt="Picture of ${
        response3.results[i].title_original
      }'s cover">
          </div>
          <ul class="contentBlockDetails">
            <li>Publisher: ${response3.results[i].publisher_highlighted}</li>
            <li class="published">Published: ${podcastPubYear}</li>
            <li class="description">${podcastDesc.slice(0, 219) + " ..."}</li>
            <button class="btn previewIcon"> <i class="fas fa-play"></i><a href="${
              response3.results[i].website
            }" target="_blank">Listen</a></button>          </ul>
        </div>
      </div>`);
    } else {
      $("#Podcasts").append(`<div class="contentBlockOuter">
        <h3>${response3.results[i].title_original}</h3>
        <div class="contentBlock">
          <div class="contentBlockImages">
            <img src="${response3.results[i].thumbnail}" class="limitWidth" alt="Picture of ${response3.results[i].title_original}'s cover">
          </div>
          <ul class="contentBlockDetails">
            <li>Publisher: ${response3.results[i].publisher_highlighted}</li>
            <li class="published">Published: ${podcastPubYear}</li>
            <li class="description">${podcastDesc}</li>
            <button class="btn previewIcon"> <i class="fas fa-play"></i><a href="${response3.results[i].website}" target="_blank">Listen</a></button>
          </ul>
        </div>
    </div>`);
    }
  }

  //display the results section
  $("#results").removeClass("hidden");
}

{
  /* <audio controls>
  <source src="horse.ogg" type="audio/ogg">
  <source src="horse.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio> */
}

function alertNotFound() {
  alert("No preview available for this book");
}

function previewBook(previewIDStr) {
  console.log("previewBook ran");
  let viewer = new google.books.DefaultViewer(
    document.getElementById("viewerCanvas")
  );
  viewer.load(previewIDStr, alertNotFound);
}

function tabWatcher() {
  //Changes the way that the tab looks
  $(".tablinks").click(function (e) {
    $(".tablinks.active").removeClass("active");
    $(e.target).addClass("active");

    //Changes which data is showing
    let contentType = $(e.target).text(); //Books or Podcasts or Videos
    $(".tabcontent").hide();
    $(`#${contentType}`).show();
  });
  // 1 - some el with .tablinks
  // 2 - some el with .tabcontent
  // 3 - 1st el has to have text that matches the id of 2nd element
}

function main() {
  tabWatcher();
}

$(main);

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#searchDuey").val();
    maxResults = $("#js-max-results").val();
    // console.log(searchTerm, maxResults);
    getResources(searchTerm, maxResults);
  });
  google.books.load();
}

$(watchForm);

// https://api.github.com/users/brittie7/repos
// just building something that adds
