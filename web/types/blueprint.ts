export type AppBlueprint = {
  app_name: string;
  platform: 'web';
  framework: 'react';
  screens: string[];
  features: string[];
  auth: boolean;
  ui_style: string;
};
