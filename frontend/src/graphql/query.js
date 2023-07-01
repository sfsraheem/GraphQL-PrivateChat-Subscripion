import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query Users {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;
export const GET_USER = gql`
  query GetUserData {
    user: getUserData {
      id
      firstName
      lastName
      email
    }
  }
`;

export const GET_MESSAGES = gql`
  query MessagesByUser($receiverId: Int!) {
    messages: messagesByUser(receiverId: $receiverId) {
      id
      senderId
      receiverId
      text
      createdAt
    }
  }
`;
