


import create from 'zustand'

interface IState {
  addressCity: string;
  setAddressCity: (value: string) => void;
}
const state = {
  addressCity: '',
}
const useGlobalState = create<IState>()((set) => ({
  ...state,
  setAddressCity: (val) => set({ addressCity: val }),

}))


export default useGlobalState;