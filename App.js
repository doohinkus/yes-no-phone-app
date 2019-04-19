import React from 'react';
import { StyleSheet,
  Text,
  View,
  Button,
  Image,
  AppRegistry,
  Picker } from 'react-native';
import {key} from './secret';


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      giph: '',
      answer: '',
      choice: 'Yes-No',
      loading: false,
      width: 50,
      height: 50
    }
  }
  setAnswer(choice){
    const options = choice.split('-');
    this.setState({
      answer: Math.round(Math.random()) === 1 ? options[0] : options[1],
    }, () => {
      this.setGiph()
      .then(data => {
        console.log(data);
        this.setState({
          giph: data.giph,
          loading: data.loading,
          width: data.width,
          height: data.height
        }, ()=>{
          console.log(this.state.giph, " ", this.state.loading);
        });
      })
      .catch(err => console.log(err));

    });
  }
  setGiph(){
    console.log('set giph called');

    const url = `http://api.giphy.com/v1/gifs/search?q=${this.state.answer}&api_key=${key}`;
    const randomGiph = Math.round(Math.random()*24);
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      const gif = responseJson.data[randomGiph].images.fixed_width.url;
      const width = responseJson.data[randomGiph].images.fixed_width.width;
      const height = responseJson.data[randomGiph].images.fixed_width.height;
      console.log(gif, " ", width, " ", height);
      return {
        loading: true,
        giph: gif,
        width:  width,
        height: height
        }
      })
      .catch((error) => {
          console.log(error);
      });


  }
  render() {
    const resizeMode = 'center';
    const height = parseInt(this.state.height);
    const width = parseInt(this.state.width);
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{this.state.choice.split('-').join(" ")} Oracle</Text>
        {!this.state.loading ? (<Text></Text>) : (
          <React.Fragment>
            <Image
              source={{uri: this.state.giph}}
              style={{width: width, height: height}}
            />
          </React.Fragment>
        )}
        <Text style={styles.text}>{this.state.answer}</Text>



        <Button
          title="Ask Question"
          style={{width: 400}}
          onPress={() => {
            this.setAnswer(this.state.choice);
          }}
        />
        <Picker
          selectedValue={this.state.choice}
          style={styles.choices}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({choice: itemValue});
          }}>
          <Picker.Item label="Yes or No" value="Yes-No" />
          <Picker.Item label="Stop or Go" value="Stop-Go" />
          <Picker.Item label="Heads or Tails" value="Heads-Tails" />
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#35495E',
    alignItems: 'center',
    justifyContent: 'center',
    color:'#41B883'
  },
  button:{
    borderRadius: 100,
    padding: 4,
    color: '#41B883'
  },
  text: {
    fontSize: 100,
    color: '#fff'
  },
  header: {
    fontSize: 40,
    color: '#41B883'
  },
  choices: {
    width: 150,
    height: 50,
    color: '#fff'
  }
});
// AppRegistry.registerComponent('DisplayAnImage', () => DisplayAnImage);
