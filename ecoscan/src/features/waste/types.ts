export type BinType = 'recyclable' | 'organic' | 'non-recyclable' | 'special';

export interface WasteResult {
  itemName: string;
  category: 'Plastic' | 'Organic' | 'E-Waste' | 'Paper' | 'Metal' | 'Glass' | 'Other';
  bin: BinType;
  tip: string;
}

export interface DemoItem {
  id: string;
  name: string;
  icon: string;
}