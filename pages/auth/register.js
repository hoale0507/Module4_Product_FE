function register(){
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPass = $('#confirm-password').val();
    let user = {
        username: username,
        password: password,
        confirmPassword: confirmPass
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/register',
        data: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (){
            location.href = '/ProductFE/pages/auth/login.html';
        },
        error: function (){
            showErrorMessage("Register failed");
        }
    })
}
