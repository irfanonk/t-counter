import React, {useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Block, Image, Text} from '../../components';
import useTheme from '../../hooks/useTheme';
import {Ionicons} from '@expo/vector-icons';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/core';

const DEFAULT_CARD_HEIGHT = 150;
export const MARGIN = 20;
export const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const {height: wHeight} = Dimensions.get('window');
const height = wHeight - 64;
const styles = StyleSheet.create({
  card: {
    marginVertical: MARGIN,
    paddingHorizontal: MARGIN,
  },
});

interface SavedCountCardProps {
  y: Animated.Value;
  index: number;
  item: any;
  onDeletePress: (createdAt: string) => Promise<void>;
}

const SavedCountCard = ({
  y,
  item,
  index,
  onDeletePress,
}: SavedCountCardProps) => {
  const {title, count, stop, warn, createdAt} = item;
  const {gradients, colors, sizes} = useTheme();
  const navigation = useNavigation();

  const [isDeleting, setIsDeleting] = useState('');

  const position = Animated.subtract(index * CARD_HEIGHT, y);
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0;
  const isBottom = height - CARD_HEIGHT;
  const isAppearing = height;
  const translateY = Animated.add(
    Animated.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT],
        extrapolateRight: 'clamp',
      }),
    ),
    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -CARD_HEIGHT / 4],
      extrapolate: 'clamp',
    }),
  );
  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolate: 'clamp',
  });
  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
  });
  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
          transform: [{translateY}, {scale}],
        },
      ]}
      key={index}>
      <Block
        height={DEFAULT_CARD_HEIGHT}
        color={colors.secondary}
        padding={20}
        flex={0}
        overflow="hidden">
        <Block row justify="space-between">
          <Text color={colors.white} h5>
            {title}
          </Text>
          <Text color={colors.white} h5>
            {count}
          </Text>
        </Block>

        <Block>
          <Text color={colors.white}>
            {stop || 0}/{warn || 0}{' '}
          </Text>
        </Block>
        <Block>
          <Text color={colors.white}>
            {dayjs.unix(createdAt).format('DD/MM/YYYY hh:ss')}
          </Text>
        </Block>
        <Block row justify="space-between">
          {isDeleting === createdAt ? (
            <Block row>
              <TouchableOpacity onPress={() => setIsDeleting('')}>
                <Ionicons
                  size={28}
                  name="chevron-back-circle-outline"
                  color={colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDeletePress(createdAt)}>
                <Ionicons
                  size={28}
                  color={colors.danger}
                  name="checkmark-done-circle-outline"
                />
              </TouchableOpacity>
            </Block>
          ) : (
            <TouchableOpacity onPress={() => setIsDeleting(createdAt)}>
              <Ionicons size={28} name="trash" color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Counter', {
                item: item,
              })
            }>
            <Ionicons size={28} name="log-in" color={colors.text} />
          </TouchableOpacity>
        </Block>
      </Block>
    </Animated.View>
  );
};

export default SavedCountCard;
