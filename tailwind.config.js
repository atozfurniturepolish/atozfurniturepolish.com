/** Build: npx tailwindcss@3.4.17 -i tailwind.input.css -o tailwind.css --minify */
module.exports = {
  content: ["./*.html", "./*.js", "!./tailwind.config.js"],
  theme: {
    extend: {
      colors: {
        furniture: { bg: "#F7F4EF", brown: "#76543B", dark: "#292826", text: "#706C66", light: "#EDE7DE", border: "#D8D0C5" },
      },
    },
  },
};
