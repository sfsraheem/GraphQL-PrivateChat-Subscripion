import { gql } from "@apollo/client";

export const MSG_SUBSCRIPTION = gql`
  subscription Subscription {
    messageAdded {
      id
      senderId
      receiverId
      text
      createdAt
    }
  }
`;
