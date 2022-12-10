import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { collection, getFirestore, getDocs, addDoc, doc, arrayUnion, updateDoc, onSnapshot, getDoc } from "firebase/firestore";


const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);
const auth = getAuth();


const Api = {
    fbPopup: async () => {
        const provider = new FacebookAuthProvider(firebaseapp);
        let result = await signInWithPopup(auth, provider);
        return result;
    },
    addUser: async (u) => {
        await addDoc(collection(db, "users"), {
            name: u.name,
            avatar: u.avatar
        }, { merge: true });
    },
    getContactList: async (userId) => {
        let list = [];
        let results = await getDocs(collection(db, "users"));
        results.forEach(result => {
            let data = result.data();

            if (result.id !== userId) {
                list.push({
                    id: result.id,
                    name: data.name,
                    avatar: data.avatar
                });
            }
        });
        return list;
    },

    addNewChat: async (user, user2) => {
        let newChat = await addDoc(collection(db, "chats"), {
            messages: [],
            users: [user.id, user2.id]
        });
        const pathRef = doc(db, "users", user.id);
        await updateDoc(pathRef, {
            chats: arrayUnion({
                chatId: newChat.id,
                title: user2.name,
                image: user2.avatar,
                with: user2.id
            })
        });
        const pathRef2 = doc(db, "users", user2.id);
        await updateDoc(pathRef2, {
            chats: arrayUnion({
                chatId: newChat.id,
                title: user.name,
                image: user.avatar,
                with: user.id
            })
        });

    },
    onChatList: (userId, setChatList) => {
        onSnapshot(doc(db, "users", userId), (doc) => {
            if (doc.exists) {
                let data = doc.data();
                if (data.chats) {
                    let chats = [...data.chats];
                    chats.sort((a,b)=>{
                        if(a.lastMessageDate === undefined){
                            return -1;
                        }
                        if(b.lastMessageDate === undefined){
                            return 1;
                        }
                        if(a.lastMessageDate.seconds < b.lastMessageDate.seconds){
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                    setChatList(chats);
                }
            }
        });
    },
    onChatContent: (chatId, setList, setUsers) => {
        onSnapshot(doc(db, "chats", chatId), (doc) => {
            if (doc.exists) {
                let data = doc.data();
                setList(data.messages);
                setUsers(data.users);
            }
        });
    },
    sendMessage: async (chatData, userId, type, body, users) => {
        let now = new Date();        
         updateDoc(doc(db, "chats", chatData.chatId), {                         
            messages: arrayUnion({
                type,
                author: userId,                
                date: now,
                body
            })
            
        });

        for(let i in users){
            let u =  await getDoc(doc(db, "users", users[i]));
            let uData = u.data();            
            if(uData.chats) {
                let chats = [...uData.chats];
                for(let e in chats){
                    if(chats[e].chatId == chatData.chatId){
                        chats[e].lastMessage = body;
                        chats[e].lastMessageDate = now;
                    }
                }
                await updateDoc(doc(db, "users", users[i]), {                         
                    chats                    
                });    
            }
        }        
    }
}

export default Api;


