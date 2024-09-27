import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';

const HomeScreen = ({navigation}) => {
  const [recipe, setRecipe] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes?search=pasta`,
        );
        const result = await res.json();
        const recipesData = await result.data.recipes;
        setRecipe(recipesData);
        setRandomRecipe(recipesData[Math.floor(Math.random() * recipe.length)]);
        if (recipesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * recipesData.length);
          setRandomRecipe(recipesData[randomIndex]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Show', {data: randomRecipe.id})}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.randomText}>Random Recipe</Text>
        <Text style={styles.randomTitle}>{randomRecipe.title}</Text>
        <Image
          style={styles.randomImg}
          source={{uri: randomRecipe.image_url}}
        />
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    // backgroundColor: "yellow"
  },
  randomText: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  randomImg: {
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 30,
  },
  randomTitle: {
    fontWeight: '500',
    fontSize: 16,
  },
});
