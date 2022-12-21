import { useQuery } from "@apollo/client";
import {useState} from 'react'

import { ALL_BOOKS } from "../services/queries";

let num = 0

const Books = (props) => {
  const [genre, setGenre] = useState("all")
  const [initialBooks, setInitialBooks] = useState(null)

  const response = useQuery(ALL_BOOKS, {
    variables: genre === 'all' ? {} : { genres: genre },
    refetchQueries: [  {query: ALL_BOOKS} ],
    pollInterval: 2000,
  });

  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const books = response.data.allBooks;
  if (num === 0) setInitialBooks(books)
  num++;
  
  const genresWithDuplication = initialBooks?.map(book => book.genres).reduce((acc, cur) => [...acc, ...cur], ["all"])
  const genres = [...new Set(genresWithDuplication)]

  const chooseGenre = (e) => {
    setGenre(e.target.id)
  }

  return (
    <div>
      <h2>books</h2>

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

      <div>
        {genres.map(genre => <button id={genre} onClick={chooseGenre}>{genre}</button>)}
      </div>


    </div>
  );
};

export default Books;
