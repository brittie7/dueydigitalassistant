

// let bookSection = document.getElementById("booksResults");
// let podcastSection = document.getElementById("podcastResults");
// let videoSection = document.getElementById("videoResults");

// let booksNav = document.getElementById("booksNav");
// let podcastNav = document.getElementById("podcastNav");
// let videoNav = document.getElementById("videoNav");

// function hideResults() {
//     console.log('hideResults Ran');
//     $("#booksNav").on("click", function (event) {
//         $("#podcastResults").hide();
//     })

//     $("#booksNav").on("click", function (event) {
//         $("videoResults").hide();
//     })
// };

// function handleSearch() {
//     hideResults();
// };

// $(handleSearch);

function displayContent(evt, contentType) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(contentType).style.display = "block";
    evt.currentTarget.className += " active";
}