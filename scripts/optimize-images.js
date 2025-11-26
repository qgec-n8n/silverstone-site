
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '../assets/images');

const optimizeImages = async (dir) => {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.lstat(filePath);

    if (stat.isDirectory()) {
      await optimizeImages(filePath);
    } else if (/\.(jpe?g|png)$/i.test(filePath)) {
      const { name, ext } = path.parse(filePath);
      const webpPath = path.join(dir, `${name}.webp`);

      // Convert to WebP
      await sharp(filePath).webp({ quality: 80 }).toFile(webpPath);

      // Compress original image
      const buffer = await sharp(filePath).toBuffer();
      await sharp(buffer)
        .jpeg({ quality: 80, progressive: true, force: false })
        .png({ quality: 80, force: false })
        .toFile(filePath);
    }
  }
};

optimizeImages(imageDir)
  .then(() => console.log('Image optimization complete.'))
  .catch((err) => console.error('Error optimizing images:', err));
