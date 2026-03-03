const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readPackageJson() {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(packageJsonRaw);
}

function readProjectFile(relativePath) {
  const filePath = path.resolve(__dirname, '..', relativePath);
  return fs.readFileSync(filePath, 'utf8');
}

test('build script is defined', () => {
  const packageJson = readPackageJson();
  assert.equal(packageJson.scripts.build, 'node build/build.js');
});

test('sass is used instead of node-sass', () => {
  const packageJson = readPackageJson();
  assert.ok(packageJson.devDependencies.sass);
  assert.equal(packageJson.devDependencies['node-sass'], undefined);
});

test('index template does not contain hardcoded built bundles', () => {
  const template = readProjectFile('index.html');
  assert.equal(template.includes('/static/js/'), false);
  assert.equal(template.includes('/static/css/'), false);
});

test('production build cleans dist root to avoid mixed outputs', () => {
  const buildScript = readProjectFile(path.join('build', 'build.js'));
  assert.equal(buildScript.includes('rm(config.build.assetsRoot'), true);
});

test('static directory does not keep generated bundle folders', () => {
  const staticPath = path.resolve(__dirname, '..', 'static');
  const generatedDirs = ['css', 'js', 'fonts'];
  generatedDirs.forEach((dirName) => {
    const dirPath = path.join(staticPath, dirName);
    assert.equal(fs.existsSync(dirPath), false);
  });
});
