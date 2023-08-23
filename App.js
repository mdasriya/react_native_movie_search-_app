import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import 'dotenv/config'; // Add this line at the top of App.js


const API_KEY = process.env.OMDB_API_KEY;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const searchMovies = async () => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`);
      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search);
        setNoResults(false);
      } else {
        setMovies([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="ios-search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for movies..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <Button title="Search" onPress={searchMovies} />
      </View>
      
      {noResults && <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>}
      
      <FlatList
        style={styles.movieList}
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.movieItem} onPress={() => fetchMovieDetails(item.imdbID)}>
            <Image source={{ uri: item.Poster }} style={styles.moviePoster} />
            <Text style={styles.movieTitle}>{item.Title}</Text>
          </TouchableOpacity>
        )}
      />
      
      {selectedMovie && (
        <View style={styles.movieDetails}>
          <Image source={{ uri: selectedMovie.Poster }} style={styles.selectedMoviePoster} />
          <Text>Title: {selectedMovie.Title}</Text>
          <Text>Year: {selectedMovie.Year}</Text>
          <Text>Plot: {selectedMovie.Plot}</Text>
          <Text>Rating: {selectedMovie.imdbRating}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  movieList: {
    marginBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  moviePoster: {
    width: 50,
    height: 70,
    marginRight: 10,
  },
  movieTitle: {
    fontSize: 16,
  },
  movieDetails: {
    alignItems: 'center',
  },
  selectedMoviePoster: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
  noResultsText: {
    color: 'red',
    marginBottom: 10,
    fontStyle: 'italic',
  },
});
