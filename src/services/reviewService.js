import AsyncStorage from '@react-native-async-storage/async-storage';
import { REVIEW_CONFIG } from '../utils/constants';

const REVIEWS_STORAGE_KEY = '@botanical_garden_reviews';
const LAST_REVIEW_TIME_KEY = '@botanical_garden_last_review_time';
const DELETED_REVIEWS_COUNT_KEY = '@botanical_garden_deleted_reviews_count';

const { MAX_DELETIONS_PER_DAY, DELETE_WINDOW_HOURS, ONE_DAY_IN_MS } = REVIEW_CONFIG;

export const reviewService = {
  getReviews: async (locationId) => {
    try {
      const reviewsStr = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : {};
      return (reviews[locationId] || []).sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  },

  addReview: async (locationId, reviewData) => {
    try {
      const lastReviewTime = await AsyncStorage.getItem(LAST_REVIEW_TIME_KEY);
      if (lastReviewTime) {
        const timeSinceLastReview = Date.now() - parseInt(lastReviewTime);
        if (timeSinceLastReview < ONE_DAY_IN_MS) {
          const timeRemaining = ONE_DAY_IN_MS - timeSinceLastReview;
          throw {
            code: 'TIME_LIMIT',
            timeRemaining,
            message: 'Можна додати тільки один відгук на день'
          };
        }
      }

      const reviewsStr = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : {};
      
      if (!reviews[locationId]) {
        reviews[locationId] = [];
      }

      const reviewId = Date.now().toString();
      
      const newReview = {
        id: reviewId,
        ...reviewData,
        createdAt: Date.now(),
        locationId
      };

      reviews[locationId].push(newReview);
      await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      await AsyncStorage.setItem(LAST_REVIEW_TIME_KEY, Date.now().toString());
      
      return reviewId;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  canDeleteReview: async (reviewId) => {
    try {
      const reviewsStr = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : {};
      
      let review;
      for (const locationReviews of Object.values(reviews)) {
        review = locationReviews.find(r => r.id === reviewId);
        if (review) break;
      }

      if (!review) {
        return {
          canDelete: false,
          reason: 'Відгук не знайдено'
        };
      }
      /* */
      const reviewAge = Date.now() - review.createdAt;
      const isWithinTimeWindow = reviewAge < (DELETE_WINDOW_HOURS * 60 * 60 * 1000);
      
      if (!isWithinTimeWindow) {
        return {
          canDelete: false,
          reason: `Відгук можна видалити тільки протягом ${DELETE_WINDOW_HOURS} годин після створення`
        };
      }

      const currentDateStr = new Date().toDateString();
      const deletionsStr = await AsyncStorage.getItem(DELETED_REVIEWS_COUNT_KEY);
      const deletions = deletionsStr ? JSON.parse(deletionsStr) : {};
      const todayDeletions = deletions[currentDateStr] || 0;

      if (todayDeletions >= MAX_DELETIONS_PER_DAY) {
        return {
          canDelete: false,
          reason: `Ви вже видалили максимальну кількість відгуків за сьогодні (${MAX_DELETIONS_PER_DAY})`
        };
      }

      return {
        canDelete: true
      };
    } catch (error) {
      console.error('Error checking review deletion permissions:', error);
      return {
        canDelete: false,
        reason: 'Помилка перевірки прав на видалення'
      };
    }
  },

  deleteReview: async (locationId, reviewId) => {
    try {
      const deleteCheck = await reviewService.canDeleteReview(reviewId);
      if (!deleteCheck.canDelete) {
        throw new Error(deleteCheck.reason);
      }

      const reviewsStr = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : {};
      
      if (!reviews[locationId]) {
        throw new Error('Локацію не знайдено');
      }

      const currentDateStr = new Date().toDateString();
      const deletionsStr = await AsyncStorage.getItem(DELETED_REVIEWS_COUNT_KEY);
      const deletions = deletionsStr ? JSON.parse(deletionsStr) : {};
      deletions[currentDateStr] = (deletions[currentDateStr] || 0) + 1;
      await AsyncStorage.setItem(DELETED_REVIEWS_COUNT_KEY, JSON.stringify(deletions));

      reviews[locationId] = reviews[locationId].filter(review => review.id !== reviewId);
      await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));

      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  getDeletionsStats: async () => {
    try {
      const currentDateStr = new Date().toDateString();
      const deletionsStr = await AsyncStorage.getItem(DELETED_REVIEWS_COUNT_KEY);
      const deletions = deletionsStr ? JSON.parse(deletionsStr) : {};
      const todayDeletions = deletions[currentDateStr] || 0;
      
      return {
        deletionsToday: todayDeletions,
        remainingDeletions: MAX_DELETIONS_PER_DAY - todayDeletions,
      };
    } catch (error) {
      console.error('Error getting deletions stats:', error);
      return {
        deletionsToday: 0,
        remainingDeletions: MAX_DELETIONS_PER_DAY,
      };
    }
  },

  canAddReview: async () => {
    try {
      const lastReviewTime = await AsyncStorage.getItem(LAST_REVIEW_TIME_KEY);
      if (!lastReviewTime) return { canAdd: true };

      const timeSinceLastReview = Date.now() - parseInt(lastReviewTime);
      const timeRemaining = ONE_DAY_IN_MS - timeSinceLastReview;

      return {
        canAdd: timeSinceLastReview >= ONE_DAY_IN_MS,
        timeRemaining: timeRemaining > 0 ? timeRemaining : 0
      };
    } catch (error) {
      console.error('Error checking review possibility:', error);
      return { canAdd: false, error: 'Помилка перевірки можливості додати відгук' };
    }
  },

  getAverageRating: async (locationId) => {
    try {
      const reviewsStr = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : {};
      const locationReviews = reviews[locationId] || [];
      
      if (locationReviews.length === 0) return 0;
      
      const sum = locationReviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / locationReviews.length;
    } catch (error) {
      console.error('Error getting average rating:', error);
      return 0;
    }
  },

  formatTimeRemaining: (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} год ${minutes} хв`;
  },

  clearAllReviews: async () => {
    try {
      await AsyncStorage.removeItem(REVIEWS_STORAGE_KEY);
      await AsyncStorage.removeItem(LAST_REVIEW_TIME_KEY);
      await AsyncStorage.removeItem(DELETED_REVIEWS_COUNT_KEY);
    } catch (error) {
      console.error('Error clearing reviews:', error);
    }
  }
};