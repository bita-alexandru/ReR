function username(username) {
    // 3-16 chars, no special chars, only english letters and numbers
    let regex = new RegExp('^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
    return regex.test();
}

function password(password) {
    // 8-24 chars, at least one special char & one number & one uppercase letter
    let regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*._\-]).{8,24}$');
    return regex.test();
}

module.exports = { password, username };