import { ApolloServer, gql } from "apollo-server";
import crypto from "crypto";

const users = [
  {
    id: "91yw2o8ys22o8",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "12345",
  },
  {
    id: "8oye298he298y2",
    firstName: "Anna",
    lastName: "Marie",
    email: "anna@example.com",
    password: "12345",
  },
];

const Todos = [
  {
    title: "Buy Book",
    by: "91yw2o8ys22o8",
  },
  {
    title: "Write Code",
    by: "91yw2o8ys22o8",
  },
  {
    title: "Record Video",
    by: "8oye298he298y2",
  },
];

// In GraphQL, we can query multiple queries in single query and give that single query a unique name.
// This is the example of a single query containing two different queries
// query GetUsersAndGreet {
//   users {
//     id
//     firstName
//     lastName
//     email
//   }
//   greet
// }
//  ! is used make any field mandatory
// we can pass context which creating server, then we can use access it any resolver in third argument. It is like middleware if we want to pass something to any resolver we can pass it from context
// we can give name/alias to the query or mutation so we can get meaningful response
// examples of alias
// **************************************
// mutation CreateUser($newUser: UserInput!) {
//   user:createUser(newUser: $newUser) {
//     id
//     firstName
//     lastName
//     email
//   }
// }
// ///////////////////////////
// query User($uid1: ID!, $uid2: ID!) {
//   user1:user(id: $uid1) {
//     id
//     firstName
//     lastName
//     email
//     todos {
//       by
//       title
//     }
//   }
//    user2:user(id: $uid2) {
//     id
//     firstName
//     lastName
//     email
//     todos {
//       by
//       title
//     }
//   }
// }
// *****************************************
// Fragment
// fragment userFields on User{
//   id
//     firstName
//     lastName
//     email
//     todos {
//       by
//       title
//     }
// }

// query User($uid1: ID!, $uid2: ID!) {
//   user1:user(id: $uid1) {
//     ...userFields
//   }
//    user2:user(id: $uid2) {
//      ...userFields
//    }
// }

const typeDefs = gql`
  type Todo {
    title: String!
    by: ID!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    todos: [Todo]
  }

  type Query {
    users: [User]
    greet: String
    user(id: ID!): User
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(newUser: UserInput!): User
  }
`;

const resolvers = {
  Query: {
    users: () => {
      // remove password property from object
      const userData = users.map((user) => {
        delete user.password;
        return user;
      });
      //   console.log("users: " + JSON.stringify(userData));
      return userData;
    },
    greet: () => "Hello World..!",
    user: (parent, agrs, context) => {
      console.log("context: " + JSON.stringify(context));
      //   console.log("users: " + JSON.stringify(users), agrs);
      return users.find((user) => user.id === agrs.id);
    },
  },
  Mutation: {
    createUser: (_, agrs, context) => {
      const { newUser } = agrs;
      //   newUser.id = users.length.toString();
      newUser.id = crypto.randomUUID();
      users.push(newUser);
      //   console.log("users: " + JSON.stringify(users));
      return newUser;
    },
  },
  // User id at root level and todos is inside user so we have to reslove it here we can see parent of todos which user by console.log. So we have to resolve it here.
  // when there is relational data then we can use parent argument
  User: {
    todos: (parent) => {
      //   console.log(parent);
      return Todos.filter((todo) => todo.by === parent.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    userLoggedIn: true,
  },
});

server.listen().then(({ url }) => {
  console.log("Server listening on " + url);
});
