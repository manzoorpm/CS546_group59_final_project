// front end javascript module

if ($('#here').length) {
    document.getElementById("here").scrollIntoView();
}

$(".deleteReview").click(function () {
    window.location.href = "/restaurant/delete-review/" + $(this).data('id');
});

