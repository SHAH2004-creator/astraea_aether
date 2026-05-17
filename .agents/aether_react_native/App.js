import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';

export default function App() {
  const [stateData, setStateData] = useState(null);
  const [offline, setOffline] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/state');
        if (response.ok) {
          const data = await response.json();
          setStateData(data);
          setOffline(false);
        } else {
          setOffline(true);
        }
      } catch (error) {
        setOffline(true);
      }
    };

    fetchState(); // Initial fetch
    const interval = setInterval(fetchState, 1500); // Poll every 1.5s
    return () => clearInterval(interval);
  }, []);

  if (offline || !stateData) {
    return (
      <SafeAreaView style={[styles.container, styles.offlineContainer]}>
        <ActivityIndicator size="large" color="#555" />
        <Text style={styles.offlineText}>CONNECTION DROPPED</Text>
        <Text style={styles.subText}>Attempting to reconnect to AETHER backend...</Text>
      </SafeAreaView>
    );
  }

  const { ssi, siege_mode_active, social_signal, weather_condition, traffic_reroute, grid_isolate } = stateData;

  let theme = 'NORMAL';
  if (siege_mode_active) theme = 'SIEGE';
  else if (ssi < 0.5) theme = 'ALERT';

  const getBorderColor = () => {
    if (theme === 'SIEGE') return '#ff3b30'; // Crimson Red
    if (theme === 'ALERT') return '#ff9500'; // Amber Orange
    return '#007aff'; // Neon Blue
  };

  return (
    <SafeAreaView style={[styles.container, { borderColor: getBorderColor(), borderWidth: 4 }]}>
      <View style={[styles.header, { backgroundColor: getBorderColor() + '33' }]}>
        <Text style={styles.headerText}>AETHER MOBILE COMMAND DECK</Text>
      </View>

      <View style={styles.content}>
        {theme === 'NORMAL' && (
          <View>
            <Text style={[styles.title, { color: '#007aff' }]}>Sovereign Stability Index: STABLE</Text>
            <Text style={styles.metric}>SSI Value: {ssi.toFixed(2)}</Text>
            <View style={styles.divider} />
            <Text style={styles.subHeader}>LIVE STREAMS:</Text>
            <Text style={styles.log}>[SOCIAL_SIGNAL] {social_signal}</Text>
            <Text style={styles.log}>[WEATHER_API] {weather_condition}</Text>
          </View>
        )}

        {theme === 'ALERT' && (
          <View>
            <View style={[styles.alertBanner, { backgroundColor: '#ff950044' }]}>
              <Text style={[styles.alertText, { color: '#ff9500' }]}>CRITICAL ANOMALY: TWO-KEY CONSENSUS REQUIRED</Text>
            </View>
            <Text style={[styles.title, { color: '#ff3b30', marginTop: 20 }]}>SSI DROPPED TO: {ssi.toFixed(2)}</Text>
            <View style={styles.splitScreen}>
               <View style={[styles.agentBox, { borderColor: '#ff3b30', backgroundColor: '#ff3b3011' }]}>
                 <Text style={[styles.agentHeader, { color: '#ff3b30' }]}>AGENT ARES</Text>
                 <View style={[styles.divider, { backgroundColor: '#ff3b30' }]} />
                 <Text style={styles.boldText}>THREAT DETECTED:</Text>
                 <Text style={styles.log}>Social: {social_signal}</Text>
                 <Text style={styles.log}>Weather: {weather_condition}</Text>
                 <Text style={styles.italicText}>RECOMMENDATION: Initiate Grid Isolation immediately.</Text>
               </View>
               <View style={[styles.agentBox, { borderColor: '#ff9500', backgroundColor: '#ff950011' }]}>
                 <Text style={[styles.agentHeader, { color: '#ff9500' }]}>AGENT ATHENA</Text>
                 <View style={[styles.divider, { backgroundColor: '#ff9500' }]} />
                 <Text style={styles.boldText}>STRATEGIC OVERVIEW:</Text>
                 <Text style={styles.log}>Evacuation routes require clearance.</Text>
                 <Text style={styles.italicText}>RECOMMENDATION: Execute Traffic Rerouting prior to isolation.</Text>
               </View>
            </View>
          </View>
        )}

        {theme === 'SIEGE' && (
          <View style={styles.siegeContainer}>
            <View style={[styles.alertBanner, { backgroundColor: '#ff3b3077', padding: 20 }]}>
              <Text style={[styles.alertText, { color: '#fff', fontSize: 24, letterSpacing: 3 }]}>SYSTEM LOCKED / ROUTING LIVE</Text>
            </View>
            <Text style={[styles.title, { color: '#ff3b30', marginTop: 30 }]}>SIEGE MODE LOGS</Text>
            <View style={[styles.divider, { backgroundColor: '#ff3b30' }]} />
            <Text style={[styles.log, { color: traffic_reroute === 'executed' ? '#34c759' : '#ff3b30' }]}>
              [TRAFFIC_MODULE] Status: {traffic_reroute}
            </Text>
            <Text style={[styles.log, { color: grid_isolate === 'executed' ? '#34c759' : '#ff3b30' }]}>
              [GRID_MODULE] Status: {grid_isolate}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  offlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: '#888',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    fontFamily: 'Courier',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Courier',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  metric: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 8,
    fontFamily: 'Courier',
  },
  subHeader: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Courier',
  },
  subText: {
    color: '#666',
    marginTop: 8,
    fontFamily: 'Courier',
  },
  log: {
    color: '#aaa',
    fontSize: 16,
    marginVertical: 4,
    fontFamily: 'Courier',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  alertBanner: {
    padding: 12,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Courier',
  },
  splitScreen: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  agentBox: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 4,
  },
  agentHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Courier',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#aaa',
    marginTop: 10,
    fontFamily: 'Courier',
  },
  siegeContainer: {
    flex: 1,
  }
});
