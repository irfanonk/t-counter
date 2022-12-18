import React, {useCallback, useContext, useEffect, useState} from 'react';
import Storage from '@react-native-async-storage/async-storage';

import {
  IArticle,
  ICategory,
  IProduct,
  IUser,
  IUseData,
  ITheme,
} from '../constants/types';

import {light, dark, warm, nature, original} from '../constants';
import {getValueFromAsync, saveValueForAsync} from '../utils/storageFunctions';

export const DataContext = React.createContext({});

export const DataProvider = ({children}: {children: React.ReactNode}) => {
  const [themeType, setThemeType] = useState('light');
  const [theme, setTheme] = useState<ITheme>(light);

  // get isDark mode from storage
  // const getIsDark = useCallback(async () => {
  //   // get preferance gtom storage
  //   const isDarkJSON = await Storage.getItem('isDark');

  //   if (isDarkJSON !== null) {
  //     // set isDark / compare if has updated
  //     setIsDark(JSON.parse(isDarkJSON));
  //   }
  // }, [setIsDark]);

  const getTheme = useCallback(async () => {
    // get preferance gtom storage
    const _themeType = await getValueFromAsync('themeType');

    if (_themeType !== null) {
      // set isDark / compare if has updated
      setThemeType(JSON.parse(_themeType));
    }
  }, [setThemeType]);

  const handleThemeChange = useCallback(
    (payload: string) => {
      // set isDark / compare if has updated
      setThemeType(payload);
      // save preferance to storage
      saveValueForAsync('themeType', JSON.stringify(payload));
      // Storage.setItem('isDark', JSON.stringify(payload));
    },
    [setThemeType],
  );
  // handle isDark mode
  // const handleIsDark = useCallback(
  //   (payload: boolean) => {
  //     // set isDark / compare if has updated
  //     setIsDark(payload);
  //     // save preferance to storage
  //     Storage.setItem('isDark', JSON.stringify(payload));
  //   },
  //   [setIsDark],
  // );

  // get initial data for: isDark & language
  useEffect(() => {
    getTheme();
  }, [getTheme]);

  // change theme based on isDark updates
  useEffect(() => {
    const _theme =
      themeType === 'light'
        ? light
        : themeType === 'dark'
        ? dark
        : themeType === 'warm'
        ? warm
        : themeType === 'nature'
        ? nature
        : themeType === 'original'
        ? original
        : light;
    setTheme(_theme);
  }, [themeType]);

  const contextValue = {
    handleThemeChange,
    themeType,
    theme,
    setTheme,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
