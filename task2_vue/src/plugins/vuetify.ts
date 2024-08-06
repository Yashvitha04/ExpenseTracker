// src/plugins/vuetify.ts

import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3498db',
          secondary: '#2980b9',
          background: '#f5f5f5',
          surface: '#ffffff',
          error: '#e74c3c',
          text: '#333',
        },
      },
    },
  },
});
