import React, {useState, useEffect} from 'react';
import {Settings, DataContextType} from './types';
import {
  clearStorageAsync,
  getValueFromAsync,
  saveValueForAsync,
} from '../utils/storageFunctions';

export const DataContext = React.createContext<DataContextType | null>(null);

const DEFAULTSETTINGS = {
  warnVibrate: true,
  counterVibrate: true,
  hideCounterBtn: false,
  stopWatch: false,
};
const DataProvider: React.FC<React.ReactNode> = ({children}) => {
  const [settings, setSettings] = useState<Settings>({
    warnVibrate: undefined,
    counterVibrate: undefined,
    hideCounterBtn: undefined,
    stopWatch: undefined,
  });

  useEffect(() => {
    (async () => {
      // await clearStorageAsync();
      const _settings = (await getValueFromAsync('settings')) || null;
      //   console.log('settings _ctx', _settings);
      if (!_settings) {
        try {
          await saveValueForAsync('settings', JSON.stringify(DEFAULTSETTINGS));
          setSettings(DEFAULTSETTINGS);
        } catch (error) {
          console.log('error', error);
          alert('hata oluştu');
        }
      } else {
        //if current saved settings do not have newly added properties
        // merge it with new settings without overriding old keys.
        const mergedSettings = Object.assign({}, _settings, DEFAULTSETTINGS);
        setSettings(JSON.parse(mergedSettings));
      }
    })();
  }, []);

  const saveSetting = async (type: string) => {
    const newSettings = {
      ...settings,
      [type]: !settings[type as keyof Settings],
    };
    setSettings(newSettings);
    try {
      await saveValueForAsync('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.log('error', error);
      alert('hata oluştu');
    }
  };

  return (
    <DataContext.Provider value={{settings, saveSetting}}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
