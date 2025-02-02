import { createTheme } from '../barrel/mui.barrel';

const theme = {
  get dark() {
    return createTheme({
      palette: {
        mode: 'dark',
      },
    });
  },

  get light() {
    return createTheme({
      palette: {
        mode: 'light',
      },
    });
  },
};

export default theme;
