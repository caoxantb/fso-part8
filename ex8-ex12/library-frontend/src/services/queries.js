import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query findAllAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query findAllBooks($author: String, $genres: String) {
    allBooks(author: $author, genres: $genres) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const ME = gql`
  query getMe {
    me {
      username
      favouriteGenre
    }
  }
`;
