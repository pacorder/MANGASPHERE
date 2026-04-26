export type ReadingMode = 'vertical' | 'horizontal-rtl' | 'horizontal-ltr';

export interface ReaderSettings {
  mode: ReadingMode;
  zoom: number;
  showControls: boolean;
  fitMode: 'width' | 'height' | 'contain';
}
