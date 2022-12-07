import React, {useCallback, useEffect, useContext, useState} from 'react';
import {Platform, Linking, ActivityIndicator, FlatList} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Switch, Text} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import {
  saveValueForAsync,
  clearStorageAsync,
  getValueFromAsync,
} from '../utils/storageFunctions';
import {DataContext, DataContextType} from '../context/DataContext';
import dayjs from 'dayjs';
import {TouchableOpacity} from 'react-native-gesture-handler';

const isAndroid = Platform.OS === 'android';

const SavedCounts = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [savedCounts, setSavedCounts] = useState([]);

  useEffect(() => {
    (async () => {
      // await clearStorageAsync();
      try {
        const _savedCounts =
          JSON.parse((await getValueFromAsync('saved')) as string) || [];

        if (_savedCounts.length > 0) {
          setSavedCounts(_savedCounts);
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const SavedItem = (item) => {
    const {count, title, stop, warn, createdAt} = item;
    return (
      <Block
        row
        blur
        flex={0}
        height={40}
        radius={sizes.sm}
        overflow="hidden"
        justify="space-evenly">
        <Block align="center">
          <Text h6>{title}</Text>
        </Block>
        <Block align="center">
          <Text h6>{count}</Text>
        </Block>
        <Block align="center">
          <Text>
            {stop}/{warn}{' '}
          </Text>
        </Block>
        <Block align="center">
          <Text size={10}>
            {dayjs.unix(createdAt).format('DD/MM/YYYY hh:ss')}
          </Text>
        </Block>
        <Block align="center">
          <Text size={10}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Counter', {
                  item: item,
                })
              }>
              <Ionicons size={20} name="log-in" color={colors.primary} />
            </TouchableOpacity>
          </Text>
        </Block>
      </Block>
    );
  };

  const ListHeader = () => (
    <Block
      row
      blur
      flex={0}
      marginVertical={sizes.sm}
      style={{
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
      }}
      overflow="hidden"
      justify="space-evenly">
      <Block align="center">
        <Text>Başlık</Text>
      </Block>
      <Block align="center">
        <Text>Sayaç</Text>
      </Block>
      <Block align="center">
        <Text>Dur/Uyar</Text>
      </Block>
      <Block align="center">
        <Text>Tarih</Text>
      </Block>
      <Block align="center">
        <Text>Devam Et</Text>
      </Block>
    </Block>
  );

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s} showsVerticalScrollIndicator={false}>
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

          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={sizes.l}
            color="rgba(255,255,255,0.2)">
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <FlatList
                  data={savedCounts}
                  ListHeaderComponent={ListHeader}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => `${item?.createdAt}`}
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
