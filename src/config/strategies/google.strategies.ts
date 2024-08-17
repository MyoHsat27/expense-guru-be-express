//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: process.env.GOOGLE_CALLBACK
//       },
//       async (token, tokenSecret, profile, done) => {
//         const { sub, name, email, picture } = profile._json
//         try {
//           let user = await User.findOne({
//             $or: [{ email }, { googleId: sub }]
//           })
//           if (!user) {
//             const randomPassword = Math.random().toString(36).slice(-8)

//             user = await User.create({
//               name,
//               email,
//               avatar: picture || `https://robohash.org/${name}`,
//               password: bcrypt.hashSync(
//                 randomPassword,
//                 bcrypt.genSaltSync(10),
//                 null
//               ),
//               googleId: sub
//             })
//           }
//           return done(null, user)
//         } catch (err) {
//           done(err)
//         }
//       }
//     )
//   )
