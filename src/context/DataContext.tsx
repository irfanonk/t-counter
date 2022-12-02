import React, {useState, useEffect} from 'react';
import {Settings, DataContextType} from './types';
import {getValueFromAsync, saveValueForAsync} from '../utils/storageFunctions';

export const DataContext = React.createContext<DataContextType | null>(null);

const DataProvider: React.FC<React.ReactNode> = ({children}) => {
  const [settings, setSettings] = useState<Settings>({
    warnVibrate: undefined,
    counterVibrate: undefined,
  });

  useEffect(() => {
    (async () => {
      // await clearStorageAsync();
      const _settings = (await getValueFromAsync('settings')) || null;
      //   console.log('settings _ctx', _settings);

      if (!_settings) {
        const defaultSettings = {
          warnVibrate: true,
          counterVibrate: true,
        };
        try {
          await saveValueForAsync('settings', JSON.stringify(defaultSettings));
          setSettings(defaultSettings);
        } catch (error) {
          console.log('error', error);
          alert('hata oluştu');
        }
        return;
      }

      setSettings(JSON.parse(_settings));
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
