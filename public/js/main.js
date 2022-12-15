// front end javascript module


$(".deleteReview").click(function () {
    window.location.href = "/restaurant/delete-review/" + $(this).data('id');
});

$('.alert').alert();
