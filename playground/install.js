const { join } = require('path');
const { exec } = require('child_process');

function install() {
  return new Promise((resolve, reject) => {
    const cwd = join(__dirname);
    exec('npm install', { cwd }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

Promise.all([
  install()
]).then(() => {
  console.log('Dependencies installed successfully');
}).catch((err) => {
  console.error(err);
});
