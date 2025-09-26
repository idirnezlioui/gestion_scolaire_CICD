const JwtStrategy=require("passport-jwt").Strategy
const ExtractJwt=require("passport-jwt").ExtractJwt

const passport = require("passport")
const Utilisateur=require("../modls/utilisateurs")
const secret ="SECRET_KEY"

module.exports=(passport)=>{
    const opts={
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:secret
    }
    passport.use(
        new JwtStrategy(opts,async (jwt_payload,done)=>{
            const user=await Utilisateur.findBymail(jwt_payload.email)
            if (user){
                return done(null,user)
            }else{
                return done(null,false)
            }
        })
    )
}