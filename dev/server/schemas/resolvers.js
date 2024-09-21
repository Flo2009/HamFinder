const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { signToken } = require ("../utils/auth")

// const SECRET_KEY = 'mysecretsshhhhh';


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context);
      if (!context.user){
        throw new AuthenticationError("Please Log In!");
      }
      const user = await User.findById(context.user._id).populate('savedStations');
      return user;
    },
    
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      
      const user = await User.findOne({ email });
      if (!user){
        throw new AuthenticationError("Please Enter your Email!");
      }
      // console.log(user.password, password);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (!isPasswordValid){
        throw new AuthenticationError('Incorrect Password!');
      }
      // const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '2h'});
      const token = signToken(user);
      return {
        token,
        user,
      };
    },
    //username, email, password 
    addUser: async (parent, { username, email, password }) => {
      console.log(username);
      console.log(email);
      console.log(password);
      // console.log(args);
      const hashedPassword = await bcrypt.hash(password, 5)
      console.log(hashedPassword);
      const user = await User.create(
        
        { username, email, password: hashedPassword } ,
        // { email } ,
        // { password: hashedPassword } ,
        // { new: true }
      );
      
      // console.log(user);
      // const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '2h'});
     const token = signToken(user);
      return {
        token,
        user,
      };
    },
    saveStation: async (parent, { stationData }, context) => {
      if (!context.user){
        throw new AuthenticationError('You need to log in!');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedStations:  stationData  } },
        { new: true, runValidators: true }
      ).populate('savedStations');

      return updatedUser;

    },
    removeStation: async (parent, { stationId }, context) => {
      if (!context.user){
        throw new AuthenticationError('You need to log in!')
      };
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedStations: { stationId } } },
        { new: true }
      ).populate('savedStations');
      
      return updatedUser;
    },
  },
};

module.exports = resolvers;
