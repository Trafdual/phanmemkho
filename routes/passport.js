const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel')
passport.use(new GoogleStrategy({
        clientID: '319791100312-5ru5btq9fkhgqcbga87oh5iqg1br04i0.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'https://ansuataohanoi.com'
    },
    async(accessToken, refreshToken, profile, done) => {
        try {
            // Tìm hoặc tạo người dùng trong cơ sở dữ liệu của bạn
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user', // Đặt mặc định cho role
                    phone: '', // Bạn có thể yêu cầu người dùng nhập số điện thoại sau
                    date: new Date(),
                    isVerified: true
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

// Cấu hình serialize và deserialize người dùng
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null, user);
});