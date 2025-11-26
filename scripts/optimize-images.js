
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '../assets/images');

function processDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${directory}`, err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(directory, file.name);

      if (file.isDirectory()) {
        processDirectory(filePath);
      } else {
        const fileExt = path.extname(file.name).toLowerCase();

        if (fileExt === '.jpg' || fileExt === '.png') {
          // Convert to WebP
          sharp(filePath)
            .toFormat('webp')
            .toFile(path.join(directory, `${path.basename(file.name, fileExt)}.webp`), (err, info) => {
              if (err) {
                console.error(`Error converting ${file.name} to WebP:`, err);
              } else {
                console.log(`Successfully converted ${file.name} to WebP.`, info);
              }
            });
        }
      }
    });
  });
}

processDirectory(imageDir);
