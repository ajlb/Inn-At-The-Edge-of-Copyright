// authentication file. currently auth0, soon to be passport.
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function login() {
  const { loginWithRedirect } = useAuth0();
  loginWithRedirect();
  return;
}

function logout() {
  const { logout } = useAuth0();
  logout();
  return;
}

export default { login, logout }