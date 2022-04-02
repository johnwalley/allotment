import { themes } from "@storybook/theming";
import { useDarkMode } from "storybook-dark-mode";

export const decorators = [
  (Story) => {
    if (useDarkMode()) {
      document.documentElement.style.setProperty(
        "--card-background-color",
        "rgb(30,30,30)"
      );
    } else {
      document.documentElement.style.setProperty(
        "--card-background-color",
        "rgb(255,255,255)"
      );
    }

    return <Story />;
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    stylePreview: true,
  },
  options: {
    storySort: {
      order: ["Basic", "Advanced"],
    },
  },
};
