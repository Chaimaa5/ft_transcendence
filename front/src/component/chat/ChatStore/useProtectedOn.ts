import { create } from "zustand"

interface ProtOn
{
    protectedOn: boolean,
    setProtectedOn: (state: boolean) => void
}

const useProtectedOn = create<ProtOn>(set => ({
    protectedOn: false,
    setProtectedOn: (state) => set(()=>({protectedOn: state}))
}))

export default useProtectedOn;