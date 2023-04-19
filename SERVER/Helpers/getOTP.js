export default (done) => {
    var digits = '1234567890';
    var otp = ''
    for (var i = 0; i < 5; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
        if (i >= 4) {
            done(otp)
        }
    }

}