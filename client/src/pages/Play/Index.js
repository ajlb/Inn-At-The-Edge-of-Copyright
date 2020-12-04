import Console from "../../components/Console/Console"
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Play = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

    return (
      isAuthenticated && (<Console authUser={user}/>)
    );
}
  
  export default Play;
  