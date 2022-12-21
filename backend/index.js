import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Author from "./models/author.js";
import Book from "./models/book.js";
import User from "./models/user.js";
import { UserInputError } from "apollo-server";
import { AuthenticationError } from "apollo-server";

const MONGODB_URI = "mongodb://127.0.0.1:27017/fsopart8";
const JWT_SECRET = "SECRET_KEY";

console.log("connecting to", MONGODB_URI);

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: AuthorInput!
      genres: [String]!
    ): Book
    editAuthor(name: String!, born: Int!): Author
    createUser(username: String!, favouriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  input AuthorInput {
    name: String!
    born: Int
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let author;
      if (args.author) author = await Author.find({ name: args.author });

      const queryBuilder = (args) => ({
        ...(args.author && { author: author }),
        ...(args.genres && { genres: { $in: [args.genres] } }),
      });

      const books = Book.find(queryBuilder(args)).populate('author');

      return books;
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if(!context.currentUser) throw AuthenticationError("No user found")
      if (args.title.length < 2)
        throw new UserInputError("Title name length < 2");
      let author = await Author.findOne({ name: args.author.name });
      if (!author) {
        if (args.author.name.length < 3)
          throw new UserInputError("Author name length < 3");
        const newAuthor = new Author({
          ...args.author,
        });
        await newAuthor.save();
        author = newAuthor;
      }
      const book = new Book({ ...args, author: author });
      return book.save();
    },

    editAuthor: async (root, args, context) => {
      if(!context.currentUser) throw new AuthenticationError("No user found")
      return Author.findOneAndUpdate({ name: args.name }, { born: args.born });
    },

    createUser: async (root, args) => {
      const userFind = await User.findOne({ username: args.username });
      if (userFind) {throw new UserInputError("Username must be unique")}

      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Author: {
    bookCount: async (root) => Book.find({ author: root }).countDocuments(),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
