/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function App() {
  const [serverState, setServerState] = React.useState('Loading...');
  const [imageBase64, setImageBase64] = React.useState<string>('');
  const [positionObject, setPositionObject] = React.useState<{
    roll: number;
    pitch: number;
    weather: number;
    speed: number;
  }>();
  const [imageSize, setImageSize] = React.useState<string>();

  useEffect(() => {
    const ws = new WebSocket('ws://10.240.146.129:6000');
    // const ws = new WebSocket('ws://10.240.162.181:6000');

    ws.onopen = () => {
      setServerState('Connected to the server');
    };
    ws.onclose = e => {
      setServerState('Disconnected. Check internet or server test.');
    };
    ws.onerror = e => {
      setServerState(e.message);
    };
    ws.onmessage = e => {
      console.log('Message received ', new Date().getTime());
      const responseObject = JSON.parse(e.data);
      setPositionObject(responseObject.positions);
      setImageBase64(responseObject.image);
      setImageSize(responseObject.size);
    };
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container} />
      <View
        style={{
          height: 30,
          backgroundColor: '#eeceff',
          padding: 5,
        }}>
        <Text>{serverState}</Text>
      </View>

      <View style={styles.navigationHeader}>
        <View style={styles.navigationBox}>
          <Text>Roll</Text>
          <Text style={styles.navigationText}>
            {positionObject?.roll ?? 0}°
          </Text>
        </View>
        <View style={styles.navigationBox}>
          <Text>Pitch</Text>
          <Text style={styles.navigationText}>
            {positionObject?.pitch ?? 0}°
          </Text>
        </View>
        <View style={styles.navigationBox}>
          <Icon name="cloud" size={20} light />
          <Text style={styles.navigationText}>
            {positionObject?.weather ?? 0}
          </Text>
        </View>
        <View style={styles.navigationBox}>
          <Text>Speed</Text>
          <Text style={styles.navigationText}>
            {positionObject?.speed ?? 0} Kts
          </Text>
        </View>
      </View>
      <View style={{paddingLeft: 8}}>
        <Text>Image size is {imageSize ?? 0} MB</Text>
      </View>
      <View
        style={{
          padding: 5,
          flexGrow: 1,
          width: '80%',
        }}>
        <Image
          style={{
            width: '100%',
            marginLeft: 32,
            marginTop: 16,
            height: 500,
            borderColor: 'red',
          }}
          source={{uri: `data:image/jpeg;base64,${imageBase64}`}}></Image>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 30,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    paddingTop: 16,
    fontWeight: 'bold',
  },
  navigationBox: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 16,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  navigationText: {
    fontWeight: 'bold',
    paddingLeft: 8,
  },
  navigationHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
});
