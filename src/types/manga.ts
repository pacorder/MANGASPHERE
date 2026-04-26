export type ReadingMode = 'vertical' | 'horizontal-rtl' | 'horizontal-ltr';
export type ViewMode = 'single' | 'double';

export interface ReaderSettings {
  mode: ReadingMode;
  viewMode: ViewMode;
  zoom: number;
  showControls: boolean;
  fitMode: 'width' | 'height' | 'contain';
}
