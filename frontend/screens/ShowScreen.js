import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../authContext';

const ShowScreen = ({route}) => {
  const [recipe, setRecipe] = useState();
  const [servings, setServings] = useState(4);
  const {user} = useContext(AuthContext);
  console.log(user.token);
  const postRecipe = async (...props) => {
    try {
      await fetch(`http://192.168.1.104:5000/${user._id}/bookmarks/add`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          identification: recipe.id,
          image_url: recipe.image_url,
          title: recipe.title,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const increaseServings = () => {
    if (servings >= 1) setServings(prevServ => +prevServ + 1);
  };
  const decreaseServings = () => {
    if (servings > 1) setServings(prevServ => +prevServ - 1);
  };
  console.log(route.params?.data);
  useEffect(() => {
    const fetchRecipe = async function () {
      try {
        const res = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${route.params?.data}`,
        );
        const data = await res.json();
        console.log(data);
        setRecipe(data.data.recipe);
      } catch (err) {
        console.log(err);
      }
    };
    if (route.params?.data) {
      fetchRecipe();
    }
  }, [route.params?.data]);
  if (!recipe) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.showTitle}>{recipe.title}</Text>
      <Text>Cooking Time: {`${recipe.cooking_time} minutes`}</Text>
      <Text>Servings for {`${servings} people`}</Text>
      <TouchableOpacity
        style={{backgroundColor: 'green'}}
        onPress={() => increaseServings()}>
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: 'green'}}
        onPress={() => decreaseServings()}>
        <Text>Decrease</Text>
      </TouchableOpacity>
      <View>
        <Image style={styles.showImg} source={{uri: recipe.image_url}} />
        <TouchableOpacity
          onPress={() => postRecipe(recipe.id, recipe.image_url, recipe.title)}
          style={{position: 'absolute', bottom: 20, right: 20}}>
          <Ionicons style={{}} name="bookmark" color={'black'} size={40} />
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{marginVertical: 10, flex: 1}}
        data={recipe.ingredients}
        renderItem={({item}) => (
          <View style={styles.ingContainer}>
            <Text style={{marginVertical: 5, fontWeight: '500'}}>
              {`• ${
                item.quantity
                  ? (item.quantity / 4) * servings
                  : item.description
              } ${item.unit} ${item.quantity ? item.description : ''}`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ShowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    // backgroundColor: "yellow"
  },

  showImg: {
    width: 270,
    height: 270,
    marginTop: 10,
    borderRadius: 30,
  },
  showTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 30,
    textAlign: 'center',
  },
  ingContainer: {
    flex: 1,
  },
});
