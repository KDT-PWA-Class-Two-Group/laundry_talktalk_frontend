export interface Store {
  id: string;
  name: string;
  address?: string;
}

export interface StoreSelectProps {
  value: string; // storeId
  stores: Store[];
  onChange: (id: string) => void;
}
