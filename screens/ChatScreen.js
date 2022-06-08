import { ThemeProvider } from '@react-navigation/native';
import React, { Component } from 'react'
import {Platform,KeyboardAvoidingView, SafeAreaView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import Firebase from '../firebase';

export default class ChatScreen extends Component {

  state={
    messages:[]
  }

  get user() {
    return{
      _id:Firebase.uid,
      name: this.props.navigation.state.params.name
    }
  }

  componentDidMount() {
    Firebase.get(message => this.setState(previous => ({
      messages: GiftedChat.append(previous.message,message)
    })))
  }

  componentWillUnmount(){
    Firebase.off()
  }
  render() {
    const chat = <GiftedChat messages={this.state.messages} onSend={Firebase.send} user={this.user} />;

    if(Platform.OS === 'android'){
      return(
        <KeyboardAvoidingView style={{flex:1}} behavior="padding" keyboardVerticalOffset={30} enabled>
          {chat}
        </KeyboardAvoidingView>
      )
    }
    return (
      <SafeAreaView style={{flex:1}}>
        {chat}
      </SafeAreaView>
    )
  }
}

