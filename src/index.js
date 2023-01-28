const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

async function datos() {
  try {
    const response = await axios.get(
      "https://api.breakingbadquotes.xyz/v1/quotes/10"
    );
    console.log(response.data);
    //breakingbadquotes.push(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

let breakingbadquotes = datos();

const typeDefs = gql`
  type Book {
    id: String
    title: String
    author: String
  }

  type Query {
    Getbreakingbadquotes: [Book]
    Getbook(id: String!): [Book]
  }
  type Mutation {
    CreateBook(id: String!, title: String!, author: String!): Book
    DeleteBook(id: String!): Book
    UpdateBook(id: String!, title: String!, author: String!): Book
  }
`;

const resolvers = {
  Mutation: {
    CreateBook: (_, arg) => {
      breakingbadquotes.push(arg);
      return arg;
    },
    DeleteBook: (_, arg) => {
      let finalbreakingbadquotes = breakingbadquotes.filter(
        (book) => book.id != arg.id
      );
      let bookdeleted = breakingbadquotes.find((book) => book.id == arg.id);
      breakingbadquotes = [...finalbreakingbadquotes];
      return bookdeleted;
    },
    UpdateBook: (_, arg) => {
      let objIdx = breakingbadquotes.findIndex((book) => book.id == arg.id);
      breakingbadquotes[objIdx] = arg;
      return arg;
    },
  },
  Query: {
    Getbreakingbadquotes: () => breakingbadquotes,
    Getbook: (_, arg) =>
      breakingbadquotes.find((number) => number.id == arg.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
