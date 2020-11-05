class RegisterValidator {

    isUserNameAvailable(uName) {
        let temp = JSON.parse(localStorage.getItem("USERS"));
        var users = temp ? temp : [];


        for (let user of users) {
            if (user.name == uName) {
                return false;
            }
        }
        return true;
    }

    isEmailAvailabe(email) {
        let temp = JSON.parse(localStorage.getItem("USERS"));
        var users = temp ? temp : [];

        for (let user of users) {
            if (user.email == email) {
                return false;
            }
        }
        return true;
    }

    isEmailValid(email) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return true;
        } else {
            return false;
        }
    }
    validate(name, email, pass, cpass) {
        if (name.length <= 3) {
            throw "Name must contain at least 4 letters";
        }
        if (this.isUserNameAvailable(name) == false) {
            throw "Username is already taken!";
        }
        if (pass != cpass) {
            throw "Re-entered password doesn't match!";
        }
        if (this.isEmailAvailabe(email) == false) {
            throw "Email is already taken!";
        }
        if (this.isEmailValid(email) == false) {
            throw "Enter valid email adddress";
        }
    }
}