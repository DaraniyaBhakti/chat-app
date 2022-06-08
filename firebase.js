import firebase from 'firebase/compat/app';
import'firebase/compat/auth';
import {getAuth } from 'firebase/auth';

// const auth = getAuth(firebase)
class Firebase {
    constructor() {
        this.init()
        this.checkAuth()
    }

    
    init = () => {
        if(!firebase.apps.length){
            firebase.initializeApp(
                {apiKey: "AIzaSyC00XH25FOUhPiVMnMz9MR66xITEbDRiT0",
                authDomain: "chat-app-dc8e0.firebaseapp.com",
                projectId: "chat-app-dc8e0",
                storageBucket: "chat-app-dc8e0.appspot.com",
                messagingSenderId: "866402292311",
                appId: "1:866402292311:web:ffca4d4bb5bbf24ed74912"}
            )
        }else{firebase.app()}
    }

    
    checkAuth = () => {
        // firebase.auth()
        getAuth(firebase).onAuthStateChanged(user => {
            if(!user){
                firebase.auth().signInAnonymously();
            }
        })
    };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp : firebase.database.ServerValue.TIMESTAMP,
                user:item.user
            };

            this.db.push(message);
        });
    }

    parse = message => {
        const {user,text,timestamp} = message.val()
        const {key : _id} = message
        const createdAt = new Date(timestamp)

        return{
            _id,
            createdAt,
            text,
            user
        }
    }

    get = callback => {
        this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    off(){
        this.db.off();
    }

    get db() {
        return firebase.database().ref('messages');
    }

    get uid(){
        return (getAuth(firebase).currentUser || {}).uid
    }
}

export default new Firebase();

