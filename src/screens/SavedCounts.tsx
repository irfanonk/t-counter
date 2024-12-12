import React, {useState, useEffect} from 'react';
import {Animated, FlatList, ActivityIndicator} from 'react-native';
import {Block, Image, Button} from '../components';

import SavedCountCard from './components/SavedCountCard';
import {Ionicons} from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import {
  clearStorageAsync,
  getValueFromAsync,
  saveValueForAsync,
} from '../utils/storageFunctions';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SavedCounts = () => {
  const {assets, colors, sizes, gradients} = useTheme();
  const y = new Animated.Value(0);
  const onScroll = Animated.event([{nativeEvent: {contentOffset: {y}}}], {
    useNativeDriver: true,
  });

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

  const deleteSavedCount = async (createdAt: string) => {
    console.log('createdAt', createdAt);
    const _savedCounts = savedCounts.filter(
      (count) => count.createdAt !== createdAt,
    );
    await saveValueForAsync('saved', JSON.stringify(_savedCounts));
    setSavedCounts(_savedCounts);
  };

  return (
    <Block>
      <Block
        flex={0}
        color={colors.primary}
        padding={sizes.sm}
        paddingBottom={sizes.l}>
        <Button row justify="flex-start">
          <Ionicons size={25} name="save" color={colors.gray} />
        </Button>
      </Block>

      <Block marginTop={sizes.l} flex={0}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <AnimatedFlatList
            scrollEventThrottle={16}
            bounces={true}
            data={savedCounts}
            renderItem={({item, index}) => (
              <SavedCountCard
                key={index}
                onDeletePress={deleteSavedCount}
                {...{index, item, y}}
              />
            )}
            keyExtractor={({item, index}) => index}
            {...{onScroll}}
          />
        )}
      </Block>
    </Block>
  );
};

export default SavedCounts;
