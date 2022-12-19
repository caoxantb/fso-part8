import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "./services/mutations";
import Login from "./components/Login.js";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN);
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
    }
  }, [result.data]);

  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <Login
        show={page === "login"}
        submit={submit}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    </>
  );
};

export default App;
