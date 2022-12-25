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
    warnVibrate: false,
    counterVibrate: false,
    hideCounterBtn: false,
    stopWatch: false,
  });

  useEffect(() => {
    (async () => {
      // await clearStorageAsync();
      const _settings = (await getValueFromAsync('settings')) || null;
      //   console.log('settings _ctx', _settings);
      if (_settings) {
        setSettings({
          ...settings,
          ...JSON.parse(_settings),
        });
        // try {
        //   await saveValueForAsync('settings', JSON.stringify(_settings));
        // } catch (error) {
        //   console.log('error', error);
        //   alert('hata oluştu');
        // }
      }
      // setSettings(JSON.parse(_settings));
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
