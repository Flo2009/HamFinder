const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Station } = require('../models')
const { signToken } = require ("../utils/auth")
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Q2hSHHz1ELVl9MVBeinOPPqIcuTpkfeDryOyXRENcdpCoIfRtHoXtKv3mdPga98exclIRQVUqvjduV6wnRR9igb00Ocap2q2R');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user);
      if (!context.user){
        throw new AuthenticationError("Please Log In!");
      }
      const user = await User.findById(context.user._id).populate('savedStations')
      return user;
    },
    
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      console.log(email);
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
      
      try {
        //find the user to update with the session user id
        const updatedUser = await User.findByIdAndUpdate(context.user._id).populate('savedStations');

       if (!updatedUser) {
          console.log("No user found to update!")
          return { success: false, message: "User not found" };
        }
        //get the user's Obeject Id's and query the Station Model
        const savedStationIds= updatedUser.savedStations;
        console.log(savedStationIds);
        let currentStations = await Station.find({ _id: { $in: savedStationIds } });
          console.log(currentStations);
        //check if station exists
        const stationExists = currentStations.some(
          (station) => station.stationId === stationData.stationId
        )
        console.log(stationExists) 
        if (stationExists) {
          console.log('double');
          return { success: false, message: "Station is already saved" };
        };
        
        // If the station doesn't exist, create the station
        let station = await Station.findOne({ stationId: stationData.stationId });

        if (!station) {
          // If the station is not found, create a new one
          station = new Station(stationData);
          await station.save();
        }
        //push to the user
        updatedUser.savedStations.push(station._id)
        await updatedUser.save();
        console.log(updatedUser);
        //populate the user, so that the station information gets passed to front-end
        const update = await User.findByIdAndUpdate(context.user._id).populate('savedStations');
        return update;
    } catch (err){
      console.log(err);
      return { success: false, message: "An Error occurred while updating the stations"};
    }
    },

    removeStation: async (parent, { stationId }, context) => {
      if (!context.user){
        throw new AuthenticationError('You need to log in!')
      };

      try {
        const user = await User.findByIdAndUpdate(context.user._id);
        if (!user) {
          return { success: false, message: "User not found" };
        }
        //get the station Id to remove
        const savedStationIds= user.savedStations;
        console.log(savedStationIds);
        //retrieve all stations accociated with the user
        let currentStations = await Station.find({ _id: { $in: savedStationIds } });
          console.log(currentStations);
        const stationToRemove = currentStations.find(station => station.stationId === stationId)
        
        if (!stationToRemove) {
          console.log("No station to remove present!");
          return { success: false, message: "Station not found in user's saved stations" };
        }
        //remove the station, when present and return update to the front-end poulated
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedStations: stationToRemove._id } }, // Remove the Station's ObjectId
          { new: true } // Return the updated user document
        ).populate('savedStations'); 
        return updatedUser;
      }catch(err){
        console.log(err);
        return { success: false, message: "An Error occured during the process!"}
      }

    },

    // Create payment intent for Stripe
    createPaymentIntent: async (parent, { amount }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Amount in cents
          currency: 'usd',
        });
        return {
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateUserDonation: async (parent, { amount }, context) => {
      if (!context.user){
        throw new AuthenticationError('You need to log in!')
      };
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { donationAmount: amount }, 
          $set: { donated: true } 
        },
          
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
