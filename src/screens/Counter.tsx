import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Linking,
  Modal,
  Platform,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {
  Block,
  Button,
  Input,
  Image,
  Text,
  Checkbox,
  Switch,
} from '../components/';
import {Ionicons} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {getValueFromAsync} from '../utils/storageFunctions';
import {DataContext} from '../context/DataContext';

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  stop: number;
  warn: number;
}
// @pattern wait/vibrate/wait in ms
const WARN_PATTERN = [0, 400, 200];
const STOP_PATTERN = [0, 600, 200];

const Counter = () => {
  const {settings} = useContext(DataContext);
  console.log('settings _c', settings);

  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState<IRegistration>({
    stop: 0,
    warn: 0,
  });
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value) => {
      clearMessage();
      setLimit((state) => ({...state, ...value}));
    },
    [setLimit],
  );

  const handleCountChange = () => {
    if (message) {
      clearMessage();
    }
    if (limit.stop > 0 && limit.stop === count) {
      return;
    }
    if (settings?.warnVibrate) {
      if (limit.stop > 0 && limit.stop === count + 1) {
        console.log('stop');
        setMessage('Tamamladınız!');
        setCount(count + 1);
        Vibration.vibrate(STOP_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 1400);
        return;
      }
      if (limit.warn > 0 && limit.warn === count + 1) {
        console.log('warn');
        setMessage('Uyarı limitine ulşatınız!');

        Vibration.vibrate(WARN_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 900);
      }
    }

    setCount(count + 1);
  };
  const onResetPress = () => {
    setCount(0);
    clearMessage();
  };

  const clearMessage = () => {
    setMessage('');
  };

  return (
    <Block safe marginTop={sizes.md}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Block center black>
          <Block center paddingHorizontal={sizes.sm}>
            <Input
              label="Başlık"
              autoCapitalize="none"
              marginBottom={sizes.m}
              marginRight={sizes.xs}
              keyboardType="default"
              placeholder="Başlık"
              onChangeText={(value) => handleChange({stop: +value || 0})}
            />
            <Block marginTop={sizes.xl} flex={0} row center>
              <Button
                width={'50%'}
                marginRight={sizes.base}
                gradient={gradients.success}>
                <Text
                  white
                  bold
                  transform="uppercase"
                  marginHorizontal={sizes.sm}>
                  Kaydet
                </Text>
              </Button>
              <Button width={'50%'} gradient={gradients.secondary}>
                <Text
                  white
                  bold
                  transform="uppercase"
                  marginHorizontal={sizes.sm}>
                  İptal
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Modal>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            paddingLeft={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}></Image>
        </Block>
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.3 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}
              marginBottom={sizes.sm}>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  Limit
                </Text>

                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
                {/* <Ionicons
                  onPress={onResetLimit}
                  size={20}
                  name="return-down-back-sharp"
                  color={colors.primary}
                /> */}
              </Block>
              <Block flex={0} row center paddingHorizontal={sizes.sm}>
                <Input
                  style={{
                    width: '50%',
                  }}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  marginRight={sizes.xs}
                  keyboardType="number-pad"
                  placeholder="Dur"
                  success={Boolean(limit.stop > 0)}
                  onChangeText={(value) => handleChange({stop: +value || 0})}
                />
                <Input
                  style={{
                    width: '50%',
                  }}
                  value={limit.warn}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  marginLeft={sizes.xs}
                  keyboardType="number-pad"
                  placeholder="Uyar"
                  success={Boolean(limit.warn > 0)}
                  danger={Boolean(limit.stop > 0 && limit.stop < limit.warn)}
                  onChangeText={(value) => handleChange({warn: +value || 0})}
                />
              </Block>
            </Block>
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}
              marginBottom={sizes.sm}>
              <Block
                justify="center"
                height={sizes.xl * 5}
                padding={sizes.sm}
                radius={20}>
                <Button
                  disabled={limit.stop > 0 && count === limit.stop}
                  haptic={settings?.counterVibrate}
                  onPress={handleCountChange}
                  color={colors.secondary}
                  shadow={false}
                  radius={200}
                  height={250}
                  marginHorizontal={sizes.sm}
                  outlined={String(colors.gray)}>
                  <Ionicons size={60} color={colors.white}>
                    {count}
                  </Ionicons>
                </Button>
              </Block>
            </Block>
            {message.length > 0 && (
              <Block
                animation={800}
                blur
                overflow="hidden"
                justify="space-evenly"
                paddingVertical={sizes.sm}>
                <Block
                  row
                  center
                  justify="space-evenly"
                  marginVertical={sizes.m}>
                  <Ionicons size={20} name="checkmark" color={colors.success} />
                  <Text>{message} </Text>
                </Block>
              </Block>
            )}
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}
              marginTop={sizes.sm}>
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button
                  onLongPress={onResetPress}
                  outlined
                  gray
                  shadow={!isAndroid}>
                  <Ionicons
                    size={20}
                    name="return-down-back-sharp"
                    color={colors.primary}
                  />
                </Button>
                <Button
                  onPress={() => setModalVisible(true)}
                  outlined
                  gray
                  shadow={!isAndroid}>
                  <Ionicons
                    size={20}
                    name="save-outline"
                    color={colors.primary}
                  />
                </Button>
                <Button
                  onPress={() => navigation.navigate('Settings')}
                  outlined
                  gray
                  shadow={!isAndroid}>
                  <Ionicons
                    size={20}
                    name="ios-settings-outline"
                    color={colors.primary}
                  />
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Counter;
