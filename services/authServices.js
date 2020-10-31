class AuthServices {
    register(user_data) {
        var temp = JSON.parse(localStorage.getItem("USERS"));
        var users = temp ? temp : [];
        users.push(user_data);
        localStorage.setItem("USERS", JSON.stringify(users));
    }

    login(email, password) {
        var temp = JSON.parse(localStorage.getItem("USERS"));
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].email == email) {
                if (temp[i].password == password) {
                    localStorage.setItem("LOGGED_IN_USER", JSON.stringify(temp[i]));
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