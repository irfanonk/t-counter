import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveValueForAsync(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`can't save the value`, error);
  }
}

export async function getValueFromAsync(key: string) {
  try {
    const result = await AsyncStorage.getItem(key);

    return result;
  } catch (error) {
    console.warn(`can't get the value`, error);
  }
}

export async function deleteValueFromAsync(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`can't delete the key`, error);
  }
}
export const clearStorageAsync = async () => {
  try {
    await AsyncStorage.clear();
    alert('Storage successfully cleared!');
  } catch (e) {
    alert('Failed to clear the async storage.');
  }
};

export async function lookAtStorageAsync() {
  AsyncStorage.getAllKeys((_, keys) => {
    AsyncStorage.multiGet(keys, (_, stores) => {
      stores?.map((_, i, store) => {
        console.log({[store[i][0]]: store[i][1]});
        return true;
      });
    });
  });
}
