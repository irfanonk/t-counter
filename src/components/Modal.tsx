import React from 'react';
import {StyleSheet, Modal as RNModal, ViewStyle, Platform} from 'react-native';

import {useTheme} from '../hooks/';
import {IModalProps} from '../constants/types';

import Block from './Block';
import Button from './Button';
import Image from './Image';

const Modal = ({
  id = 'Modal',
  animationType,
  children,
  style,
  onRequestClose,
  ...props
}: IModalProps) => {
  const {assets, colors, sizes} = useTheme();
  const modalStyles = StyleSheet.flatten([style, {}]) as ViewStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const modalID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  return (
    <RNModal
      {...modalID}
      {...props}
      transparent
      style={modalStyles}
      animationType={animationType}
      onRequestClose={onRequestClose}>
      <Block justify="center">
        <Block scroll card flex={0}>
          <Button
            top={0}
            right={0}
            position="absolute"
            onPress={() => onRequestClose?.()}>
            <Image source={assets.close} color={colors.black} />
          </Button>
          <Block
            flex={0}
            marginTop={sizes.xxl}
            paddingHorizontal={sizes.padding}>
            {children}
          </Block>
        </Block>
      </Block>
    </RNModal>
  );
};

export default React.memo(Modal);
