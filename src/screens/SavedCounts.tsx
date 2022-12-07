import React, {useState, useEffect} from 'react';
import {Animated, FlatList, ActivityIndicator} from 'react-native';
import {Block, Image, Button} from '../components';

import SavedItemCard from './components/SavedCountCard';
import {Ionicons} from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import {getValueFromAsync} from '../utils/storageFunctions';

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
          keyExtractor={({index}): number => index}
          {...{onScroll}}
        />
      )}
    </Block>
  );
};

export default SavedCounts;
