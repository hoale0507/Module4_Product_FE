function logout(){
    localStorage.removeItem('currentUser');
    location.href = '/ProductFE/pages/auth/login.html';
}

$('#logout').on( "click", function() {
    logout();
});