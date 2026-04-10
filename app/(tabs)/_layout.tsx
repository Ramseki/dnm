import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ChartBar as BarChart2, Star, Bell, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sinyaller',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color, size }) => (
            <Star color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Bildirimler',
          tabBarIcon: ({ color, size }) => (
            <Bell color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    height: 64,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: Colors.tabBar,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
});
