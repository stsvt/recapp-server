const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id }).setOptions({
          skipActiveCheck: true,
        });

        if (user) {
          if (!user.active) {
            user.active = true;
            await user.save({ validateBeforeSave: false });
          }
          return done(null, user);
        }

        const email = profile.emails[0].value;

        user = await User.findOne({ email }).setOptions({
          skipActiveCheck: true,
        });

        if (user) {
          user.googleId = profile.id;
          user.active = true;
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        const newUser = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);
