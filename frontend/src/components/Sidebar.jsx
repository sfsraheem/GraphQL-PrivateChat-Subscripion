import {
  Box,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import UserCard from "./UserCard";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/query";
import RefreshIcon from "@mui/icons-material/Refresh";

const Sidebar = ({ setIsLoggedIn }) => {
  const { loading, data, error, refetch } = useQuery(GET_USERS);
  // console.log(data, error?.message, loading);
  // const users = [
  //   { id: "1", firstName: "John", lastName: "Doe" },
  //   { id: "2", firstName: "Anna", lastName: "Marie" },
  //   { id: "3", firstName: "Peter", lastName: "Smith" },
  // ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box
      backgroundColor="#f7f7f7"
      height="97vh"
      minWidth="250px"
      margin="0"
      // overflow="auto"
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" mb={2} ml={1}>
          Chat
        </Typography>
        <RefreshIcon
          sx={{ cursor: "pointer", mt: "3px", mr: "60px" }}
          onClick={() => {
            refetch();
          }}
        />
        <LogoutRoundedIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }}
        />
      </Stack>
      <Divider />
      <Box overflow="auto" height="90vh">
        {data.users.map((user) => (
          <UserCard key={user?.id} {...user} />
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
