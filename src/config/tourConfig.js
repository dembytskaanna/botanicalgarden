import { TOUR_POINTS, IMAGE_PATHS } from '../utils/constants';

export const tourConfig = {
  startPoint: TOUR_POINTS.ENTRANCE,
  locations: {
    [TOUR_POINTS.ENTRANCE]: {
      title: 'Головний вхід',
      description: 'Ласкаво просимо до Ботанічного саду',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.ENTRANCE],
      connections: {
        up: TOUR_POINTS.SEASONS,
      },
      coordinates: { x: 0, y: 0 },
      availableDirections: ['up'],
    },
    [TOUR_POINTS.SEASONS]: {
      title: 'Пори року',
      description: 'Сад змінює своє обличчя відповідно до сезону',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.SEASONS],
      connections: {
        left: TOUR_POINTS.MOUNTAIN,
        right: TOUR_POINTS.KOREAN,
        up: TOUR_POINTS.RHODODENDRON,
        down: TOUR_POINTS.ENTRANCE,
      },
      coordinates: { x: 0, y: 1 },
      availableDirections: ['left', 'right', 'up', 'down'],
    },
    [TOUR_POINTS.MOUNTAIN]: {
      title: 'Гірський сад',
      description: 'Колекція гірських рослин та альпійських луків',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.MOUNTAIN],
      connections: {
        left: TOUR_POINTS.BIRCH,
        right: TOUR_POINTS.SEASONS,
      },
      coordinates: { x: -1, y: 1 },
      availableDirections: ['left', 'right'],
    },
    [TOUR_POINTS.KOREAN]: {
      title: 'Корейський сад',
      description: 'Традиційний корейський сад з характерними рослинами',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.KOREAN],
      connections: {
        left: TOUR_POINTS.SEASONS,
        right: TOUR_POINTS.MIDDLE_ASIA,
      },
      coordinates: { x: 1, y: 1 },
      availableDirections: ['left', 'right'],
    },
    [TOUR_POINTS.BIRCH]: {
      title: 'Березовий гай',
      description: 'Мальовничий куточок з березовим гаєм',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.BIRCH],
      connections: {
        right: TOUR_POINTS.MOUNTAIN,
      },
      coordinates: { x: -2, y: 1 },
      availableDirections: ['right'],
    },
    [TOUR_POINTS.MIDDLE_ASIA]: {
      title: 'Середня Азія',
      description: 'Рослини, характерні для Середньої Азії',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.MIDDLE_ASIA],
      connections: {
        left: TOUR_POINTS.KOREAN,
      },
      coordinates: { x: 2, y: 1 },
      availableDirections: ['left'],
    },
    [TOUR_POINTS.RHODODENDRON]: {
      title: 'Рододендрони',
      description: 'Колекція різноманітних видів рододендронів',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.RHODODENDRON],
      connections: {
        left: TOUR_POINTS.CONIFER,
        right: TOUR_POINTS.ORANGERY,
        up: TOUR_POINTS.MONASTERY,
        down: TOUR_POINTS.SEASONS,
      },
      coordinates: { x: 0, y: 2 },
      availableDirections: ['left', 'right', 'up', 'down'],
    },
    [TOUR_POINTS.CONIFER]: {
      title: 'Хвойні',
      description: 'Колекція хвойних дерев та кущів',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.CONIFER],
      connections: {
        right: TOUR_POINTS.RHODODENDRON,
      },
      coordinates: { x: -1, y: 2 },
      availableDirections: ['right'],
    },
    [TOUR_POINTS.ORANGERY]: {
      title: 'Оранжерейний комплекс',
      description: 'Колекція тропічних та субтропічних рослин',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.ORANGERY],
      connections: {
        left: TOUR_POINTS.RHODODENDRON,
      },
      coordinates: { x: 1, y: 2 },
      availableDirections: ['left'],
    },
    [TOUR_POINTS.MONASTERY]: {
      title: 'Свято-Троїцький Іонінський монастир',
      description: 'Історична пам\'ятка архітектури на території саду',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.MONASTERY],
      connections: {
        left: TOUR_POINTS.LILAC,
        right: TOUR_POINTS.GARDEN,
        down: TOUR_POINTS.RHODODENDRON,
      },
      coordinates: { x: 0, y: 3 },
      availableDirections: ['left', 'right', 'down'],
    },
    [TOUR_POINTS.LILAC]: {
      title: 'Сад бузків',
      description: 'Найбільша колекція бузку в Україні',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.LILAC],
      connections: {
        right: TOUR_POINTS.MONASTERY,
      },
      coordinates: { x: -1, y: 3 },
      availableDirections: ['right'],
    },
    [TOUR_POINTS.GARDEN]: {
      title: 'Сад магнолій',
      description: 'Мальовничий куточок ботанічного саду',
      imageUrl: IMAGE_PATHS[TOUR_POINTS.GARDEN],
      connections: {
        left: TOUR_POINTS.MONASTERY,
      },
      coordinates: { x: 1, y: 3 },
      availableDirections: ['left'],
    },
  },
};