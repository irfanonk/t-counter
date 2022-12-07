import React, {useState, useEffect} from 'react';
import {Animated, FlatList, ActivityIndicator} from 'react-native';
import {Block, Image, Button} from '../components';

import SavedItemCard from './components/SavedCountCard';
import {Ionicons} from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import {getValueFromAsync} from '../utils/storageFunctions';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const mockData = [
  {
    id: 0,
    title: 'test 0',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 1,
    title: 'test 1',
    count: 200,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 2,
    title: 'test 2',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 3,
    title: 'test 3',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 4,
    title: 'tes 4',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 5,
    title: 'test 5',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 6,
    title: 'test 6',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 7,
    title: 'test 7',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 8,
    title: 'test 8',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
  {
    id: 9,
    title: 'test 9',
    count: 100,
    stop: 100,
    warn: 50,
    createdAt: 12323,
  },
];

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

  return (
    <Block>
      <Image
        background
        resizeMode="cover"
        padding={sizes.sm}
        paddingBottom={sizes.l}
        source={assets.background}>
        <Button row flex={0} justify="flex-start">
          <Ionicons size={25} name="save" color={colors.white} />
        </Button>
      </Image>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <AnimatedFlatList
          scrollEventThrottle={16}
          bounces={true}
          data={savedCounts}
          renderItem={({item, index}) => (
            <SavedItemCard {...{index, item, y}} />
          )}
          keyExtractor={(item): any => item.id}
          {...{onScroll}}
        />
      )}
    </Block>
  );
};

export default SavedCounts;
