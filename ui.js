

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

// function showBooksByDefault() {
//     let defaultBooks = document.getElementById("#Books")
//     defaultBooks.className += " active";
// }
// let viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));

// function bookPreview() {
//     console.log('bookPreview ran');
//     // $('btn previewIcon').on('click', 'button', function (event) {
//     $('button').click(function (e) {
//         console.log(this.getAttribute('id'));
//         debugger
//         viewer.load(this.getAttribute('id')); //onClick of the preview button, it needs to pass the preview link to the viewer.load
//     })
// };

function tabWatcher() {
    $('.tablinks').click(function (e) {
        $('.tablinks.active').removeClass('active')
        $(e.target).addClass('active');

        let contentType = $(e.target).text();
        $('.tabcontent').hide();
        $(`#${contentType}`).show();
    })
    // 1 - some el with .tablinks
    // 2 - some el with .tabcontent
    // 3 - 1st el has to have text that matches the id of 2nd element
}

function main() {
    tabWatcher();
}

$(main);