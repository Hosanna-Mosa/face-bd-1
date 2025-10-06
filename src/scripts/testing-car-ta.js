const { translateText } = require("../services/translation");

(async () => {
  const text = await translateText('Hello world', 'fr');
  console.log('Translated:', text);
})();
