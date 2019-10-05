const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

process.env.JEST_TEST_ENV = true;

configure({
  adapter: new Adapter()
});
