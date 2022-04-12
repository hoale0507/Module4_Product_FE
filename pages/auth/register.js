function register(){
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPass = $('#confirm-password').val();
    let user = {
        username: username,
        passwordForm:{
            password: password,
            confirmPassword: confirmPass
        }
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/register',
        data: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (user){
            console.log(user);
            location.href = '/ProductFE/pages/auth/login.html';
        },
        error: function (errors){
            let username_validate = errors.responseJSON.username;
            let passWordForm_validate = errors.responseJSON.passwordForm;
            if(username_validate != null){
                $('#username-validate').html(username_validate);
            }
            if(passWordForm_validate != null){
                $('#confirmPassword-validate').html(passWordForm_validate);
            }
            showErrorMessage("Register failed");
        }
    })
}
