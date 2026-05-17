import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const AetherCmdDeckApp());
}

class AetherCmdDeckApp extends StatelessWidget {
  const AetherCmdDeckApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AETHER Command Deck',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0A0A0A),
        textTheme: ThemeData.dark().textTheme.apply(fontFamily: 'Courier'),
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

enum AppState { normal, alert, siegeMode, offline }

class _DashboardScreenState extends State<DashboardScreen> {
  Timer? _timer;
  AppState _currentState = AppState.offline;
  
  // State variables
  double _ssi = 1.0;
  String _socialSignal = "";
  String _weatherCondition = "";
  bool _siegeModeActive = false;
  String _trafficReroute = "pending";
  String _gridIsolate = "pending";

  @override
  void initState() {
    super.initState();
    _startPolling();
  }

  void _startPolling() {
    _timer = Timer.periodic(const Duration(milliseconds: 1500), (timer) {
      _fetchState();
    });
  }

  Future<void> _fetchState() async {
    try {
      final response = await http.get(Uri.parse('http://127.0.0.1:8080/state'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _ssi = (data['ssi'] as num).toDouble();
          _socialSignal = data['social_signal'] ?? '';
          _weatherCondition = data['weather_condition'] ?? '';
          _siegeModeActive = data['siege_mode_active'] ?? false;
          _trafficReroute = data['traffic_reroute'] ?? 'pending';
          _gridIsolate = data['grid_isolate'] ?? 'pending';
          
          if (_siegeModeActive) {
            _currentState = AppState.siegeMode;
          } else if (_ssi < 0.5) {
            _currentState = AppState.alert;
          } else {
            _currentState = AppState.normal;
          }
        });
      } else {
        setState(() {
          _currentState = AppState.offline;
        });
      }
    } catch (e) {
      setState(() {
        _currentState = AppState.offline;
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Color _getAccentColor() {
    switch (_currentState) {
      case AppState.normal:
        return Colors.blueAccent;
      case AppState.alert:
        return Colors.orangeAccent;
      case AppState.siegeMode:
        return Colors.redAccent;
      case AppState.offline:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AETHER MOBILE COMMAND DECK', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
        backgroundColor: _getAccentColor().withOpacity(0.2),
        elevation: 0,
        centerTitle: true,
      ),
      body: Container(
        decoration: BoxDecoration(
          border: Border.all(color: _getAccentColor(), width: 4),
        ),
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    switch (_currentState) {
      case AppState.normal:
        return _buildNormalState();
      case AppState.alert:
        return _buildAlertState();
      case AppState.siegeMode:
        return _buildSiegeModeState();
      case AppState.offline:
        return _buildOfflineState();
    }
  }

  Widget _buildNormalState() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sovereign Stability Index: STABLE',
            style: TextStyle(color: Colors.blueAccent, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Text('SSI Value: $_ssi', style: const TextStyle(fontSize: 18, color: Colors.white70)),
          const Divider(color: Colors.blueAccent),
          const SizedBox(height: 20),
          const Text('LIVE STREAMS:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Expanded(
            child: ListView(
              children: [
                _buildLogItem('SOCIAL_SIGNAL', _socialSignal, Colors.lightBlue),
                _buildLogItem('WEATHER_API', _weatherCondition, Colors.lightBlue),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildAlertState() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.orangeAccent.withOpacity(0.3),
            child: const Text(
              'CRITICAL ANOMALY: TWO-KEY CONSENSUS REQUIRED',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.orangeAccent, fontSize: 22, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 20),
          Text('SSI DROPPED TO: $_ssi', style: const TextStyle(color: Colors.red, fontSize: 18, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
          const SizedBox(height: 20),
          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.redAccent),
                      color: Colors.redAccent.withOpacity(0.1),
                    ),
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('AGENT ARES', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 18)),
                        const Divider(color: Colors.redAccent),
                        const SizedBox(height: 10),
                        const Text('THREAT DETECTED:', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('Social Signal: $_socialSignal'),
                        Text('Weather Signal: $_weatherCondition'),
                        const SizedBox(height: 10),
                        const Text('RECOMMENDATION:\nInitiate Grid Isolation immediately to prevent cascading failure.', style: TextStyle(fontStyle: FontStyle.italic)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.orangeAccent),
                      color: Colors.orangeAccent.withOpacity(0.1),
                    ),
                    padding: const EdgeInsets.all(12),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('AGENT ATHENA', style: TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold, fontSize: 18)),
                        const Divider(color: Colors.orangeAccent),
                        const SizedBox(height: 10),
                        const Text('STRATEGIC OVERVIEW:', style: TextStyle(fontWeight: FontWeight.bold)),
                        const Text('Evacuation routes require clearance.'),
                        const SizedBox(height: 10),
                        const Text('RECOMMENDATION:\nExecute Traffic Rerouting prior to Grid Isolation to minimize civilian casualties.', style: TextStyle(fontStyle: FontStyle.italic)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSiegeModeState() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.redAccent.withOpacity(0.5),
            child: const Text(
              'SYSTEM LOCKED / ROUTING LIVE',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold, letterSpacing: 3),
            ),
          ),
          const SizedBox(height: 30),
          const Text('SIEGE MODE LOGS', style: TextStyle(color: Colors.redAccent, fontSize: 20, fontWeight: FontWeight.bold)),
          const Divider(color: Colors.redAccent),
          Expanded(
            child: ListView(
              children: [
                _buildLogItem('TRAFFIC_MODULE', 'Status: $_trafficReroute', _trafficReroute == 'executed' ? Colors.green : Colors.red),
                _buildLogItem('GRID_MODULE', 'Status: $_gridIsolate', _gridIsolate == 'executed' ? Colors.green : Colors.red),
                const SizedBox(height: 20),
                const Center(
                  child: Icon(Icons.lock_outline, color: Colors.redAccent, size: 60),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildOfflineState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.wifi_off, color: Colors.grey, size: 64),
          SizedBox(height: 16),
          Text(
            'CONNECTION DROPPED',
            style: TextStyle(color: Colors.grey, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text('Attempting to reconnect to AETHER backend...', style: TextStyle(color: Colors.white54)),
        ],
      ),
    );
  }

  Widget _buildLogItem(String module, String message, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: RichText(
        text: TextSpan(
          style: const TextStyle(fontFamily: 'Courier', fontSize: 16),
          children: [
            TextSpan(text: '[$module] ', style: TextStyle(color: color, fontWeight: FontWeight.bold)),
            TextSpan(text: message, style: const TextStyle(color: Colors.white)),
          ],
        ),
      ),
    );
  }
}
