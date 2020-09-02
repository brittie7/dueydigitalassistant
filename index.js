"use strict";
let maxResults;

/*GOOGLE BOOKS API*/

const booksURL =
  "https://www.googleapis.com/books/v1/volumes?fields=kind,items(volumeInfo/title,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/description,volumeInfo/imageLinks/thumbnail)";
let booksApiKey = config.booksSecretKey;

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
              displayResults(response1, response2, response3);
            });
        })

        .catch((err) => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
    });
}

function displayResults(response1, response2, response3) {
  $(
    "#js-results-list-video, #js-results-list-books, #js-results-list-podcast"
  ).empty();

  for (let i = 0; i < response1.items.length; i++) {
    $("#js-results-list-video").append(
      `<li><a href="https://www.youtube.com/watch?v=${response1.items[i].id.videoId}"><img src="${response1.items[i].snippet.thumbnails.default.url}" alt="video thumbnail"></a><h3>${response1.items[i].snippet.title}</h3><p>${response1.items[i].snippet.description}</p>
      </li>`
    );
  }

  for (let i = 0; i < response2.items.length; i++) {
    $("#js-results-list-books").append(
      `<li><img src="${response2.items[i].volumeInfo.imageLinks.thumbnail}"><h3>${response2.items[i].volumeInfo.title}</h3><p>${response2.items[i].volumeInfo.description}</p>
      </li>`
    );
  }

  for (let i = 0; i < maxResults; i++) {
    $("#js-results-list-podcast").append(
      `<li><img src="${response3.results[i].thumbnail}"><h3>${response3.results[i].title_original}</h3><p>${response3.results[i].description_original}</p>
      </li>`
    );

    //display the results section
    $("#results").removeClass("hidden");
  }
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    maxResults = $("#js-max-results").val();
    console.log(searchTerm, maxResults);
    getResources(searchTerm, maxResults);
  });
}

$(watchForm);

// https://api.github.com/users/brittie7/repos
// just building something that adds
