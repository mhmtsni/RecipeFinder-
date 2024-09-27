import React, {createContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    if (isSignedIn) {
      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [isSignedIn, navigation]);

  return (
    <AuthContext.Provider value={{isSignedIn, setIsSignedIn, user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
