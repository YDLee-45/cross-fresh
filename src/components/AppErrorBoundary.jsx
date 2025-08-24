import React from 'react';
import { View, Text } from 'react-native';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: String(error?.message || error) };
  }
  componentDidCatch(error, info) {
    console.warn('[ErrorBoundary]', error, info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:16 }}>
          <Text style={{ fontSize:18, fontWeight:'700', marginBottom:8 }}>오류가 발생했습니다</Text>
          <Text style={{ color:'#666' }}>{this.state.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
