import React, {useCallback, useEffect, useContext, useState} from 'react';
import {ActivityIndicator, Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Switch, Text} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import {saveValueForAsync, clearStorageAsync} from '../utils/storageFunctions';
import {DataContext} from '../context/DataContext';
import {light, dark, warm, nature, original, sky} from '../constants';
import Constants from 'expo-constants';
import appJson from '../../app.json';
import {TouchableOpacity} from 'react-native-gesture-handler';
const isAndroid = Platform.OS === 'android';

export interface Settings {
  warnVibrate: boolean;
  counterVibrate: boolean;
}
const COLORS = [
  {
    title: 'light',
    color: light.colors.background,
  },
  {
    title: 'dark',
    color: dark.colors.background,
  },
  {
    title: 'warm',
    color: warm.colors.background,
  },
  {
    title: 'nature',
    color: nature.colors.background,
  },
  {
    title: 'original',
    color: original.colors.background,
  },
  {
    title: 'sky',
    color: sky.colors.background,
  },
];
const Settings = () => {
  const {settings, saveSetting} = useContext(DataContext);
  const {themeType, handleThemeChange} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  // for andriod
  const newUpdateAvailable =
    Constants.manifest?.version !== appJson.expo.version;

  const handleSettings = async (type: string) => {
    saveSetting(type);
  };

  const onNewUpdatePress = () => {
    let url = '';
    if (Platform.OS === 'android') {
      url =
        'https://play.google.com/store/apps/details?id=com.irfanonk.rnsoftuikitfree';
    }

    try {
      Linking.openURL(url);
    } catch (error) {
      alert(`Cannot open URL: ${url}`);
    }
  };

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Block
            color={colors.primary}
            padding={sizes.sm}
            paddingBottom={sizes.l}>
            <Button row flex={0} justify="flex-start">
              <Ionicons size={25} name="settings" color={colors.gray} />
            </Button>
          </Block>

          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={sizes.l}
            marginHorizontal="8%">
            <Block
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              padding={sizes.sm}
              renderToHardwareTextureAndroid>
              {!settings ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Block row flex={0} align="center" justify="space-between">
                    <Text>Uyarı titreşimi </Text>
                    <Switch
                      checked={settings?.warnVibrate}
                      onPress={() => handleSettings('warnVibrate')}
                    />
                  </Block>
                  <Block
                    row
                    flex={0}
                    align="center"
                    justify="space-between"
                    marginTop={sizes.s}>
                    <Text>Sayaç titreşimi </Text>
                    <Switch
                      checked={settings?.counterVibrate}
                      onPress={() => handleSettings('counterVibrate')}
                    />
                  </Block>
                  <Block
                    row
                    flex={0}
                    align="center"
                    justify="space-between"
                    marginTop={sizes.s}>
                    <Text>Sayaç göster/gizle butonu </Text>
                    <Switch
                      checked={settings?.hideCounterBtn}
                      onPress={() => handleSettings('hideCounterBtn')}
                    />
                  </Block>
                  <Block
                    row
                    flex={0}
                    align="center"
                    justify="space-between"
                    marginTop={sizes.s}>
                    <Text>Kronometre </Text>
                    <Switch
                      checked={settings?.stopWatch || false}
                      onPress={() => handleSettings('stopWatch')}
                    />
                  </Block>
                </>
              )}
            </Block>
            <Block
              marginTop={10}
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              padding={sizes.sm}
              renderToHardwareTextureAndroid>
              {!settings ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Block
                    flex={0}
                    align="center"
                    justify="space-between"
                    marginTop={sizes.s}>
                    <Block>
                      <Text>Tema </Text>
                    </Block>
                    <Block row>
                      {COLORS.map((color) => {
                        return (
                          <Button
                            key={color.title}
                            onPress={() => handleThemeChange(color.title)}
                            color={color.color}
                            width={20}
                            height={20}
                            margin={2}
                            radius={50}>
                            {themeType === color.title && (
                              <Ionicons
                                size={20}
                                name="checkmark"
                                color={colors.success}
                              />
                            )}
                          </Button>
                        );
                      })}
                    </Block>
                  </Block>
                </>
              )}
            </Block>
          </Block>
        </Block>
      </Block>
      {newUpdateAvailable && (
        <Block padding={10} position="absolute" bottom={20}>
          <TouchableOpacity onPress={onNewUpdatePress}>
            <Text color={colors.primary}>New Update Available </Text>
          </TouchableOpacity>
        </Block>
      )}
    </Block>
  );
};

export default Settings;
