import { PrismaClient } from "@prisma/client";
import {
  ApolloError,
  AuthenticationError,
  ValidationError,
  ForbiddenError,
  SyntaxError,
  UserInputError,
} from "apollo-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const prisma = new PrismaClient();

const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      //   console.log("id", userId);
      if (!userId) {
        throw new AuthenticationError("Authentication failed.");
      }

      const allUsers = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          id: {
            not: userId,
          },
        },
      });
      return allUsers;
    },
    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) {
        throw new AuthenticationError("Authentication failed.");
      }
      console.log(receiverId);
      const userMessages = await prisma.message.findMany({
        where: {
          OR: [
            { receiverId: receiverId, senderId: userId },
            { receiverId: userId, senderId: receiverId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return userMessages;
    },
    getUserData: async (_, args, { userId }) => {
      if (!userId) {
        throw new AuthenticationError("Authentication failed.");
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return user;
    },
  },
  Mutation: {
    signUpUser: async (_, args) => {
      const { firstName, lastName, email, password } = args.newUser;
      const oldUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (oldUser) {
        throw new ValidationError("User already exists with given email.");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
      });
      return newUser;
    },
    login: async (_, args) => {
      const { email, password } = args.loginUser;
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!findUser) {
        throw new UserInputError("No user exists with the given email");
      }
      const isPasswordValid = await bcrypt.compare(password, findUser.password);
      if (!isPasswordValid) {
        throw new AuthenticationError("Password is not correct");
      }
      const token = jwt.sign(
        { userId: findUser.id, email: findUser.email },
        process.env.JWT_SECRET
      );

      return { token };
    },
    createMessage: async (_, args, { userId }) => {
      if (!userId) {
        throw new AuthenticationError("Authentication failed.");
      }
      const { receiverId, text } = args.newMessage;
      //   console.log(receiverId, text);

      const newMessage = await prisma.message.create({
        data: {
          text,
          receiverId,
          senderId: userId,
        },
      });

      pubsub.publish(MESSAGE_ADDED, { messageAdded: newMessage });

      return newMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
  },
};

export default resolvers;
