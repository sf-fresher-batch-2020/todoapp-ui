class AuthService {

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
        var users = JSON.parse(localStorage.getItem("USERS"));
        for (let user of users) {
            if (user.email == email) {
                if (user.password == password) {
                    localStorage.setItem("LOGGED_IN_USER", JSON.stringify({
                        'uid': user.uid,
                        'name': user.name,
                        'email': user.email
                    }));
                } else {
                    throw "Password incorrect..!";
                }
            } else {
                throw "Email not registered..!";
            }
        }
    }
}