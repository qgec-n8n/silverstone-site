const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOCIALMEDIA_DIR = path.join(__dirname, '../assets/images/socialmedia');
const BLOG_DIR = path.join(__dirname, '../assets/images/blog');
const ZIP_DIR = path.join(__dirname, '../assets/images/zip');

const SOCIAL_SERVICE_BASES = [
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

const SOCIAL_SERVICE_REFRESH_BASES = [
  'general-services-1',
  'general-services-2a',
  'general-services-2b',
  'general-services-3',
  'salon-2',
  'salon-3',
  'physio-1',
  'physio-3',
  'dentist-1',
  'dentist-2',
  'dentist-3',
  'gyms-1',
  'gyms-2',
  'gyms-3',
  'onlinecoach-1',
  'onlinecoach-2',
  'onlinecoach-3',
];

const SOCIAL_GALLERY_FILES = [
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

const INDEX_TILE_FILES = [
  'services_consulting.jpg',
  'services_consulting_mobile.jpg',
  'services_lead_followup.jpg',
  'services_lead_followup_mobile.jpg',
  'services_workflow_automation.jpg',
  'services_workflow_automation_mobile.jpg',
  'services_data_integration.jpg',
  'services_data_integration_mobile.jpg',
];

const ZIP_FILES = [
  'Silverstone_04.jpg',
  'Silverstone_06.jpg',
  'Silverstone_22.jpg',
  'Silverstone_27.jpg',
  'Silverstone_28.jpg',
];

const QUALITY = {
  avif: { quality: 50, effort: 4 },
  webp: { quality: 72 },
  jpg: { quality: 80, mozjpeg: true },
};

function discoverBlogFiles() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((filename) => /^blog_\d+\.(?:png|jpe?g)$/i.test(filename))
    .sort((left, right) =>
      left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }),
    );
}

const TARGET_GROUPS = [
  {
    sourceDir: SOCIALMEDIA_DIR,
    derivedDir: path.join(SOCIALMEDIA_DIR, 'derived'),
    items: (() => {
      const targetMap = new Map();
      const addTarget = (filename, widths) => {
        if (!targetMap.has(filename)) {
          targetMap.set(filename, new Set());
        }
        widths.forEach((width) => targetMap.get(filename).add(width));
      };

      SOCIAL_SERVICE_BASES.forEach((baseName) => {
        addTarget(`${baseName}.jpeg`, [640, 960]);
        addTarget(`${baseName}_Mobile.jpeg`, [480, 768]);
      });

      SOCIAL_SERVICE_REFRESH_BASES.forEach((baseName) => {
        addTarget(`${baseName}.png`, [640, 960]);
        addTarget(`${baseName}-mobile.png`, [480, 768]);
      });

      SOCIAL_GALLERY_FILES.forEach((filename) => addTarget(filename, [320, 480, 640]));
      INDEX_TILE_FILES.forEach((filename) =>
        addTarget(
          filename,
          /_mobile\./i.test(filename) ? [320, 480, 640] : [640, 960],
        ),
      );

      return targetMap;
    })(),
  },
  {
    sourceDir: BLOG_DIR,
    derivedDir: path.join(BLOG_DIR, 'derived'),
    items: new Map(
      discoverBlogFiles().map((filename) => [filename, new Set([320, 640, 960, 1280])]),
    ),
  },
  {
    sourceDir: ZIP_DIR,
    derivedDir: path.join(ZIP_DIR, 'derived'),
    items: new Map(ZIP_FILES.map((filename) => [filename, new Set([640, 960])])),
  },
];

function buildOutputPath(derivedDir, filename, width, extension) {
  const basename = path.basename(filename, path.extname(filename));
  return path.join(derivedDir, `${basename}-${width}.${extension}`);
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
  let generatedCount = 0;

  for (const group of TARGET_GROUPS) {
    fs.rmSync(group.derivedDir, { recursive: true, force: true });
    fs.mkdirSync(group.derivedDir, { recursive: true });

    for (const [filename, widthSet] of group.items.entries()) {
      const sourcePath = path.join(group.sourceDir, filename);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`Missing source image: ${sourcePath}`);
        continue;
      }

      const widths = [...widthSet].sort((a, b) => a - b);

      for (const width of widths) {
        for (const extension of ['avif', 'webp', 'jpg']) {
          const outputPath = buildOutputPath(
            group.derivedDir,
            filename,
            width,
            extension,
          );
          await writeVariant(sourcePath, outputPath, width, extension);
          generatedCount += 1;
        }
      }
    }
  }

  console.log(
    `Generated ${generatedCount} derived image variants across the socialmedia, blog, and zip asset directories.`,
  );
}

generateDerivedAssets().catch((error) => {
  console.error('Failed to generate derived images.', error);
  process.exitCode = 1;
});
