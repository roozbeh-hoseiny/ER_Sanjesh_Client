import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Reusable exported accent color constant
export const MY_ACCENT_COLOR = '#aaa';

const MyPreset = definePreset(Aura, {
  components: {
    drawer: {
      header: {
        padding: '1rem 1rem 0.875rem',
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: '500',
      },
      footer: {
        padding: '0.875rem 1rem 1rem',
      },
    },
    message: {
      text: {
        fontSize: '0.875rem',
      },
    },
  },
  semantic: {
    primary: palette('{blue}'),
  },
});

export default MyPreset;
