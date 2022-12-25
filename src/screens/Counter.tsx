import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  BackHandler,
  TouchableOpacity,
  Vibration,
  View,
  Alert,
} from 'react-native';

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
  Modal,
} from '../components/';
import {Ionicons} from '@expo/vector-icons';
import {
  clearStorageAsync,
  getValueFromAsync,
  saveValueForAsync,
} from '../utils/storageFunctions';
import {DataContext} from '../context/DataContext';
import dayjs from 'dayjs';
import useStateCallback from '../hooks/useStateCallback';
import {useIsFocused} from '@react-navigation/native';
import {Stopwatch, Timer} from 'react-native-stopwatch-timer';

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
interface Limit {
  stop: string;
  warn: string;
}
// @pattern wait/vibrate/wait in ms
const WARN_PATTERN = [0, 400, 200];
const STOP_PATTERN = [0, 600, 200];

const Counter = ({route, navigation}) => {
  const isFocused = useIsFocused();

  const {settings} = useContext(DataContext);

  const item = route?.params?.item || undefined;

  const {assets, colors, gradients, sizes} = useTheme();

  const {t} = useTranslation();

  const [count, setCount] = useState(0);
  const [isHideCounter, setIsHideCounter] = useState<boolean>(false);
  const [counterVibrate, setCounterVibrate] = useState(true);
  const [limit, setLimit] = useState<Limit>({
    stop: '',
    warn: '',
  });
  const [isWarnAtMulitply, setIsWarnAtMulitply] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');

  const latestCountStateRef = React.useRef({
    count: 0,
    limit: '',
    stop: '',
  });

  const [isStopwatchStart, setIsStopwatchStart] = useState<boolean>(false);
  const [resetStopwatch, setResetStopwatch] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      handleInitialLoad(
        item.count,
        item.stop || '',
        item.warn || '',
        item?.title,
      );
    } else {
      (async () => {
        const latestCount = JSON.parse(
          (await getValueFromAsync('latestCount')) as string,
        ) || {
          count: 0,
          stop: '',
          limit: '',
        };
        console.log('latestCount', latestCount);

        if (latestCount && Object.keys(latestCount).length !== 0) {
          handleInitialLoad(
            latestCount.count,
            latestCount.stop,
            latestCount.warn,
            '',
          );
        }
      })();
    }

    return () => {};
  }, [item, route.params]);

  useEffect(() => {
    const backAction = async () => {
      if (isFocused) {
        const _latestCount = latestCountStateRef.current;
        console.log('_latestCount', _latestCount);

        await saveValueForAsync('latestCount', JSON.stringify(_latestCount));

        Alert.alert('Çıkış!', 'Uygulamadan çıkmak istediğinize emin misiniz?', [
          {
            text: 'Hayır',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Evet', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const handleInitialLoad = (
    count: number,
    stop: number,
    warn: number,
    title?: string,
  ) => {
    setCount(count);
    setLimit((state) => ({...state, stop}));
    setLimit((state) => ({...state, warn}));
    setTitle(title);
  };

  const handleChange = useCallback(
    (value) => {
      clearMessage();
      // to get the lastest state in event listener
      latestCountStateRef.current = {
        ...latestCountStateRef.current,
        ...value,
      };
      setLimit((state) => ({...state, ...value}));
    },
    [setLimit],
  );

  const handleChangeWarnMultiply = () => {
    if (!limit.warn || limit.warn === '0') {
      return;
    }
    setIsWarnAtMulitply(!isWarnAtMulitply);
  };

  const handleCountChange = () => {
    if (message) {
      clearMessage();
    }
    if (+limit.stop > 0 && +limit.stop === count) {
      return;
    }
    if (+limit.stop > 0 && +limit.stop === count + 1) {
      setMessage('Tamamladınız!');
      // to get the lastest state in event listener
      latestCountStateRef.current = {
        ...latestCountStateRef.current,
        count: count + 1,
      };
      setCount(count + 1);
      setCounterVibrate(false);

      if (settings?.warnVibrate) {
        Vibration.vibrate(STOP_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 1400);
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
    } else if (isWarnAtMulitply && (count + 1) % +limit.warn == 0) {
      setMessage('Uyarı limitinin katına ulaşatınız!');
      if (settings?.warnVibrate) {
        Vibration.vibrate(WARN_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 900);
      }
    }

    // to get the lastest state in event listener
    latestCountStateRef.current = {
      ...latestCountStateRef.current,
      count: count + 1,
    };
    setCount(count + 1);
  };
  const onLongResetPress = () => {
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
      setMessage('Kaydedildi');
      setTimeout(() => {
        clearMessage();
      }, 2000);
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
                    value={limit.stop}
                    success={Boolean(+limit.stop > 0)}
                    onChangeText={(value) => handleChange({stop: value})}
                  />
                </Block>
                <Block>
                  <Input
                    label="Uyar"
                    value={limit.warn}
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    marginLeft={sizes.xs}
                    keyboardType="number-pad"
                    placeholder="Uyar"
                    success={Boolean(+limit.warn > 0)}
                    danger={Boolean(
                      +limit.stop > 0 && +limit.stop < +limit.warn,
                    )}
                    onChangeText={(value) => handleChange({warn: value})}
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
                    checked={isWarnAtMulitply}
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
                    <Ionicons size={60} color={colors.white}>
                      {isHideCounter ? '' : count}
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
                      color={colors.secondary}
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
                      color={colors.secondary}
                    />
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
                      color={colors.secondary}
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
                        color: '#FFF',
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
                      color={colors.secondary}
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
