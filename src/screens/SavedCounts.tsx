import React, {useCallback, useEffect, useContext, useState} from 'react';
import {Platform, Linking, ActivityIndicator, FlatList} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Switch, Text} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import {saveValueForAsync, clearStorageAsync} from '../utils/storageFunctions';
import {DataContext, DataContextType} from '../context/DataContext';
import dayjs from 'dayjs';

const isAndroid = Platform.OS === 'android';

const MockData = [
  {
    id: 1,
    title: 'aduket',
    count: 20,
    stop: 300,
    warn: 100,
    createdAt: 1107110465663,
  },
  {
    id: 2,
    title: 'hop',
    count: 60,
    stop: 500,
    warn: 100,
    createdAt: 1106013465663,
  },
];

const SavedCounts = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // await clearStorageAsync();
    })();
  }, []);

  const SavedItem = (item) => {
    const {count, title, stop, warn, createdAt} = item;
    return (
      <Block
        row
        blur
        flex={0}
        radius={sizes.sm}
        overflow="hidden"
        justify="space-evenly">
        <Block align="center">
          <Text h5>{title}</Text>
        </Block>
        <Block align="center">
          <Text h5>{count}</Text>
        </Block>
        <Block align="center">
          <Text h5>
            {stop}/{warn}{' '}
          </Text>
        </Block>
        <Block align="center">
          <Text h5>{dayjs(createdAt).format('DD/MM/YYYY')}</Text>
        </Block>
      </Block>
    );
  };

  return (
    <Block safe marginTop={sizes.md}>
      <Block
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Ionicons size={25} name="settings" color={colors.white} />
            </Button>
          </Image>

          {/* profile: stats */}
          {/* <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
            <Block
              row
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text h5>{user?.stats?.posts}</Text>
                <Text>Toplam Sayaç</Text>
              </Block>
              <Block align="center">
                <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text>
                <Text>{t('profile.followers')}</Text>
              </Block>
              <Block align="center">
                <Text h5>{(user?.stats?.following || 0) / 1000}k</Text>
                <Text>{t('profile.following')}</Text>
              </Block>
            </Block>
          </Block> */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
            {!isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Block
                  row
                  blur
                  flex={0}
                  radius={sizes.sm}
                  overflow="hidden"
                  justify="space-evenly">
                  <Block align="center">
                    <Text>Başlık</Text>
                  </Block>
                  <Block align="center">
                    <Text>Toplam</Text>
                  </Block>
                  <Block align="center">
                    <Text>Dur/Uyar</Text>
                  </Block>
                  <Block align="center">
                    <Text>Tarih</Text>
                  </Block>
                </Block>
                <FlatList
                  data={MockData}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => `${item?.id}`}
                  style={{paddingHorizontal: sizes.padding}}
                  contentContainerStyle={{paddingBottom: sizes.l}}
                  renderItem={({item}) => <SavedItem {...item} />}
                />
              </>
            )}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default SavedCounts;
