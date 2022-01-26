$(".ui.message>.close.icon").on("click", function(){
    $(this).parent().css({display: 'none'})
});

$('.delete').on('click', function(){
    var selection = $(this).attr('id');
    $('.' + selection).slideDown();
});
                        
$('.cancel').on('click', function(){
    var selection = $(this).attr('id');
        $('.' + selection + '.deleteSlide').slideUp();
})