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
  query findAllBooks {
    allBooks {
      title
      published
      author
    }
  }
`;

