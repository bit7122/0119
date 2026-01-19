
import React from 'react';
import { Category, Unit } from './types';

export const CATEGORIES_CONFIG: Record<Category, { icon: React.ReactNode, units: Unit[] }> = {
  [Category.LENGTH]: {
    icon: <i className="fas fa-ruler-horizontal"></i>,
    units: [
      { label: 'Meter (m)', value: 'm', ratio: 1 },
      { label: 'Kilometer (km)', value: 'km', ratio: 1000 },
      { label: 'Centimeter (cm)', value: 'cm', ratio: 0.01 },
      { label: 'Millimeter (mm)', value: 'mm', ratio: 0.001 },
      { label: 'Mile (mi)', value: 'mi', ratio: 1609.34 },
      { label: 'Yard (yd)', value: 'yd', ratio: 0.9144 },
      { label: 'Foot (ft)', value: 'ft', ratio: 0.3048 },
      { label: 'Inch (in)', value: 'in', ratio: 0.0254 }
    ]
  },
  [Category.WEIGHT]: {
    icon: <i className="fas fa-weight-hanging"></i>,
    units: [
      { label: 'Kilogram (kg)', value: 'kg', ratio: 1 },
      { label: 'Gram (g)', value: 'g', ratio: 0.001 },
      { label: 'Milligram (mg)', value: 'mg', ratio: 0.000001 },
      { label: 'Pound (lb)', value: 'lb', ratio: 0.453592 },
      { label: 'Ounce (oz)', value: 'oz', ratio: 0.0283495 }
    ]
  },
  [Category.TEMPERATURE]: {
    icon: <i className="fas fa-thermometer-half"></i>,
    units: [
      { label: 'Celsius (°C)', value: 'C' },
      { label: 'Fahrenheit (°F)', value: 'F' },
      { label: 'Kelvin (K)', value: 'K' }
    ]
  },
  [Category.AREA]: {
    icon: <i className="fas fa-vector-square"></i>,
    units: [
      { label: 'Square Meter (m²)', value: 'm2', ratio: 1 },
      { label: 'Square Kilometer (km²)', value: 'km2', ratio: 1000000 },
      { label: 'Acre (ac)', value: 'ac', ratio: 4046.86 },
      { label: 'Hectare (ha)', value: 'ha', ratio: 10000 },
      { label: 'Square Foot (ft²)', value: 'ft2', ratio: 0.092903 }
    ]
  },
  [Category.VOLUME]: {
    icon: <i className="fas fa-faucet-drip"></i>,
    units: [
      { label: 'Liter (L)', value: 'L', ratio: 1 },
      { label: 'Milliliter (mL)', value: 'ml', ratio: 0.001 },
      { label: 'Gallon (gal)', value: 'gal', ratio: 3.78541 },
      { label: 'Cup (cup)', value: 'cup', ratio: 0.236588 },
      { label: 'Cubic Meter (m³)', value: 'm3', ratio: 1000 }
    ]
  },
  [Category.SPEED]: {
    icon: <i className="fas fa-tachometer-alt"></i>,
    units: [
      { label: 'Meter/second (m/s)', value: 'ms', ratio: 1 },
      { label: 'Km/hour (km/h)', value: 'kmh', ratio: 0.277778 },
      { label: 'Miles/hour (mph)', value: 'mph', ratio: 0.44704 },
      { label: 'Knot (kn)', value: 'kn', ratio: 0.514444 }
    ]
  },
  [Category.DATA]: {
    icon: <i className="fas fa-database"></i>,
    units: [
      { label: 'Byte (B)', value: 'B', ratio: 1 },
      { label: 'Kilobyte (KB)', value: 'KB', ratio: 1024 },
      { label: 'Megabyte (MB)', value: 'MB', ratio: 1024 * 1024 },
      { label: 'Gigabyte (GB)', value: 'GB', ratio: 1024 * 1024 * 1024 },
      { label: 'Terabyte (TB)', value: 'TB', ratio: 1024 * 1024 * 1024 * 1024 }
    ]
  }
};
