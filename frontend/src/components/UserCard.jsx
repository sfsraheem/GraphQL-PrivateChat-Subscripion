import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ firstName, lastName, id }) => {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ paddingY: 2 }}
      className="user-card"
      onClick={() => navigate(`/${id}/${firstName} ${lastName}`)}
    >
      <Avatar
        src={`https://avatars.dicebear.com/api/initials/${firstName} ${lastName}.svg`}
        sx={{ width: "32px", height: "32px" }}
      />
      <Typography variant="subtitle2" paddingTop={1}>
        {firstName} {lastName}
      </Typography>
    </Stack>
  );
};

export default UserCard;
