const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { signToken } = require ("../utils/auth")


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
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (!isPasswordValid){
        throw new AuthenticationError('Incorrect Password!');
      }
      const token = signToken(user);
      return {
        token,
        user,
      };
    },
    //username, email, password, donationAmount, donated 
    addUser: async (parent, { username, email, password, donationAmount, donated }) => {
      
      const hashedPassword = await bcrypt.hash(password, 5)
      console.log(hashedPassword);
      const user = await User.create(
        
        { username, email, password: hashedPassword, donationAmount, donated } ,
        
      );
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

    addDonation: async (parent, { donationAmount }, context) => {
      if (!context.user){
        throw new AuthenticationError('You need to log in!')
      };
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { donationAmount:  donationAmount, donated: true } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
