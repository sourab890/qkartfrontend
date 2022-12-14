import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "./Header.css";
import "./Products.css";
import { useHistory } from "react-router-dom";

const Header = (props) => {
  const history = useHistory();
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    if (!loginStatus && localStorage.getItem("username")) {
      setLoginStatus(true);
      window.localStorage.setItem("LoggedInStatus", "true");
    }
  }, [loginStatus]);

  const logOut = () => {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("balance");
    window.localStorage.removeItem("token");
    setLoginStatus(false);
    window.localStorage.setItem("LoggedInStatus", "false");
    history.push("/", { from: "Header" });
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {props.children}
      {props.hasHiddenAuthButtons ? (
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/", { from: "Header" })}
        >
          Back to explore
        </Button>
      ) : (
        <div>
          {!loginStatus ? (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <Button
                variant="text"
                onClick={() => history.push("/login", { from: "Header" })}
              >
                LOGIN
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => history.push("/register", { from: "Header" })}
              >
                REGISTER
              </Button>
            </Stack>
          ) : (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <Avatar
                src="../../public/avatar.png"
                alt={window.localStorage.getItem("username")}
              />
              <p>{window.localStorage.getItem("username")}</p>
              <Button variant="text" onClick={logOut}>
                LOGOUT
              </Button>
            </Stack>
          )}
        </div>
      )}
    </Box>
  );
};

export default Header;
