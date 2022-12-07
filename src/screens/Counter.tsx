import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  BackHandler,
  TouchableOpacity,
  Vibration,
  View,
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
import {getValueFromAsync, saveValueForAsync} from '../utils/storageFunctions';
import {DataContext} from '../context/DataContext';
import dayjs from 'dayjs';
import useStateCallback from '../hooks/useStateCallback';

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
  const {settings} = useContext(DataContext);

  const item = route?.params?.item || undefined;

  const {assets, colors, gradients, sizes} = useTheme();

  const {isDark} = useData();
  const {t} = useTranslation();
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState<Limit>({
    stop: '',
    warn: '',
  });
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  useEffect(() => {
    if (item) {
      setCount(item.count);
      if (item.stop > 0) {
        setLimit((state) => ({...state, stop: item.stop}));
      }
      if (item.warn > 0) {
        setLimit((state) => ({...state, warn: item.warn}));
      }
      setTitle(item?.title);
    }
  }, [item, route.params]);

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
        setMessage('Uyarı limitine ulaşatınız!');

        Vibration.vibrate(WARN_PATTERN, true);
        setTimeout(() => {
          Vibration.cancel();
        }, 900);
      }
    }

    setCount(count + 1);
  };
  const onLongResetPress = () => {
    setCount(0);
    clearMessage();
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
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Block center>
          <Block center color={colors.white} paddingHorizontal={sizes.sm}>
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
                gradient={gradients.primary}>
                <Text
                  white
                  bold
                  transform="uppercase"
                  marginHorizontal={sizes.sm}>
                  Kaydet
                </Text>
              </Button>
              <Button
                onPress={() => setModalVisible(false)}
                width={'50%'}
                gradient={gradients.secondary}>
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
      <Block safe>
        <Block>
          <Block flex={0} style={{zIndex: 0}}>
            <Image
              background
              resizeMode="cover"
              paddingLeft={sizes.sm}
              source={assets.background}
              height={sizes.height * 0.3}></Image>
          </Block>
          <Block
            keyboard
            behavior={!isAndroid ? 'padding' : 'height'}
            marginTop={-(sizes.height * 0.3 - sizes.xl)}>
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
                    value={limit.stop.toString()}
                    success={Boolean(limit.stop > 0)}
                    onChangeText={(value) => handleChange({stop: +value || 0})}
                  />
                  <Input
                    style={{
                      width: '50%',
                    }}
                    value={limit.warn.toString()}
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
                  align="center"
                  height={sizes.xl * 3}
                  padding={sizes.sm}
                  radius={20}>
                  <Button
                    disabled={limit.stop > 0 && count === limit.stop}
                    haptic={settings?.counterVibrate}
                    onPress={handleCountChange}
                    color={colors.secondary}
                    shadow={false}
                    radius={150}
                    width={150}
                    height={150}
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
                    <Ionicons
                      size={20}
                      name="checkmark"
                      color={colors.success}
                    />
                    <Text color={colors.primary} size={16}>
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
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default Counter;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    width,
    backgroundColor: '#0a5386',
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  exitTitleText: {
    textAlign: 'center',
    color: '#ffffff',
    marginRight: 10,
  },
  exitText: {
    color: '#e5933a',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
};
