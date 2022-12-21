import React from "react";

import { useQuery } from "@apollo/client";
import { useState } from "react";

import { ALL_BOOKS, ME } from "../services/queries";

const Recommendation = (props) => {
  const meResponse = useQuery(ME);
  const favGenre = meResponse?.data?.me.favouriteGenre
  const allBooksResponse = useQuery(ALL_BOOKS, {
    variables: {genres: favGenre},
    refetchQueries: [{ query: ALL_BOOKS }],
    pollInterval: 2000,
  });

  if (!props.show) {
    return null;
  }

  if (meResponse.loading || allBooksResponse.loading) {
    return <div>loading...</div>;
  }

  const books = allBooksResponse.data.allBooks

  return <div>
    <p>Your favourite genre is: {favGenre}</p>

    <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>;
};

export default Recommendation;
