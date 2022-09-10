import create from 'zustand'


interface IState {
  keywords: string;
  pois: any[];
  lng: number;
  lat: number;
  selectAddressId: number;
  setKeywords: (val: string) => void;
  setAddressId: (val: number) => void;
  setPoisList: (val: any[]) => void;
  updateCenter: (lng: number, lat: number) => void;
}
const state = {
  keywords: '新华汇',
  pois: [],
  lng: 0,
  lat: 0,
  selectAddressId: 0,
}
const useData = create<IState>()((set) => ({
  ...state,
  setKeywords: (val) => set({ keywords: val }),
  setPoisList: (val) => set({ pois: val }),
  setAddressId: (val) => set({ selectAddressId: val }),
  updateCenter: (lng, lat) => set({ lng, lat }),

}))


export default useData;
