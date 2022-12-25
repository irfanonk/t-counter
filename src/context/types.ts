export interface Settings {
    warnVibrate: boolean | undefined;
    counterVibrate: boolean | undefined;
    hideCounterBtn: boolean | undefined;
    stopWatch: boolean | undefined;
}

export type DataContextType = {
    settings: Settings;
    saveSetting: (type: string) => void;
};