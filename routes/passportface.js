const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const User = require('../models/UserModel'); // Model User của bạn

passport.use(new FacebookStrategy({
        clientID: '1227133001630218',
        clientSecret: '32804f589e55e3fed4fd48d9f5e633c0',
        callbackURL: 'https://www.ansuataohanoi.com/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name']
    },
    async(accessToken, refreshToken, profile, done) => {
        try {
            const { email, first_name, last_name } = profile._json;
            let user = await User.findOne({ email });

            if (!user) {
                user = new User({
                    name: `${first_name} ${last_name}`,
                    email: email,
                    role: 'manager', // Vai trò mặc định là user
                    phone: '', // Bạn có thể yêu cầu người dùng nhập số điện thoại sau
                    date: moment().tz('Asia/Ho_Chi_Minh').toDate(),
                    isVerified: true // Mặc định là true vì đã xác thực qua Facebook
                });

                await user.save();
            }

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});