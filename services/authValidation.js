class RegisterValidator {
    validate(name, pass, cpass) {
        if (pass != cpass) {
            throw "Re-entered password doesn't match!";
        }
        if (name.length <= 4) {
            throw "Name must contain at least 5 letters";
        }
    }
}