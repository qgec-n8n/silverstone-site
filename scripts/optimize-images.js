const sharp = require('sharp');
const { glob } = require('glob');
const fs = require('fs-extra');
const path = require('path');

const imagePath = './assets/images';
const outputPath = './assets/images';

async function optimizeImages() {
  try {
    // Ensure the output directory exists
    await fs.ensureDir(outputPath);

    // Find all JPG and PNG images in the directory
    const files = await glob(`${imagePath}/**/*.{jpg,png}`);

    for (const file of files) {
      const outputWebPPath = path.join(outputPath, path.relative(imagePath, file.replace(/\.(jpg|png)$/, '.webp')));

      // Create the subdirectory if it doesn't exist
      await fs.ensureDir(path.dirname(outputWebPPath));

      // Convert to WebP
      sharp(file)
        .webp({ quality: 80 })
        .toFile(outputWebPPath, (err, info) => {
          if (err) {
            console.error(`Error converting ${file} to WebP:`, err);
          } else {
            console.log(`Successfully converted ${file} to WebP`);
          }
        });

      // Compress the original image
      sharp(file)
        .jpeg({ quality: 80, progressive: true })
        .png({ quality: 80 })
        .toBuffer((err, buffer) => {
          if (err) {
            console.error(`Error compressing ${file}:`, err);
          } else {
            fs.writeFileSync(file, buffer);
            console.log(`Successfully compressed ${file}`);
          }
        });
    }
  } catch (err) {
    console.error('An error occurred during image optimization:', err);
  }
}

optimizeImages();
