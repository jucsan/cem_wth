function sidebar(){
    $('#mobileMenu').slideToggle();
    $('#sidebar i').toggleClass('sidebar').toggleClass('remove');
}

$('#sidebar').on('click', function(event){
    sidebar();
    event.stopPropagation();
});

$(document).not(document.querySelector('#sidebar')).on('click', function(){
    if($('#sidebar i').hasClass('remove')){
        sidebar();
    }
});