export interface SensorConfig {
  id: string;
  displayName: string;
  csvFile: string;
  description: string;
  color: string;
  mainParameter: string;
  mainUnit: string;
  parameters: ParameterConfig[];
}

export interface ParameterConfig {
  key: string;
  label: string;
  unit: string;
  category: string;
  iconType: string;
}

export const SENSORS: SensorConfig[] = [
  {
    id: "aqt560",
    displayName: "AQT560 Air Quality",
    csvFile: "AQT560_DATA.CSV",
    description: "Vaisala AQT560 Air Quality Transmitter measuring gases and particulates",
    color: "#0ea5e9",
    mainParameter: "Air Temperature  (\u00b0C)",
    mainUnit: "\u00b0C",
    parameters: [
      { key: "Air Temperature  (\u00b0C)", label: "Air Temperature", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
      { key: "Air Humidity  ()", label: "Air Humidity", unit: "%", category: "meteorological", iconType: "droplets" },
      { key: "Air Pressure  (hPa)", label: "Air Pressure", unit: "hPa", category: "meteorological", iconType: "gauge" },
      { key: "NO2  (\u00b5g/m\u00b3)", label: "NO\u2082", unit: "\u00b5g/m\u00b3", category: "gas", iconType: "wind" },
      { key: "NO2  (ppb)", label: "NO\u2082", unit: "ppb", category: "gas", iconType: "wind" },
      { key: "SO2  (\u00b5g/m\u00b3)", label: "SO\u2082", unit: "\u00b5g/m\u00b3", category: "gas", iconType: "wind" },
      { key: "SO2  (ppb)", label: "SO\u2082", unit: "ppb", category: "gas", iconType: "wind" },
      { key: "CO  (\u00b5g/m\u00b3)", label: "CO", unit: "\u00b5g/m\u00b3", category: "gas", iconType: "wind" },
      { key: "CO  (ppb)", label: "CO", unit: "ppb", category: "gas", iconType: "wind" },
      { key: "H2S  (\u00b5g/m\u00b3)", label: "H\u2082S", unit: "\u00b5g/m\u00b3", category: "gas", iconType: "wind" },
      { key: "H2S  (ppb)", label: "H\u2082S", unit: "ppb", category: "gas", iconType: "wind" },
      { key: "O3  (\u00b5g/m\u00b3)", label: "O\u2083", unit: "\u00b5g/m\u00b3", category: "gas", iconType: "wind" },
      { key: "O3  (ppb)", label: "O\u2083", unit: "ppb", category: "gas", iconType: "wind" },
      { key: "NO  (\u00b5g/m\u00b3)", label: "NO", unit: "\u00b5g/m\u00b3", category: "gas", iconType: "wind" },
      { key: "NO  (ppb)", label: "NO", unit: "ppb", category: "gas", iconType: "wind" },
      { key: "PM1 1H  (\u00b5g/m\u00b3)", label: "PM1 (1H avg)", unit: "\u00b5g/m\u00b3", category: "particulates", iconType: "cloud" },
      { key: "PM2.5 1H  (\u00b5g/m\u00b3)", label: "PM2.5 (1H avg)", unit: "\u00b5g/m\u00b3", category: "particulates", iconType: "cloud" },
      { key: "PM10 1H  (\u00b5g/m\u00b3)", label: "PM10 (1H avg)", unit: "\u00b5g/m\u00b3", category: "particulates", iconType: "cloud" },
      { key: "PM1 1min  (\u00b5g/m\u00b3)", label: "PM1 (1min avg)", unit: "\u00b5g/m\u00b3", category: "particulates", iconType: "cloud" },
      { key: "PM2.5 1min  (\u00b5g/m\u00b3)", label: "PM2.5 (1min avg)", unit: "\u00b5g/m\u00b3", category: "particulates", iconType: "cloud" },
      { key: "PM10 1min  (\u00b5g/m\u00b3)", label: "PM10 (1min avg)", unit: "\u00b5g/m\u00b3", category: "particulates", iconType: "cloud" },
    ],
  },
  {
    id: "ws500",
    displayName: "WS500 Smart Weather",
    csvFile: "WS500_DATA.CSV",
    description: "Vaisala WS500 Smart Weather Sensor measuring wind, rain, pressure, and temperature",
    color: "#10b981",
    mainParameter: "Air Tempreture  (\u00b0C)",
    mainUnit: "\u00b0C",
    parameters: [
      { key: "Relative Humidity  ()", label: "Relative Humidity", unit: "%", category: "meteorological", iconType: "droplets" },
      { key: "Air Pressusre  (hPa)", label: "Air Pressure", unit: "hPa", category: "meteorological", iconType: "gauge" },
      { key: "Wind Dir(min)  (degree)", label: "Wind Dir (min)", unit: "\u00b0", category: "wind", iconType: "compass" },
      { key: "Wind Dir(max)  (degree)", label: "Wind Dir (max)", unit: "\u00b0", category: "wind", iconType: "compass" },
      { key: "Compass  (degree)", label: "Compass", unit: "\u00b0", category: "wind", iconType: "compass" },
      { key: "Precipitation Type  (code)", label: "Precipitation Type", unit: "code", category: "precipitation", iconType: "cloud-rain" },
      { key: "Wind Measurement Quality (code)", label: "Wind Quality", unit: "code", category: "wind", iconType: "activity" },
      { key: "Global Radiation  (W/m\u00b2)", label: "Global Radiation", unit: "W/m\u00b2", category: "radiation", iconType: "sun" },
      { key: "Air Tempreture  (\u00b0C)", label: "Air Temperature", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
      { key: "Wind Chill Temperature  (\u00b0C)", label: "Wind Chill Temp", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
      { key: "Heating temperature Wind (\u00b0C)", label: "Heating Temp Wind", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
      { key: "Heating temperature R2S  (\u00b0C)", label: "Heating Temp R2S", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
      { key: "Wind Speed(min)  (m/s)", label: "Wind Speed (min)", unit: "m/s", category: "wind", iconType: "wind" },
      { key: "Wind Speed(max)  (m/s)", label: "Wind Speed (max)", unit: "m/s", category: "wind", iconType: "wind" },
      { key: "Wind Speed(avg)  (m/s)", label: "Wind Speed (avg)", unit: "m/s", category: "wind", iconType: "wind" },
      { key: "Precipitation Absolute  (mm)", label: "Precipitation (abs)", unit: "mm", category: "precipitation", iconType: "cloud-rain" },
      { key: "Precipitation Difference (mm)", label: "Precipitation (diff)", unit: "mm", category: "precipitation", iconType: "cloud-rain" },
      { key: "Precipitation Intensity  (mm/h)", label: "Precipitation Intensity", unit: "mm/h", category: "precipitation", iconType: "cloud-rain" },
      { key: "Absolute Humidity  (g/m\u00b3)", label: "Absolute Humidity", unit: "g/m\u00b3", category: "meteorological", iconType: "droplets" },
      { key: "Mixing Ratio  (g/kg)", label: "Mixing Ratio", unit: "g/kg", category: "meteorological", iconType: "droplets" },
      { key: "Absolute Air_Pressure  (hPa)", label: "Absolute Air Pressure", unit: "hPa", category: "meteorological", iconType: "gauge" },
      { key: "Wind Speed(avg)  (km/h)", label: "Wind Speed (km/h)", unit: "km/h", category: "wind", iconType: "wind" },
      { key: "Wind Speed(min) (knots)", label: "Wind Speed min (knots)", unit: "knots", category: "wind", iconType: "wind" },
      { key: "Wind Speed(max)  (knots)", label: "Wind Speed max (knots)", unit: "knots", category: "wind", iconType: "wind" },
      { key: "Wind Speed(avg)  (knots)", label: "Wind Speed avg (knots)", unit: "knots", category: "wind", iconType: "wind" },
      { key: "Specific Enthalpy  ( kJ/kg)", label: "Specific Enthalpy", unit: "kJ/kg", category: "meteorological", iconType: "activity" },
      { key: "Air Density  (kg/m\u00b3)", label: "Air Density", unit: "kg/m\u00b3", category: "meteorological", iconType: "activity" },
    ],
  },
  {
    id: "smp10",
    displayName: "SMP10 Pyranometer",
    csvFile: "SMP10_DATA.CSV",
    description: "Hukseflux SMP10 Smart Pyranometer measuring solar irradiance and body temperature",
    color: "#f59e0b",
    mainParameter: "SMP Broad Irradiance  (W/m\u00b2)",
    mainUnit: "W/m\u00b2",
    parameters: [
      { key: "IO SCALE FACTOR", label: "IO Scale Factor", unit: "", category: "system", iconType: "settings" },
      { key: "SMP Broad Irradiance  (W/m\u00b2)", label: "Broad Irradiance", unit: "W/m\u00b2", category: "radiation", iconType: "sun" },
      { key: "SMP Raw Irradiance  (W/m\u00b2)", label: "Raw Irradiance", unit: "W/m\u00b2", category: "radiation", iconType: "sun" },
      { key: "Body Temperature  (\u00b0C)", label: "Body Temperature", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
      { key: "IO Operation Mode ", label: "IO Operation Mode", unit: "", category: "system", iconType: "settings" },
      { key: "IO STATUS FLAG ", label: "IO Status Flag", unit: "", category: "system", iconType: "activity" },
    ],
  },
  {
    id: "dr30",
    displayName: "DR30 Pyrheliometer",
    csvFile: "DR30_DATA.CSV",
    description: "Hukseflux DR30 Smart Pyrheliometer measuring direct solar and body temperature",
    color: "#8b5cf6",
    mainParameter: "Direct Solar Irradiance  (W/m\u00b2)",
    mainUnit: "W/m\u00b2",
    parameters: [
      { key: "Direct Solar Irradiance  (W/m\u00b2)", label: "Direct Solar Irradiance", unit: "W/m\u00b2", category: "radiation", iconType: "sun" },
      { key: "Solar Irradiance Uncompe (W/m\u00b2)", label: "Solar Irradiance (Uncompensated)", unit: "W/m\u00b2", category: "radiation", iconType: "sun" },
      { key: "Body Temperature  (\u00b0C)", label: "Body Temperature", unit: "\u00b0C", category: "meteorological", iconType: "thermometer" },
    ],
  },
];

export function getSensorById(id: string): SensorConfig | undefined {
  return SENSORS.find((s) => s.id === id);
}
