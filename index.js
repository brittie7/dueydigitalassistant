"use strict";
let maxResults;



function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (keys) => `${encodeURIComponent(keys)}=${encodeURIComponent(params[keys])}`
  );
  return queryItems.join("&");
}

/*RETURNS EACH TYPE OF RETULT BASED ON SEARCH CRITERIA*/
function getResources(query, maximumResults) {
  console.log("getResources ran");

  /*CREATES THE VIDEO URL DYNAMICALLY*/
  const videoParams = {
    key: videoApiKey,
    q: query,
    maxResults: maximumResults,
  };
  const queryStringVideo = formatQueryParams(videoParams);
  console.log("query string:", queryStringVideo);
  const urlVideo = videoURL + "&" + queryStringVideo;
  console.log(urlVideo);

  /*CREATES THE BOOKS URL DYNAMICALLY*/
  const bookParams = {
    Key: booksApiKey,
    q: query,
    maxResults: maximumResults,
  };
  const queryStringBooks = formatQueryParams(bookParams);
  console.log("query string books:", queryStringBooks);
  const urlBooks = booksURL + "&" + queryStringBooks;
  console.log(urlBooks);

  /*CREATES THE PODCAST URL DYNAMICALLY*/
  const podcastParams = {
    Key: podcastApiKey,
    q: query,
    maxResults: maximumResults,
  };

  console.log(podcastParams);
  const queryStringPodcasts = formatQueryParams(podcastParams);
  console.log("query string books:", queryStringPodcasts);
  const urlPodcasts = podcastURL + "&" + queryStringPodcasts;
  console.log(urlPodcasts);

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
  //add arguments for responses 1 and 2
  console.log("Video Results:", response1);
  console.log("Book Results", response2);
  console.log("Podcast Results:", response3);

  /*console.log(responseJson.items[0].id.videoId);
  console.log(responseJson.items[0].snippet.title);
  console.log(responseJson.items[0].snippet.thumbnails.default.url);
  console.log(responseJson.items[0].snippet.description);*/
  $(
    "#js-results-list-video, #js-results-list-books, #js-results-list-podcast"
  ).empty();

  for (let i = 0; i < response1.items.length; i++) {
    $("#js-results-list-video").append(
      `<li><a href="https://www.youtube.com/watch?v=${response1.items[i].id.videoId}"><img src="${response1.items[i].snippet.thumbnails.default.url}" alt="video thumbnail"></a><h3>${response1.items[i].snippet.title}</h3><p>${response1.items[i].snippet.description}</p>
      </li>`
    );
  }

  /*console.log("Books");
  console.log(response2);
  console.log(response2.items[0].volumeInfo.title);*/

  for (let i = 0; i < response2.items.length; i++) {
    $("#js-results-list-books").append(
      `<li><img src="${response2.items[i].volumeInfo.imageLinks.thumbnail}"><h3>${response2.items[i].volumeInfo.title}</h3><p>${response2.items[i].volumeInfo.description}</p>
      </li>`
    );
  }
  /* console.log(
    "check response 3 object",
    response3.results[0].thumbnail,
    response3.results[0].title_original,
    response3.results[0].description_original
  );*/

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
    console.log("WatchForm Ran");
    const searchTerm = $("#js-search-term").val();
    maxResults = $("#js-max-results").val();
    console.log(searchTerm, maxResults);
    getResources(searchTerm, maxResults);
  });
}

$(watchForm);

// https://api.github.com/users/brittie7/repos
// just building something that adds
