import {Platform} from 'react-native';

/**
 * Host resolution:
 * - Android emulator: 10.0.2.2 → PC ka localhost
 * - iOS simulator:   localhost  → PC ka localhost
 * - Real device:     apne PC ka LAN IP (jaise 192.168.1.5) daalo
 */

// Real Android/iOS phone pe test karna ho to upar wali line ki jagah ye use karo:
// const HOST = 'http://192.168.1.5:5050';   // ← apna PC ka LAN IP

export const CONFIG = {
  APP_NAME: 'UTSAVX',
  TAGLINE: 'Har Pal, Ek Naya Utsav',
  SUBTITLE: 'Events • Entertainment • Experiences',
  LOCATION: 'Navalgadh | Rajasthan',
  INSTAGRAM: '@utsavx.events',
  API_BASE_URL: `http://10.0.2.2:5050/api/v1`, // Android emulator ke liye
  API_TIMEOUT: 15000,
  ENV: 'development',
};

export default CONFIG;