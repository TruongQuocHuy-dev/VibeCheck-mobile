/** Props cho WelcomeScreen - màn hình intro app */
export interface WelcomeScreenProps {
  /** Callback khi user login thành công */
  onLoginSuccess?: () => void;
  
  /** Test ID cho automation testing */
  testID?: string;
}

export interface WelcomeAnimationConfig {
  floatDuration: number;
  pulseScale: number;
  repeatCount: number;
}
