import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS } from "../services/queries";
import { AUTHOR_EDIT } from "../services/mutations";

const Authors = (props) => {
  const response = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });
  const [authorEdit] = useMutation(AUTHOR_EDIT);
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  if (!props.show) {
    return null;
  }
  if (response.loading) {
    return <div>loading...</div>;
  }

  const authors = response.data.allAuthors;
  // setName(authors[0].name)
  // setBorn(authors[0].born)

  const submit = async (event) => {
    event.preventDefault();

    authorEdit({ variables: { name, born } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select
            onChange={({ target }) => {
              setName(target.value);
              const targetAuthor = authors.find((a) => a.name === target.value);
              setBorn(targetAuthor?.born || "");
            }}
            value={name}
          >
            <option key="choose" value="">
              Choose
            </option>
            {authors?.map((a) => {
              return (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            type="number"
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>

        <button type="submit" disabled={name === ""}>
          edit
        </button>
      </form>
    </div>
  );
};

export default Authors;
