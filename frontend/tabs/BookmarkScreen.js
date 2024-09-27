import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../authContext';

const BookmarkScreen = ({navigation}) => {
  const [recipe, setRecipe] = useState([]);
  const [deletion, setDeletion] = useState(false);
  const {user} = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      const getBookmarks = async () => {
        const response = await fetch(
          `http://192.168.1.104:5000/${user._id}/bookmarks`,
          {
            method: 'get',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        console.log(response);
        const result = await response.json();
        console.log(result);
        setRecipe(result.bookmarks);
      };
      getBookmarks();
    }, [deletion]),
  );

  const deleteItem = async id => {
    const response = await fetch(
      `http://192.168.1.104:5000/${user._id}/bookmarks/delete/${id}`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      },
    );
    const data = response.json();
    console.log(data);
    setDeletion(!deletion);
  };

  if (recipe.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Bookmark a recipe</Text>
      </View>
    );
  }
  return (
    <FlatList
      style={{paddingHorizontal: '20'}}
      data={recipe}
      renderItem={({item}) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Show', {data: item.identification})
            }
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              marginVertical: 20,
              borderRadius: 25,
              flexDirection: 'row',
            }}>
            <Image style={styles.randomImg} source={{uri: item.image_url}} />
            <Text style={styles.randomTitle}>{item.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteItem(item._id)}
            style={{
              position: 'absolute',
              right: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="trash" size={25} color={'black'} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // paddingBottom: 20
    // backgroundColor: "yellow"
  },
  randomText: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  randomImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  randomTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginRight: 50,
    width: 250,
    textAlign: 'center',
  },
});
