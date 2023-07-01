import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation SignUpUser($newUser: UserInput!) {
    user: signUpUser(newUser: $newUser) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginUser: UserLoginInput!) {
    login(loginUser: $loginUser) {
      token
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($newMessage: MessageData) {
    createMessage(newMessage: $newMessage) {
      id
      text
      createdAt
      senderId
      receiverId
    }
  }
`;
