import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import React, {useState, useContext} from 'react';
import {AuthContext} from '../authContext';
const SignupScreen = ({navigation}) => {
  const [mail, setMail] = useState('test1@gmail.com');
  const [password, setPassword] = useState('123456');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(true);

  const handleRegister = async () => {
    console.log(mail, password);

    try {
      const res = await fetch(`http://192.168.1.104:5000/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail,
          password,
        }),
      });
      console.log(res);

      const data = await res.json();

      if (res.status === 500) {
        setMessage('Please enter a valid email and password');
        setShowMessage(true);
      } else if (res.status === 401) {
        setMessage('This email is already in use');
        setShowMessage(true);
      } else if (res.status === 200) {
        console.log(data);
        setMessage('You are registered, go back to login screen to login');
        setShowMessage(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        textAlign="center"
        placeholder="Enter your e-email"
        onChangeText={text => setMail(text)}
      />
      <TextInput
        style={styles.input}
        textAlign="center"
        placeholder="Enter your password"
        onChangeText={text => setPassword(text)}
      />
      <Button onPress={handleRegister} title="Sign Up" />
      {showMessage && <Text>{message}</Text>}
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 20,
    color: 'red',
  },
});
