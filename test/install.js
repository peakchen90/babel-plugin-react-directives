const { join } = require('path');
const { exec } = require('child_process');

function install(pathname) {
  return new Promise((resolve, reject) => {
    const cwd = join(__dirname, pathname);
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
  install('unit/babel6'),
  install('unit/babel7')
]).then(() => {
  console.log('Babel installed successfully');
}).catch((err) => {
  console.error(err);
});
