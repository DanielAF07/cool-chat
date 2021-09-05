import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon, Mic, Send } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import { useRouter } from "next/dist/client/router";
import { useRef, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase-config";
import Message from "./Message";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from 'timeago-react'

const ChatScreen = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    const router = useRouter();

    const endOfMessageRef = useRef(null)
    const [input, setInput] = useState("");

    const [messagesSnapshot] = useCollection(
        db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy("timestamp", "asc")
    );

    const [recipientSnapshot] = useCollection(
        db
            .collection("users")
            .where("email", "==", getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ));
        }
    };

    useEffect(() => {
        scrollToBottom()
    }, []);

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const sendMessage = (e) => {
        if(e) e.preventDefault();
        scrollToBottom()
        db.collection("users").doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
    };


    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ): (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    { recipientSnapshot ? (
                        <p>Last active: {'  '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : 'Unavaliable'
                            }
                        </p>
                        ) : (
                            <p>Loading Last active ...</p>
                        )
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    hidden
                    disabled={!input}
                    type="submit"
                    onClick={sendMessage}
                >
                    Send Message
                </button>
                { input.length ? <Send onClick={sendMessage}/> : <Mic />}
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
    font-size: 16px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 3000;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
