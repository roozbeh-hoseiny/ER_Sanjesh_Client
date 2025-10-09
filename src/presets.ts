import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Reusable exported accent color constant
export const MY_ACCENT_COLOR = '#aaa';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: palette('{blue}'),
  },
});

export default MyPreset;
