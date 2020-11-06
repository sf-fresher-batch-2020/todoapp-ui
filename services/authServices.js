class AuthServices {

    // registers the user
    register(user_data) {
        var temp = JSON.parse(localStorage.getItem("USERS"));
        var users = temp ? temp : [];
        users.push(user_data);
        localStorage.setItem("USERS", JSON.stringify(users));

        const profileServiceObj = new ProfileService();
        profileServiceObj.createProfile(user_data);
    }

    // returns the logged in user
    getCurrentUser() {
        let currentUser = JSON.parse(localStorage.getItem("LOGGED_IN_USER"));
        return currentUser;
    }

    // logs the user in
    login(email, password) {
        var temp = JSON.parse(localStorage.getItem("USERS"));
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].email == email) {
                if (temp[i].password == password) {
                    localStorage.setItem("LOGGED_IN_USER", JSON.stringify({
                        'uid': temp[i].uid,
                        'name': temp[i].name,
                        'email': temp[i].email
                    }));
                    $('#loggedin').show();
                    $('#loggedout').hide();
                    $("#content").load('../views/dashboard.html');
                } else {
                    throw "Password incorrect..!";
                }
            } else {
                throw "Email not registered..!";
            }
        }
    }
}