export type BinType = 'recyclable' | 'organic' | 'non-recyclable' | 'special';

export function getBinColor(bin: BinType): string {
  switch (bin) {
    case 'recyclable':
      return '#3B82F6';
    case 'organic':
      return '#20C878';
    case 'non-recyclable':
      return '#EF4444';
    case 'special':
      return '#F59E0B';
  }
}

export function getBinLabel(bin: BinType): string {
  switch (bin) {
    case 'recyclable':
      return 'RECYCLABLE';
    case 'organic':
      return 'ORGANIC';
    case 'non-recyclable':
      return 'NON-RECYCLABLE';
    case 'special':
      return 'SPECIAL DISPOSAL';
  }
}

export function getBinDescription(bin: BinType): string {
  switch (bin) {
    case 'recyclable':
      return 'Plastic, paper, metal, glass';
    case 'organic':
      return 'Food & biodegradable waste';
    case 'non-recyclable':
      return 'Waste that cannot be recycled';
    case 'special':
      return 'Hazardous / e-waste collection';
  }
}

export function getBinIcon(bin: BinType): string {
  switch (bin) {
    case 'recyclable':
      return '♻️';
    case 'organic':
      return '🌱';
    case 'non-recyclable':
      return '🗑️';
    case 'special':
      return '⚠️';
  }
}