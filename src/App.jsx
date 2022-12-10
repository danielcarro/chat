import React, { useState, useEffect } from "react";
import './App.css';
import ChatListItem from "./components/ChatListItem";
import ChatIntro from "./components/ChatIntro";
import ChatWindow from "./components/ChatWindow";
import NewChat from "./components/NewChat";
import Api from "./Api";

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Login from "./components/Login";

const App = () => {

  const [chatlist, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});

  const [user, setUser] = useState({ id: 'TAAWmhR0JlUCxfxzn8ez', name: 'Daniel Carro', avatar: 'https://scontent.fsjk4-1.fna.fbcdn.net/v/t39.30808-6/273223122_104947302107216_1835472460804205633_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=LjR_e5VWINwAX9Lz9fy&tn=pdtdXQXOnhzcCwJb&_nc_ht=scontent.fsjk4-1.fna&oh=00_AfCRlACseSmNkyBrzNDS0BNgz--Pf5_eDx2yzaA6a7uD7w&oe=6396A30B' });

  const [showNewChat, setShowNewChat] = useState(false);


  useEffect(() => {
    if (user !== null) {
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub;
    }
  }, [user]);

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  const handleLoginData = async (u) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    };
    await Api.addUser(newUser);
    setUser(newUser);
  }

  if (user === null) {
    return (<Login onReceive={handleLoginData} />);
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          chatlist={chatlist}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img className="header--avatar" src={user.avatar} alt="Avatar" />
          <div className="header--buttons">
            <div className="header--btn"><DonutLargeIcon style={{ color: '#919191' }} /></div>
            <div onClick={handleNewChat} className="header--btn"><ChatIcon style={{ color: '#919191' }} /></div>
            <div className="header--btn"><MoreVertIcon style={{ color: '#919191' }} /></div>
          </div>
        </header>
        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" style={{ color: '#919191' }} />
            <input type="search" placeholder="Procurar ou começar uma nova conversa" />
          </div>
        </div>
        <div className="chatlist">
          {chatlist.map((item, key) => (
            <div className="">
              <ChatListItem
                key={key}
                data={item}
                active={activeChat.chatId === chatlist[key].chatId}
                onClick={() => setActiveChat(chatlist[key])}
              />
              
            </div>
          ))}
          
        </div>
      </div>
      <div className="contentarea">
        {activeChat.chatId !== undefined &&
          <ChatWindow
            user={user}
            data={activeChat}
          />

        }
        {activeChat.chatId === undefined &&
          < ChatIntro />
        }
      </div>
    </div>
  );
}

export default App;