import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');

    const ENDPOINT = 'http://localhost:5000';

  useEffect(() => {
    const {name,room} = queryString.parse(window.location.search);

    socket=io(ENDPOINT);

    setName(name);
    setRoom(room);
    socket.emit('join', {name,room},(error) => {
      if (error) {
        alert(error);
      }});

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT]); // Add an empty dependency array to run this effect only once

  useEffect(()=>{
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage=(event)=>{
    event.preventDefault();
    
    if(message){
      socket.emit('sendMessage',message,() => setMessage('')); //mesajı gönderdikten sonra input alanını boşaltıyoruz.
    }
  }

  console.log(message,messages);

  return(
    <div className="outerContainer"><div className="container">
      <InfoBar room={room}/>
      <Messages messages={messages} name={name}/>
      <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      
</div><TextContainer users={users}/></div>

  ) 
};

export default Chat;