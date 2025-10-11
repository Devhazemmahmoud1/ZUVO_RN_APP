import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
import {
  useAddresses as useAddressesQuery,            // your query hook (returns Address[])
  useConfirmDefaultAddress,
  useAddAddress,
  useEditAddress,
  useDeleteAddress,
} from './apis/addressApi'; // <-- adjust path
import { getCurrentPosition } from './ultis/getCurrentLocation';
import { getPlaceName } from './ultis/getPlaceName';
  
  // ---------------- Types ----------------
  export type Address = {
    id?: string;                // optional in case your API omits it
    label?: string;
    address?: string;           // single-line address (if used)
    city?: string;
    country?: string;
    location?: any;
    lat?: number;
    lng?: number;
    line1?: string;             // multi-line, if used
    isPrimary?: boolean;        // <-- default marker from backend
  };
  
  // Sentinel for "current location" selection
  type CurrentLocationSentinel = { id: 'current_location' };
  
  // The active selection can be a full Address object or the sentinel.
  type ActiveSelection = Address | CurrentLocationSentinel | null;
  
  type Ctx = {
    // server data
    addresses: Address[];
    defaultAddress: Address | null;
    isLoading: boolean;
    isError: boolean;
  
    // global client state (persisted)
    activeSelection: ActiveSelection;
    setActiveSelection: (sel: ActiveSelection) => void;
  
    // computed
    activeAddress: Address | null;
    effectiveAddress: Address | null;
  
    // current location fallback
    currentLocationAddress: Address | null;
    refreshCurrentLocation: () => Promise<void>;
  
    // mutations (re-exported)
    confirmDefaultAddress: (defaultAddress: any) => Promise<any>;
    addAddress: (vars: any) => Promise<any>;
    editAddress: (vars: any) => Promise<any>;
    deleteAddress: (vars: any) => Promise<any>;
  };
  
  const AddressContext = createContext<Ctx | null>(null);
  const ACTIVE_KEY = 'active-address-selection-v1';
  
  // ---------------- Utils ----------------
  
  // Prefer id matching; if no ids, fall back to a "canonical" key (line1|address + city + country)
  const canonicalKey = (a?: Address | null) =>
    a
      ? `${a.id ?? ''}|${a.line1 ?? a.address ?? ''}|${a.city ?? ''}|${a.country ?? ''}`.toLowerCase()
      : '';
  
  const isCurrentLocation = (x: any): x is CurrentLocationSentinel =>
    !!x && typeof x === 'object' && x.id === 'current_location';
  
  const findInList = (list: Address[], probe: Address | null): Address | null => {
    if (!probe) return null;
    if (probe.id) {
      const byId = list.find(a => a.id === probe.id);
      if (byId) return byId;
    }
    // fallback to canonical key match
    const key = canonicalKey(probe);
    return list.find(a => canonicalKey(a) === key) ?? null;
  };
  
  // ---------------- Provider ----------------
  
  export function AddressProvider({ children }: { children: React.ReactNode }) {
    // 1) Fetch addresses array from your existing query (shared cache)
    const { data, isLoading, isError } = useAddressesQuery();
  
    // Keep the array stable for deps
    const addresses = useMemo<Address[]>(
      () => (Array.isArray(data) ? data : []),
      [data]
    );
  
    // Derive default from backend flag
    const defaultAddress = useMemo<Address | null>(
      () => addresses.find(a => a.isPrimary) ?? null,
      [addresses]
    );
  
    // 2) Persisted active selection (whole object or "current_location")
    const [activeSelection, setActiveSelectionState] = useState<ActiveSelection>(null);
  
    useEffect(() => {
      (async () => {
        const saved = await AsyncStorage.getItem(ACTIVE_KEY);
        if (!saved) return;
        try {
          const parsed = JSON.parse(saved);
          // Allow either Address object or the sentinel
          if (parsed && typeof parsed === 'object') setActiveSelectionState(parsed);
        } catch {
          // ignore corrupt storage
        }
      })();
    }, []);
  
    const setActiveSelection = useCallback((sel: ActiveSelection) => {
      setActiveSelectionState(sel);
      if (sel) AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(sel));
      else AsyncStorage.removeItem(ACTIVE_KEY);
    }, []);
  
    // 3) Current location (transient)
    const [currentLocationAddress, setCurrentLocationAddress] = useState<Address | null>(null);
  
    const refreshCurrentLocation = useCallback(async () => {
      try {
        const coords = await getCurrentPosition();
        const placeName = await getPlaceName(coords.lat, coords.lng);

        const addr: Address = {
          id: undefined,
          address: placeName ?? 'Near your current location',
          city: placeName ?? undefined,
          country: undefined,
          lat: coords.lat,
          lng: coords.lng,
        };

        setCurrentLocationAddress(addr);

        if (!activeSelection && addresses.length === 0 && !defaultAddress) {
          setActiveSelection({ id: 'current_location' });
        }
      } catch (error) {
        setCurrentLocationAddress(null);
      }
    }, [activeSelection, addresses.length, defaultAddress, setActiveSelection]);
  
    // 4) Compute active & effective
    // If user selected "current location", use that; otherwise map stored object to the freshest server copy.
    const activeAddress = useMemo<Address | null>(() => {
      if (isCurrentLocation(activeSelection)) return currentLocationAddress;
      // prefer the up-to-date object from the list (ids/fields might have changed)
      return findInList(addresses, activeSelection as Address) ?? (activeSelection as Address ?? null);
    }, [activeSelection, currentLocationAddress, addresses]);
  
    const effectiveAddress = useMemo<Address | null>(() => {
      return activeAddress ?? defaultAddress ?? currentLocationAddress ?? null;
    }, [activeAddress, defaultAddress, currentLocationAddress]);
  
    // 5) Keep active selection valid after deletes
    useEffect(() => {
      if (!activeSelection || isCurrentLocation(activeSelection)) return;
  
      const existsNow = !!findInList(addresses, activeSelection as Address);
      if (existsNow) return;
  
      // choose a sensible fallback
      const fallback =
        defaultAddress ??
        addresses[0] ??
        (currentLocationAddress ? ({ id: 'current_location' } as CurrentLocationSentinel) : null);
  
      setActiveSelection(fallback as ActiveSelection);
    }, [addresses, activeSelection, defaultAddress, currentLocationAddress, setActiveSelection]);
  
    // 6) Mutations → expose as simple functions
    const confirmDefaultMutation = useConfirmDefaultAddress();
    const addMutation = useAddAddress();
    const editMutation = useEditAddress();
    const deleteMutation = useDeleteAddress();
  
    const confirmDefaultAddress = useCallback(
      (defaultAddress: any) => confirmDefaultMutation.mutateAsync({ defaultAddress }),
      [confirmDefaultMutation]
    );
    const addAddress = useCallback((vars: any) => addMutation.mutateAsync(vars), [addMutation]);
    const editAddress = useCallback((vars: any) => editMutation.mutateAsync(vars), [editMutation]);
    const deleteAddress = useCallback((vars: any) => deleteMutation.mutateAsync(vars), [deleteMutation]);
  
    // 7) Context value
    const value = useMemo<Ctx>(
      () => ({
        addresses,
        defaultAddress,
        isLoading,
        isError,
  
        activeSelection,
        setActiveSelection,
  
        activeAddress,
        effectiveAddress,
  
        currentLocationAddress,
        refreshCurrentLocation,
  
        confirmDefaultAddress,
        addAddress,
        editAddress,
        deleteAddress,
      }),
      [
        addresses,
        defaultAddress,
        isLoading,
        isError,
        activeSelection,
        setActiveSelection,
        activeAddress,
        effectiveAddress,
        currentLocationAddress,
        refreshCurrentLocation,
        confirmDefaultAddress,
        addAddress,
        editAddress,
        deleteAddress,
      ]
    );
  
    return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
  }
  
  // Consumers call this (do NOT call inside the provider)
  export const useAddressContext = () => {
    const ctx = useContext(AddressContext);
    if (!ctx) throw new Error('useAddressContext must be used within AddressProvider');
    return ctx;
  };
  
