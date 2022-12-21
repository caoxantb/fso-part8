import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../services/mutations";

const Login = (props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={props.submit}>
        <div>
          username{" "}
          <input
            value={props.username}
            onChange={({ target }) => props.setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={props.password}
            onChange={({ target }) => props.setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
