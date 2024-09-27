import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {AuthContext} from '../authContext';

const LoginScreen = ({navigation}) => {
  const [mail, setmail] = useState('mhmtsni110@gmail.com');
  const [password, setpassword] = useState('123456');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const {setIsSignedIn} = useContext(AuthContext);
  const {setUser} = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await fetch(`http://192.168.1.104:5000/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail,
          password,
        }),
      });
      const data = await res.json();
      console.log(res.status);
      if (res.status === 401) {
        setMessage('Please enter an email and a password');
        setShowMessage(true);
      } else if (res.status === 404) {
        setMessage('Invalid Credentials');
        setShowMessage(true);
      } else if (res.status === 200) {
        await setUser(data.user);
        if (data.user.token) {
          setIsSignedIn(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        textAlign="center"
        style={styles.input}
        placeholder="Enter your e-mail"
        onChangeText={text => setmail(text)}
      />
      <TextInput
        textAlign="center"
        style={styles.input}
        placeholder="Enter your password"
        onChangeText={text => setpassword(text)}
      />
      <Button onPress={handleLogin} title="Log In" />
      {showMessage && <Text>{message}</Text>}
      <Button
        onPress={() => navigation.navigate('Signup')}
        title="Don't have an account? Sign up!"
      />
    </View>
  );
};

export default LoginScreen;

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
  },
});
