import React, { useState, useEffect, useRef } from "react";
import './style.css';
import Api from "../../Api";

import EmojiPicker from 'emoji-picker-react';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MessageItem from '../../components/MessageItem';
import { ExpandCircleDown } from "@mui/icons-material";

const ChatWindow = ({ user, data }) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }
    const [emojiOpen, setEmojiOpen] = useState(false);

    const [text, setText] = useState('');

    const [listening, setListening] = useState(false);

    const [list, setList] = useState([]);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    }, [data.chatId]);


    useEffect(() => {
        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list]);

    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    }

    const handleEmojiClick = (emojiData, e) => {
        setText(text + emojiData.emoji);
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false);
    }

    const handleMicClick = () => {
        if (recognition !== null) {
            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript);
            }
            recognition.start();
        }
    }

    const handleInputKeyUp = (e) => {
        if (e.keyCode == 13) {
            handleSendClick();
        }
    }

    const handleSendClick = () => {
        if(text !== ''){
            Api.sendMessage(data, user.id, 'text', text, users);            
            setText('');
            setEmojiOpen(false);
        }
    }

    return (
        <div className="chatwindow">
            <div className="chatwindow--header">
                <div className="chatwindow--headerinfo">
                    <img className="chatwindow--avatar" src={data.image} alt="" />
                    <div className="chatwindow--name">{data.title}</div>
                </div>
                <div className="chatwindow--headerbuttons">
                    <div className="chatwindow--btn" style={{ color: '#919191' }} >
                        <SearchIcon />
                    </div>
                    <div className="chatwindow--btn" style={{ color: '#919191' }}>
                        <AttachFileIcon />
                    </div>
                    <div className="chatwindow--btn" style={{ color: '#919191' }}>
                        <MoreVertIcon />
                    </div>
                </div>
            </div>
            <div ref={body} className="chatwindow--body">
                {list.map((item, key) => (

                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>

            <div
                className="chatwindow--emojiarea"
                style={{ height: emojiOpen ? '200px' : '0' }}
            >
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    searchDisabled
                    skinTonesDisabled
                    width='auto'

                />
            </div>
            <div className="chatwindow--footer">
                <div className="chatwindow--pre">
                    <div
                        className="chatwindow--btn"
                        style={{ color: '#919191', width: emojiOpen ? 40 : 0 }}
                        onClick={handleCloseEmoji}
                    >
                        <CloseIcon />
                    </div>
                    <div
                        className="chatwindow--btn"
                        onClick={handleOpenEmoji}
                    >
                        <InsertEmoticonIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} />
                    </div>
                </div>
                <div className="chatwindow--inputarea">
                    <input
                        className="chatwindow--input"
                        type='text'
                        placeholder="Digite uma mensagem"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyUp={handleInputKeyUp}
                    />
                </div>
                <div className="chatwindow--pos">
                    {text === '' &&

                        <div className="chatwindow--btn">
                            <MicIcon onClick={handleMicClick} style={{ color: listening ? '#126ece' : '#919191' }} />
                        </div>

                    }
                    {text !== '' &&
                        <div onClick={handleSendClick} className="chatwindow--btn">
                            <SendIcon style={{ color: '#919191' }} />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;