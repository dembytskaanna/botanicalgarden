export const SCREENS = {
  HOME: 'Home',
  TOUR: 'Tour',
  MAP: 'Map',
  INFO: 'Info',
};

export const TOUR_POINTS = {
  ENTRANCE: 'entrance',
  SEASONS: 'seasons',
  MOUNTAIN: 'mountain',
  KOREAN: 'korean',
  BIRCH: 'birch',
  MIDDLE_ASIA: 'middle_asia',
  RHODODENDRON: 'rhododendron',
  CONIFER: 'conifer',
  ORANGERY: 'orangery',
  MONASTERY: 'monastery',
  LILAC: 'lilac',
  GARDEN: 'garden',
};

export const TOUR_DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
};

export const LOCATION_TITLES = {
  [TOUR_POINTS.ENTRANCE]: 'Головний вхід',
  [TOUR_POINTS.SEASONS]: 'Пори року',
  [TOUR_POINTS.MOUNTAIN]: 'Гірський сад',
  [TOUR_POINTS.KOREAN]: 'Корейський сад',
  [TOUR_POINTS.BIRCH]: 'Березовий гай',
  [TOUR_POINTS.MIDDLE_ASIA]: 'Середня Азія',
  [TOUR_POINTS.RHODODENDRON]: 'Рододендрони',
  [TOUR_POINTS.CONIFER]: 'Хвойні',
  [TOUR_POINTS.ORANGERY]: 'Оранжерейний комплекс',
  [TOUR_POINTS.MONASTERY]: 'Свято-Троїцький Іонінський монастир',
  [TOUR_POINTS.LILAC]: 'Сад бузків',
  [TOUR_POINTS.GARDEN]: 'Сад магнолій',
};

export const LOCATION_DESCRIPTIONS = {
  [TOUR_POINTS.ENTRANCE]: 'Ласкаво просимо до Ботанічного саду',
  [TOUR_POINTS.SEASONS]: 'Сад змінює своє обличчя відповідно до сезону',
  [TOUR_POINTS.MOUNTAIN]: 'Колекція гірських рослин та альпійських луків',
  [TOUR_POINTS.KOREAN]: 'Традиційний корейський сад з характерними рослинами',
  [TOUR_POINTS.BIRCH]: 'Мальовничий куточок саду з березовим гаєм',
  [TOUR_POINTS.MIDDLE_ASIA]: 'Рослини, характерні для Середньої Азії',
  [TOUR_POINTS.RHODODENDRON]: 'Колекція різноманітних видів рододендронів',
  [TOUR_POINTS.CONIFER]: 'Колекція хвойних дерев та кущів',
  [TOUR_POINTS.ORANGERY]: 'Колекція тропічних та субтропічних рослин',
  [TOUR_POINTS.MONASTERY]: 'Історична пам\'ятка архітектури на території саду',
  [TOUR_POINTS.LILAC]: 'Найбільша колекція бузку в Україні',
  [TOUR_POINTS.GARDEN]: 'Мальовничий куточок ботанічного саду',
};

export const IMAGE_PATHS = {
  [TOUR_POINTS.ENTRANCE]: require('../assets/images/1entrance-min.JPG'),
  [TOUR_POINTS.SEASONS]: require('../assets/images/2seasons-min.JPG'),
  [TOUR_POINTS.MOUNTAIN]: require('../assets/images/3mountain-min.JPG'),
  [TOUR_POINTS.KOREAN]: require('../assets/images/4korean-min.JPG'),
  [TOUR_POINTS.BIRCH]: require('../assets/images/5birch-min.JPG'),
  [TOUR_POINTS.MIDDLE_ASIA]: require('../assets/images/6middle_asia-min.JPG'),
  [TOUR_POINTS.RHODODENDRON]: require('../assets/images/7rhododendron-min.JPG'),
  [TOUR_POINTS.CONIFER]: require('../assets/images/8conifer-min.JPG'),
  [TOUR_POINTS.ORANGERY]: require('../assets/images/9orangery-min.JPG'),
  [TOUR_POINTS.MONASTERY]: require('../assets/images/10monastery-min.JPG'),
  [TOUR_POINTS.LILAC]: require('../assets/images/11lilac-min.JPG'),
  [TOUR_POINTS.GARDEN]: require('../assets/images/12garden-min.JPG'),
};

export const LOCATION_COORDINATES = {
  [TOUR_POINTS.ENTRANCE]: { x: 0, y: 0 },
  [TOUR_POINTS.SEASONS]: { x: 0, y: 1 },
  [TOUR_POINTS.MOUNTAIN]: { x: -1, y: 1 },
  [TOUR_POINTS.KOREAN]: { x: 1, y: 1 },
  [TOUR_POINTS.BIRCH]: { x: -2, y: 1 },
  [TOUR_POINTS.MIDDLE_ASIA]: { x: 2, y: 1 },
  [TOUR_POINTS.RHODODENDRON]: { x: 0, y: 2 },
  [TOUR_POINTS.CONIFER]: { x: -1, y: 2 },
  [TOUR_POINTS.ORANGERY]: { x: 1, y: 2 },
  [TOUR_POINTS.MONASTERY]: { x: 0, y: 3 },
  [TOUR_POINTS.LILAC]: { x: -1, y: 3 },
  [TOUR_POINTS.GARDEN]: { x: 1, y: 3 },
};

export const BANNED_WORDS = [
  'тест',
];

// константи для відгуків
export const REVIEW_CONFIG = {
  MAX_DELETIONS_PER_DAY: 3,
  DELETE_WINDOW_HOURS: 24,
  ONE_DAY_IN_MS: 24 * 60 * 60 * 1000,
  //ONE_DAY_IN_MS: 1 * 60 * 1000, // 1 хвилина в мілісекундах
};