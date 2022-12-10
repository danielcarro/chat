import React, { useState, useEffect } from "react";
import './style.css';
import Api from "../../Api";


import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NewChat = ({ user, chatlist, show, setShow }) => {

    const [list, setList] = useState([]);

    useEffect(() => {
        if (user !== null) {
            const getList = async () => {
                if (user !== null) {
                    let result = await Api.getContactList(user.id);
                    setList(result);
                }
            }
            getList();
        }
    }, [user]);

    const newChat = async (user2) => {
        await Api.addNewChat(user, user2);        
        handleClose();
    }

    const handleClose = () => {
        setShow(false);
    }

    return (
        <div className="newchat" style={{ left: show ? 0 : -415 }}>
            <div className="newchat--head">
                <div onClick={handleClose} className="newchat--backbutton">
                    <ArrowBackIcon style={{ color: '#fff' }} />
                </div>
                <div className="newchat--headtitle">
                    Nova Conversa
                </div>
            </div>
            <div className="newchat--list">

                {list.map((item, key) => (

                    <div
                        className="newchat--item"
                        key={key}
                        onClick={()=>newChat(item)}
                    >

                        <img className="newchat--itemavatar" src={item.avatar} alt="avatar" />
                        <div className="newchat--itemname">
                            {item.name}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewChat;