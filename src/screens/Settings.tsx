import React, {useCallback, useEffect, useContext, useState} from 'react';
import {Platform, Linking, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Switch, Text} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import {saveValueForAsync, clearStorageAsync} from '../utils/storageFunctions';
import {DataContext} from '../context/DataContext';

const isAndroid = Platform.OS === 'android';

export interface Settings {
  warnVibrate: boolean;
  counterVibrate: boolean;
}
const Settings = () => {
  const {settings, saveSetting} = useContext(DataContext);
  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  useEffect(() => {
    (async () => {
      // await clearStorageAsync();
    })();
  }, []);

  const handleSettings = async (type: string) => {
    saveSetting(type);
  };

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            source={assets.background}>
            <Button row flex={0} justify="flex-start">
              <Ionicons size={25} name="settings" color={colors.white} />
            </Button>
          </Image>

          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
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
                      checked={settings.warnVibrate}
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
                      checked={settings.counterVibrate}
                      onPress={() => handleSettings('counterVibrate')}
                    />
                  </Block>
                </>
              )}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Settings;
