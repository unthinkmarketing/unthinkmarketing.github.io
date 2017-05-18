$(document).ready(function () {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    var modalHead = $('#modal-h2');
    var modalBody = $('#modal-p');
    var modalFooter = $('#modal-a');

    clearModal();

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


    $('.results-warning').click(function () {
        var warning = $(this).attr('data-tab');

        if (warning === "min") {
            modalFooter.attr("href", "http://betabulls.com/");
            setModal("You can optimize by doing this:", "Minifying css and js files in order to decrease total page size", "Don't believe us? Click here to see it in action.");
        } else if (warning === "compat") {
            modalFooter.attr("href", "http://www.google.com/");
            setModal("Browser compatability", "Some of your code is not widely compatible, this can be fixed by using prefixes or APIs.", "Click here to see a list of the most widely used browers.");
        } else if (warning === "testing-war") {
            modalFooter.attr("href", "http://betabulls.com/");
            setModal("Problem title", "Error description, this won't appear when we don't have anything to say", "CTA or similar item");
        }
    });

    $('.close').click(function () {
        clearModal();
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            clearModal();
            modal.style.display = "none";
        }
    }

    function clearModal() {
        modalHead.text("");
        modalBody.text("");
        modalFooter.text("");
    }

    function setModal(headText, bodyText, footerText) {
        modalHead.text(headText);
        modalBody.text(bodyText);
        modalFooter.text(footerText);
        modal.style.display = "block";
    }
});
