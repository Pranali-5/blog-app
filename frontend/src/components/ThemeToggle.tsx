import React from 'react';
import { Button, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

const ThemeToggle = () => {
  const { setColorScheme, clearColorScheme, colorScheme } = useMantineColorScheme();
  const toggleTheme = () => {
    if (colorScheme === 'dark') {
      setColorScheme('light');
    } else {
      clearColorScheme();
    }
  }
  return (
    <Button onClick={toggleTheme} variant="outline" ml={8}>
      {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
    </Button>
  );
};

export default ThemeToggle; 