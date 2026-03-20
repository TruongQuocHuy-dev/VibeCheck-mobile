export interface VibeTag {
  id?: string;
  _id?: string;
  label: string;
  emoji: string;
  colorType: 'cyan' | 'pink';
}

export interface VibePickerScreenProps {
  onComplete: () => void;
  onBack: () => void;
}
