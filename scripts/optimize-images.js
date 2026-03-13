const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOCIALMEDIA_DIR = path.join(__dirname, '../assets/images/socialmedia');
const DERIVED_DIR = path.join(SOCIALMEDIA_DIR, 'derived');

const SERVICE_BASES = [
  'General_Services_1',
  'General_Services_2A',
  'General_Services_2B',
  'General_Services_3',
  'Dentists_1',
  'Dentists_2',
  'Dentists_3',
  'eComm_1',
  'eComm_2',
  'eComm_3',
  'Real_Estate_1',
  'Real_Estate_2',
  'Real_Estate_3',
  'Online_Coach_1',
  'Online_Coach_2',
  'Online_Coach_3',
  'Gyms_1',
  'Gyms_2',
  'Gyms_3',
  'Hospitality_1',
  'Hospitality_2',
  'Hospitality_3',
  'Physio_1',
  'Physio_2',
  'Physio_3',
  'Salon_1',
  'Salon_2',
  'Salon_3',
  'Trades_1',
  'Trades_2',
  'Trades_3',
];

const GALLERY_FILES = [
  'General_Services_2B_Mobile.jpeg',
  'eComm_3_Mobile.jpeg',
  'Trades_2_Mobile.jpeg',
  'Gyms_1_Mobile.jpeg',
  'Hospitality_1_Mobile.jpeg',
  '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.webp',
  'services_consulting_mobile.jpg',
  'services_data_integration_mobile.jpg',
  'services_workflow_automation_mobile.jpg',
  '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.webp',
  '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.webp',
  '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.webp',
  '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.webp',
  '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.webp',
  '1-1_Trades_Grid.jpg',
];

const QUALITY = {
  avif: { quality: 50, effort: 4 },
  webp: { quality: 72 },
  jpg: { quality: 80, mozjpeg: true },
};

function buildTargets() {
  const targetMap = new Map();

  function addTarget(filename, widths) {
    if (!targetMap.has(filename)) {
      targetMap.set(filename, new Set());
    }
    const widthSet = targetMap.get(filename);
    widths.forEach((width) => widthSet.add(width));
  }

  SERVICE_BASES.forEach((baseName) => {
    addTarget(`${baseName}.jpeg`, [640, 960]);
    addTarget(`${baseName}_Mobile.jpeg`, [480, 768]);
  });

  GALLERY_FILES.forEach((filename) => {
    addTarget(filename, [320, 480, 640]);
  });

  return targetMap;
}

function buildOutputPath(filename, width, extension) {
  const basename = path.basename(filename, path.extname(filename));
  return path.join(DERIVED_DIR, `${basename}-${width}.${extension}`);
}

async function writeVariant(sourcePath, outputPath, width, extension) {
  const transformer = sharp(sourcePath)
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
      fit: 'inside',
    });

  if (extension === 'avif') {
    await transformer.avif(QUALITY.avif).toFile(outputPath);
    return;
  }

  if (extension === 'webp') {
    await transformer.webp(QUALITY.webp).toFile(outputPath);
    return;
  }

  await transformer.jpeg(QUALITY.jpg).toFile(outputPath);
}

async function generateDerivedAssets() {
  const targets = buildTargets();

  fs.rmSync(DERIVED_DIR, { recursive: true, force: true });
  fs.mkdirSync(DERIVED_DIR, { recursive: true });

  let generatedCount = 0;

  for (const [filename, widthSet] of targets.entries()) {
    const sourcePath = path.join(SOCIALMEDIA_DIR, filename);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Missing source image: ${sourcePath}`);
      continue;
    }

    const widths = [...widthSet].sort((a, b) => a - b);

    for (const width of widths) {
      for (const extension of ['avif', 'webp', 'jpg']) {
        const outputPath = buildOutputPath(filename, width, extension);
        await writeVariant(sourcePath, outputPath, width, extension);
        generatedCount += 1;
      }
    }
  }

  console.log(
    `Generated ${generatedCount} derived image variants in ${path.relative(process.cwd(), DERIVED_DIR)}.`,
  );
}

generateDerivedAssets().catch((error) => {
  console.error('Failed to generate derived images.', error);
  process.exitCode = 1;
});
