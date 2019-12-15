const { spawn } = require('child_process');
const { join } = require('path');

const __isDEV__ = process.argv[2] === '--dev';

function build(command) {
  return new Promise((resolve) => {
    const cwd = join(__dirname);
    const cmds = command.split(' ');
    const cp = spawn(cmds.shift(), cmds, { cwd });
    cp.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    cp.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    cp.on('close', (code) => {
      console.log(`Process finished with exit code ${code}`);
      resolve();
    });
  });
}

if (__isDEV__) {
  process.env.NODE_ENV = 'development';
  build('npm run dev');
} else {
  process.env.NODE_ENV = 'production';
  build('npm run build');
}
