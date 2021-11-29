import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "63d5f96b4a950ab239091fa6823fcc9a";
const icons = {
"Clouds": {
  iconName: "cloudy",
  gradient: ["#8e9eab", "#eef2f3"],
  
},
"Clear": {
  iconName: "day-sunny",
  gradient: ["#ff8008", "#ffc837"],
  
},
"Rain": {
  iconName: "rain",
  gradient: ["#00d2ff", "#3a7bd5"],
  
},
"Atmosphere": {
  iconName: "cloudy-gusts",
  gradient: ["#4DA0B0", "#D39D38"],
  
},
"Snow": {
  iconName: "snow",
  gradient: ["#acb6e5", "#86fde8"],
  
},
"Drizzle": {
  iconName: "day-rain",
  gradient: ["#F1F2B5", "#135058"],
  
},
"Thunderstorm": {
  iconName: "lightning",
  gradient: ["#2c3e50", "#3498db"],
  
},
};

export default function App() {
  const [city, setCity] = useState("Finding your location...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync(); // only while using apps
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <ScrollView  
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator="false"
      contentContainerStyle={styles.weather}>

    {days.map((day, index) => (
      <LinearGradient style={styles.gradients} colors={[
        icons[day.weather[0].main].gradient[0],
        icons[day.weather[0].main].gradient[1]
      ]}>
      <View style={styles.container}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
    
      {days.length === 0 ? (
        <View style={{ ...styles.day, alignItems: "center" }}>
        <ActivityIndicator 
          color="white" 
          style={{marginTop: 10}} 
          size="large" />
        </View>
      ) : (
        <View key={index} style={styles.day}>
          <Text style={styles.date}>{new Date(day.dt * 1000).toString().substring(0,10)}</Text>
          <View style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}°</Text>
            <Fontisto name={icons[day.weather[0].main].iconName} size={68} color="white" />
          </View>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>
          )
          }
      <StatusBar style="light" />
    </LinearGradient>
    ))}
</ScrollView>
  );
}

const styles = StyleSheet.create({
  gradients: {
    flex: 1,
  },
  container: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  city: {
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
    color: "white"
  },  
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  date:{
    fontSize: 30,
    marginTop: 10,
    fontWeight: "300",
    color: "white"
    
  },
  temp: {
    fontSize: 80,
    marginTop: -10,
    fontWeight: "100",
    color: "white"
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500"
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  }
});
