import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Dimensions, Platform, TouchableOpacity, Vibration} from 'react-native';

import {Ionicons} from '@expo/vector-icons';
import dayjs from 'dayjs';
import {Stopwatch} from 'react-native-stopwatch-timer';
import {Block, Button, Input, Modal, Switch, Text} from '../components/';
import {DataContext} from '../context/DataContext';
import {useTheme} from '../hooks/';
import {getValueFromAsync, saveValueForAsync} from '../utils/storageFunctions';
import {Audio} from 'expo-av';
import {SOUND} from '../constants/theme';
import {delay} from '../utils/helpers';

const isAndroid = Platform.OS === 'android';
interface Limit {
  stop: number;
  warn: number;
  isWarnAtMulitply: boolean;
}
// @pattern wait/vibrate/wait in ms
const WARN_PATTERN = [0, 400, 200];
const STOP_PATTERN = [0, 600, 200];

const Counter = ({route, navigation}) => {
  const {settings} = useContext(DataContext);

  const item = route?.params?.item || undefined;

  const {colors, gradients, sizes} = useTheme();

  const [count, setCount] = useState(0);
  const [isHideCounter, setIsHideCounter] = useState<boolean>(false);
  const [counterVibrate, setCounterVibrate] = useState(true);
  const [limit, setLimit] = useState<Limit>({
    stop: 0,
    warn: 0,
    isWarnAtMulitply: false,
  });
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');

  const [isStopwatchStart, setIsStopwatchStart] = useState<boolean>(false);
  const [resetStopwatch, setResetStopwatch] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      handleInitialLoad(
        item.count,
        item.stop || 0,
        item.warn || 0,
        item.isWarnAtMulitply || false,
        item?.title,
      );
    } else {
      (async () => {
        const _count = parseInt((await getValueFromAsync('count')) || '0');
        const _stop = parseInt((await getValueFromAsync('stop')) || '0');
        const _warn = parseInt((await getValueFromAsync('warn')) || '0');
        const _isWarnAtMulitply =
          (await getValueFromAsync('isWarnAtMulitply')) === 'true';

        console.log('storage', {
          _count,
          _stop,
          _warn,
        });

        handleInitialLoad(_count, _stop, _warn, _isWarnAtMulitply, '');
      })();
    }

    return () => {};
  }, [item, route.params]);

  // useEffect(() => {
  //   const backAction = async () => {
  //     if (isFocused) {
  //       const _latestCount = latestCountStateRef.current;
  //       console.log('_latestCount', _latestCount);

  //       await saveValueForAsync('latestCount', JSON.stringify(_latestCount));

  //       Alert.alert('Çıkış!', 'Uygulamadan çıkmak istediğinize emin misiniz?', [
  //         {
  //           text: 'Hayır',
  //           onPress: () => null,
  //           style: 'cancel',
  //         },
  //         {text: 'Evet', onPress: () => BackHandler.exitApp()},
  //       ]);
  //       return true;
  //     }
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  const handleInitialLoad = (
    count: number,
    stop: number,
    warn: number,
    isWarnAtMulitply: boolean,
    title: string,
  ) => {
    setCount(count);
    setLimit((state) => ({...state, stop, warn, isWarnAtMulitply}));
    setTitle(title);
  };

  const handleStop = useCallback(
    async (value) => {
      clearMessage();
      await saveValueForAsync('stop', value);
      setLimit((state) => ({...state, stop: value}));
    },
    [setLimit],
  );

  const handleWarn = useCallback(
    async (value) => {
      clearMessage();
      await saveValueForAsync('warn', value);

      setLimit((state) => ({...state, warn: value}));
    },
    [setLimit],
  );

  const handleChangeWarnMultiply = useCallback(async () => {
    if (!limit.warn || limit.warn === 0) {
      return;
    }

    await saveValueForAsync(
      'isWarnAtMulitply',
      limit.isWarnAtMulitply ? 'false' : 'true',
    );

    setLimit((state) => ({
      ...state,
      isWarnAtMulitply: !state.isWarnAtMulitply,
    }));
  }, [limit, setLimit]);

  const handleCountChange = async () => {
    console.log('count', {count, limit, message});

    if (message) {
      clearMessage();
    }

    if (settings.counterSound) {
      const {sound: counterSound} = await Audio.Sound.createAsync(SOUND.click);
      await counterSound.playAsync();
    }

    if (+limit.stop > 0 && +limit.stop === count) {
      return;
    }

    if (+limit.stop > 0 && +limit.stop === count + 1) {
      setMessage('Tamamladınız!');
      await saveValueForAsync('count', (count + 1).toString());

      setCount(count + 1);
      setCounterVibrate(false);

      if (settings?.warnVibrate) {
        Vibration.vibrate(STOP_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 1400);
      }

      if (settings?.warnSound) {
        await delay(50);

        const {sound: completedSound} = await Audio.Sound.createAsync(
          SOUND.complered,
        );
        await completedSound.playAsync();
      }

      return;
    }
    if (+limit.warn > 0 && +limit.warn === count + 1) {
      setMessage('Uyarı limitine ulaşatınız!');

      if (settings?.warnVibrate) {
        Vibration.vibrate(WARN_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 900);
      }
      if (settings?.warnSound) {
        await delay(50);

        const {sound: warnSound} = await Audio.Sound.createAsync(SOUND.warn);
        await warnSound.playAsync();
      }
    } else if (limit.isWarnAtMulitply && (count + 1) % +limit.warn == 0) {
      setMessage('Uyarı limitinin katına ulaşatınız!');
      if (settings?.warnVibrate) {
        Vibration.vibrate(WARN_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 900);
      }
      if (settings?.warnSound) {
        await delay(50);
        const {sound: warnSound} = await Audio.Sound.createAsync(SOUND.warn);
        await warnSound.playAsync();
      }
    }

    await saveValueForAsync('count', (count + 1).toString());
    setCount(count + 1);
  };

  const onLongResetPress = async () => {
    await saveValueForAsync('count', count.toString());
    setCount(0);
    clearMessage();
    setCounterVibrate(true);
  };

  const onSavePress = async () => {
    console.log('time', dayjs().unix());
    if (!title) return setModalVisible(false);

    try {
      let currentSavedItems =
        JSON.parse((await getValueFromAsync('saved')) as string) || [];
      let selectedItem = currentSavedItems.find(
        (elm: any) => elm.title === title,
      );

      if (selectedItem) {
        (selectedItem.count = count),
          (selectedItem.stop = limit.stop),
          (selectedItem.warn = limit.warn);
      } else {
        const newSaveItem = {
          title,
          count,
          stop: limit.stop,
          warn: limit.warn,
          createdAt: dayjs().unix(),
        };
        currentSavedItems?.push(newSaveItem);
      }

      await saveValueForAsync('saved', JSON.stringify(currentSavedItems));
      setTimeout(() => {
        clearMessage();
      }, 2000);
      const message = selectedItem
        ? `${title} üzerine kaydedildi`
        : 'Kaydedildi';
      alert(message);
    } catch (error) {
      alert('Kaydederken hata oldu!');
    } finally {
      setModalVisible(false);
    }
  };

  const clearMessage = () => {
    setMessage('');
  };

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Block flex={0} center>
          <Block center paddingHorizontal={sizes.sm}>
            <Input
              label="Başlık"
              autoCapitalize="none"
              marginBottom={sizes.m}
              marginRight={sizes.xs}
              placeholder="Başlık"
              value={title}
              onChangeText={(value) => setTitle(value)}
            />
            <Block marginTop={sizes.xl} flex={0} row center>
              <Button
                onPress={onSavePress}
                width={'50%'}
                marginRight={sizes.base}
                color={colors.primary}>
                <Text bold transform="uppercase" marginHorizontal={sizes.sm}>
                  Kaydet
                </Text>
              </Button>
              <Button
                onPress={() => setModalVisible(false)}
                width={'50%'}
                color={colors.secondary}>
                <Text bold transform="uppercase" marginHorizontal={sizes.sm}>
                  İptal
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Modal>
      <Block safe>
        <Block>
          <Block flex={0} style={{zIndex: 0}}>
            <Block
              flex={0}
              height={200}
              justify="space-evenly"
              color={colors.primary}
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
              </Block>
              <Block flex={0} row center paddingHorizontal={sizes.l}>
                <Block>
                  <Input
                    label="Dur"
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    marginRight={sizes.xs}
                    keyboardType="number-pad"
                    placeholder="Dur"
                    value={limit.stop.toString()}
                    success={Boolean(+limit.stop > 0)}
                    onChangeText={(value) => handleStop(value)}
                  />
                </Block>
                <Block>
                  <Input
                    label="Uyar"
                    value={limit.warn.toString()}
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    marginLeft={sizes.xs}
                    keyboardType="number-pad"
                    placeholder="Uyar"
                    success={Boolean(+limit.warn > 0)}
                    danger={Boolean(
                      +limit.stop > 0 && +limit.stop < +limit.warn,
                    )}
                    onChangeText={(value) => handleWarn(value)}
                  />
                </Block>
              </Block>
              <Block justify="space-evenly" row paddingHorizontal={sizes.l}>
                <Block align="center" row>
                  <Text marginRight={10} size={10}>
                    Sil
                  </Text>
                  <Button
                    onPress={() =>
                      setLimit({
                        stop: '',
                        warn: '',
                        isWarnAtMulitply: false,
                      })
                    }
                    shadow={!isAndroid}>
                    <Ionicons
                      size={20}
                      name="return-down-back-sharp"
                      color={colors.gray}
                    />
                  </Button>
                </Block>
                <Block align="center" row>
                  <Text marginRight={10} size={9}>
                    Katlarında Uyar
                  </Text>
                  <Switch
                    checked={limit.isWarnAtMulitply}
                    onPress={handleChangeWarnMultiply}
                  />
                </Block>
              </Block>
            </Block>
          </Block>
          <Block keyboard behavior={!isAndroid ? 'padding' : 'height'}>
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
                  justify="center"
                  align="center"
                  height={sizes.xl * 4}
                  radius={20}>
                  <Button
                    disabled={limit.stop > 0 && count === limit.stop}
                    haptic={settings?.counterVibrate && counterVibrate}
                    onPress={handleCountChange}
                    color={colors.secondary}
                    shadow={false}
                    radius={150}
                    width={150}
                    height={150}
                    marginHorizontal={sizes.sm}
                    outlined={String(colors.gray)}>
                    <Ionicons size={60} color={colors.text}>
                      {isHideCounter ? '...' : count}
                    </Ionicons>
                  </Button>
                  {settings?.hideCounterBtn && (
                    <Block position="absolute" top={0} right={5}>
                      <TouchableOpacity
                        onPress={() => setIsHideCounter(!isHideCounter)}>
                        <Ionicons
                          style={{
                            justifyContent: 'flex-end',
                          }}
                          name={isHideCounter ? 'eye-off' : 'eye'}
                          size={20}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                    </Block>
                  )}
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
                    <Ionicons
                      size={20}
                      name="checkmark"
                      color={colors.success}
                    />
                    <Text color={colors.text} size={16}>
                      {message}{' '}
                    </Text>
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
                <Block
                  row
                  center
                  justify="space-evenly"
                  marginVertical={sizes.m}>
                  <Button
                    onLongPress={onLongResetPress}
                    outlined
                    gray
                    shadow={!isAndroid}>
                    <Ionicons
                      size={20}
                      name="return-down-back-sharp"
                      color={colors.text}
                    />
                    <Text color={colors.text}>Sil</Text>
                  </Button>

                  <Button
                    onPress={() => setModalVisible(true)}
                    outlined
                    gray
                    shadow={!isAndroid}>
                    <Ionicons
                      size={20}
                      name="save-outline"
                      color={colors.text}
                    />
                    <Text color={colors.text}>Kaydet</Text>
                  </Button>
                </Block>
              </Block>
              {settings?.stopWatch && (
                <Block
                  blur
                  flex={0}
                  intensity={90}
                  radius={sizes.sm}
                  overflow="hidden"
                  justify="space-evenly"
                  row
                  align="center"
                  tint={colors.blurTint}
                  paddingVertical={sizes.sm}
                  marginTop={sizes.sm}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsStopwatchStart(false);
                      setResetStopwatch(true);
                    }}>
                    <Ionicons
                      size={30}
                      name="return-down-back"
                      color={colors.icon}
                    />
                  </TouchableOpacity>

                  <Stopwatch
                    laps
                    secs
                    start={isStopwatchStart}
                    reset={resetStopwatch}
                    options={{
                      container: {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.secondary,
                      },
                      text: {
                        fontSize: 25,
                        color: colors.text,
                      },
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsStopwatchStart(!isStopwatchStart);
                      setResetStopwatch(false);
                    }}>
                    <Ionicons
                      size={30}
                      name={
                        isStopwatchStart ? 'stopwatch' : 'stopwatch-outline'
                      }
                      color={colors.icon}
                    />
                  </TouchableOpacity>
                </Block>
              )}
            </Block>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default Counter;
