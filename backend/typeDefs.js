import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    users: [User]
    messagesByUser(receiverId: Int!): [Message]
    getUserData: User
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserLoginInput {
    email: String!
    password: String!
  }
  type Token {
    token: String!
  }
  input MessageData {
    receiverId: Int!
    text: String!
  }

  scalar Date

  type Message {
    id: ID!
    senderId: Int!
    receiverId: Int!
    text: String!
    createdAt: Date!
  }

  type Mutation {
    signUpUser(newUser: UserInput!): User
    login(loginUser: UserLoginInput!): Token!
    createMessage(newMessage: MessageData): Message!
  }

  type Subscription {
    messageAdded: Message
  }
`;

export default typeDefs;
