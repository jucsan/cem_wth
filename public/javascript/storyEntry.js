var input   = document.querySelector('#image'),
text        = document.querySelector('textarea'),
errorImage  = document.querySelector('#errorImage'),
errorText   = document.querySelector('#errorText'),
button      = document.querySelector('.ui.positive.basic.button'),
display     = document.querySelector('#preview'),
fileTypes   = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
    ];

function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.files[0].type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

text.addEventListener('change', function(){
	if(this.textLength > 10){
		button.disabled = false;
	} else {
	    button.disabled = true;
	}
});


input.addEventListener('change', function(){
    if(input.files.length !== 0 && validFileType(input) ){
        var url = window.URL.createObjectURL(input.files[0]),
        message = document.querySelector('.message'),
        image   = document.querySelector('.preview');
        message.textContent = 'Keep newly selected image';
        display.style.display = 'inline';
        image.setAttribute('src', url);
        button.disabled = false;
        errorImage.textContent = 'File selected is not supported, please choose a new image';
        errorImage.style.display = 'none';
    } else {
        errorImage.style.display = 'block';
        button.disabled = true;
    }
});

button.addEventListener('click', function(event){
    if(display.style.display === 'none'){
        errorImage.textContent = "Please select an image to upload";
        errorImage.style.display = 'block';
        event.preventDefault();
    } else if(text.textLength === 0){
        errorText.style.display = 'block';
        event.preventDefault();
    }
});

