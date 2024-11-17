import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { Fontisto } from "@expo/vector-icons";

const { width:SCREEN_WIDTH } = Dimensions.get("window");
//const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState('Loading...');
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);

  const API_KEY = 'ec4c982e972dc05fb531d437222d665c';
  
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    //console.log(permission);
    if(!granted){
      setOk(false);
    }

    console.log('ok?');
    //const location = getCurrentPositionAsync({Accuracy:5});
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    //console.log(latitude)
    //console.log(longitude)
    setCity(location[0].city);
    //console.log(location[0].city);
    //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();

    if (!response.ok) {
      console.error("HTTP Error:", response.status);
    }
    setDays(json.list.filter((weather)=> {
      if(weather.dt_txt.includes("00:00:00")){
        return weather;
      }
    }))

    console.log('sdfsdfsdfsdf')
    console.log(days)

  }

  useEffect(() => {
    ask();
  },[]);


  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityname}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
      {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
});