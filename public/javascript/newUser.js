$('.optional').popup({on: 'click'});
var email = document.querySelector('#email'),
username = document.querySelector('#username'),
password = document.querySelector('#password'),
button = document.querySelector('#submitButton');

function checkChange(input){
    if(input.style.borderColor !== false && input.value !== false){
        input.style.borderColor = "";
    } else {
        input.style.borderColor = '#db2828';
    }
}

function validateEmail(address) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(address.value.length == 0){
        return true;
    } else {
        return re.test(address.value);
    }
}

username.addEventListener('change', function(){
    checkChange(username);    
});     

password.addEventListener('change', function(){
    checkChange(password);    
});     

button.addEventListener('click', function(event){
    if(username.value == false){
        username.style.borderColor = '#db2828';
        event.preventDefault();
    } else if(validateEmail(email) == false){
        email.style.borderColor = '#db2828';
        event.preventDefault();
    } else if (password.value == false){
        password.style.borderColor = '#db2828';
        event.preventDefault();
    }
})