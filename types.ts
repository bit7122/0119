
export enum Category {
  LENGTH = 'Length',
  WEIGHT = 'Weight',
  TEMPERATURE = 'Temperature',
  AREA = 'Area',
  VOLUME = 'Volume',
  SPEED = 'Speed',
  DATA = 'Data'
}

export interface Unit {
  label: string;
  value: string;
  ratio?: number; // Ratio relative to base unit
  offset?: number; // For temperature (e.g., Celsius to Kelvin)
}

export interface ConversionState {
  category: Category;
  fromValue: string;
  fromUnit: string;
  toUnit: string;
}

export interface AIResponse {
  result: string;
  explanation: string;
  fact: string;
}
