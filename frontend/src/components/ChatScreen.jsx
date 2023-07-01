import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageCard from "./MessageCard";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/query";
import SendIcon from "@mui/icons-material/Send";
import { CREATE_MESSAGE } from "../graphql/mutations";
import { MSG_SUBSCRIPTION } from "../graphql/subscriptions";

const ChatScreen = () => {
  const { id, name } = useParams();
  const scrollContainerRef = useRef(null);
  // console.log(id);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const { error, loading, data } = useQuery(GET_MESSAGES, {
    variables: {
      receiverId: parseInt(id),
    },
    onCompleted(data) {
      setMessages(data.messages);
    },
  });

  const [sendMessage] = useMutation(CREATE_MESSAGE, {
    onCompleted(data) {
      // setMessages((prev) => [...prev, data.createMessage]);
    },
  });

  const { data: subData } = useSubscription(MSG_SUBSCRIPTION, {
    onData(data) {
      console.log("first", data);
      setMessages((prev) => [...prev, data.data.data.messageAdded]);
    },
  });
  // console.log("subscription complete", subData);

  useEffect(() => {
    // Scroll to the bottom of the container
    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight;
  }, [messages]);
  // console.log(message);
  if (loading) {
    <CircularProgress />;
  }
  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ bgcolor: "#f7f7f7" }}>
        <Toolbar>
          <Avatar
            src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
            sx={{ width: "32px", height: "32px", mr: 2 }}
          />
          <Typography variant="h6" color="#000">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box height="80vh" overflow="auto" ref={scrollContainerRef}>
        {data &&
          messages.map((message) => (
            <MessageCard
              text={message.text}
              date={new Date(message.createdAt).toLocaleTimeString()}
              direction={parseInt(id) !== message.senderId ? "end" : "start"}
              key={message.id}
            />
          ))}
      </Box>
      <Stack direction="row">
        <TextField
          placeholder="Enter a message"
          variant="standard"
          // fullWidth
          multiline
          rows={2}
          sx={{ padding: 2, width: "65vw" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // name="text"
        />
        <SendIcon
          fontSize="large"
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setMessage("");
            sendMessage({
              variables: {
                newMessage: {
                  receiverId: parseInt(id),
                  text: message,
                },
              },
            });
          }}
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
