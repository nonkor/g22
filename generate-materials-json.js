// generate-materials-json.js
// Usage: node generate-materials-json.js
// This script scans subject folders and outputs materials.json for your static site.

const fs = require('fs');
const path = require('path');

const SUBJECTS = [
  'geo10', 'inf5', 'inf6', 'inf7', 'inf8', 'inf9', 'inf10'
];

const DOC_EXTENSIONS = [
  'html', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'zip', 'rar'
];

function isDocument(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return DOC_EXTENSIONS.includes(ext);
}

function scanSubject(subjectDir) {
  const absSubjectDir = path.join(__dirname, subjectDir);
  if (!fs.existsSync(absSubjectDir)) return {};
  const result = {};
  fs.readdirSync(absSubjectDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const folder = dirent.name;
      const absFolder = path.join(absSubjectDir, folder);
      const files = fs.readdirSync(absFolder)
        .filter(f => isDocument(f));
      if (files.length > 0) {
        result[folder] = files;
      }
    });
  return result;
}

const materials = {};
for (const subject of SUBJECTS) {
  materials[subject] = scanSubject(subject);
}

fs.writeFileSync(
  path.join(__dirname, 'materials.json'),
  JSON.stringify(materials, null, 2),
  'utf-8'
);

console.log('materials.json generated!');
