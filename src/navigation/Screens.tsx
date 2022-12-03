import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';
import Counter from '../screens/Counter';
import Settings from '../screens/Settings';
import SavedCounts from '../screens/SavedCounts';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Counter"
        component={Counter}
        options={{...screenOptions.counter, title: 'Sayaç'}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{...screenOptions.back, title: 'Ayarlar'}}
      />
      <Stack.Screen
        name="SavedCounts"
        component={SavedCounts}
        options={{...screenOptions.back, title: 'Kayıtlar'}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
