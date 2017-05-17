$(document).ready(function () {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    $('.tab-link').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('.tab-link').removeClass('current');
        $('.tab-link').removeClass('no-border');
        $('.tab-content').removeClass('current');
        $('.triangle').removeClass('current');


        $(this).addClass('current');
        $(this).addClass('no-border');
        $("#tab-" + tab_id).addClass('current');
        $("#tri-" + tab_id).addClass('current');
    });


    $('.results-tab-li').click(function () {
        modal.style.display = "block";
    });

    $('.close').click(function () {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
