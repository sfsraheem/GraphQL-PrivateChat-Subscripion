import { Box, Typography } from "@mui/material";
import React from "react";

const MessageCard = ({ text, date, direction }) => {
  return (
    <Box display="flex" justifyContent={direction} px={5} py={2}>
      <Box
        bgcolor={direction === "end" ? "#25D366" : "#243028"}
        py={1}
        px={2}
        pr={5}
        borderRadius={3}
        mr={direction === "start" && 5}
        ml={direction === "end" && 5}
      >
        <Typography
          variant="subtitle2"
          p="5px"
          color={direction === "start" && "white"}
        >
          {text}
        </Typography>
        <Typography variant="caption" color={direction === "start" && "white"}>
          {date}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageCard;
