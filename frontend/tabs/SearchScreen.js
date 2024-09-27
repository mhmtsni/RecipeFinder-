import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreen = ({navigation}) => {
  const [tempSearch, setTempSearch] = useState('');
  const [search, setSearch] = useState('');
  const [recipe, setRecipe] = useState([]);
  const [numColumns, setNumColumns] = useState(3);
  useEffect(() => {
    const fetchData = async function () {
      try {
        const res = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes?search=${search.toLowerCase()}`,
        );
        const result = await res.json();
        const recipesData = await result.data.recipes;
        setRecipe(recipesData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [search]);

  return (
    <View style={{alignItems: 'center', padding: 10, justifyContent: 'center'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 20,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          placeholder="Search for a meal"
          onChangeText={text => setTempSearch(text)}
        />
        <TouchableOpacity
          onPress={() => setSearch(tempSearch)}
          style={{
            backgroundColor: 'white',
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Ionicons name="search" size={48} color={'black'} />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal={false}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={recipe}
        renderItem={({item}) => (
          <View
            style={{
              margin: 10,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.navigate('Show', {data: item.id})}>
              <Text style={{textAlign: 'center'}} numberOfLines={1}>
                {item.title}
              </Text>
              <Image
                style={{width: 100, height: 100}}
                source={{uri: item.image_url}}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
