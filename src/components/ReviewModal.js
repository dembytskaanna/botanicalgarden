import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../services/reviewService';
import { containsBannedWords } from '../utils/contentValidation';
import { REVIEW_CONFIG } from '../utils/constants';
import Header from './layout/Header';

const { MAX_DELETIONS_PER_DAY } = REVIEW_CONFIG;

export const ReviewModal = ({
  isVisible,
  locationId,
  locationTitle,
  onClose,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [canAddReview, setCanAddReview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [deletionsStats, setDeletionsStats] = useState({
    deletionsToday: 0,
    remainingDeletions: MAX_DELETIONS_PER_DAY,
  });

  useEffect(() => {
    if (isVisible && locationId) {
      loadReviews();
      checkReviewAvailability();
      loadDeletionsStats();
    }
  }, [isVisible, locationId]);

  const loadDeletionsStats = async () => {
    const stats = await reviewService.getDeletionsStats();
    setDeletionsStats(stats);
  };

  const checkReviewAvailability = async () => {
    const result = await reviewService.canAddReview();
    setCanAddReview(result.canAdd);
    setTimeRemaining(result.timeRemaining);
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const loadedReviews = await reviewService.getReviews(locationId);
      const avgRating = await reviewService.getAverageRating(locationId);
      setReviews(loadedReviews);
      setAverageRating(avgRating);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (text) => {
    setComment(text);
    if (containsBannedWords(text)) {
      setCommentError('Текст містить неприпустимі слова');
    } else {
      setCommentError('');
    }
  };

  const handleSubmit = async () => {
    if (!canAddReview) {
      const formattedTime = reviewService.formatTimeRemaining(timeRemaining);
      Alert.alert(
        'Обмеження',
        `Ви зможете додати наступний відгук через ${formattedTime}`
      );
      return;
    }

    if (rating === 0 || !comment.trim()) {
      Alert.alert('Помилка', 'Будь ласка, вкажіть рейтинг та додайте коментар');
      return;
    }

    if (containsBannedWords(comment)) {
      Alert.alert(
        'Неприпустимий контент',
        'Ваш відгук містить неприпустимі слова. Будь ласка, відредагуйте текст.'
      );
      return;
    }

    try {
      setLoading(true);
      await reviewService.addReview(locationId, {
        rating,
        comment: comment.trim(),
      });

      setRating(0);
      setComment('');
      setCommentError('');
      await loadReviews();
      await checkReviewAvailability();

      Alert.alert(
        'Успішно',
        'Ваш відгук додано. Наступний відгук можна буде додати через 24 години.'
      );
    } catch (error) {
      if (error.code === 'TIME_LIMIT') {
        const formattedTime = reviewService.formatTimeRemaining(
          error.timeRemaining
        );
        Alert.alert(
          'Обмеження',
          `Ви зможете додати наступний відгук через ${formattedTime}`
        );
      } else {
        Alert.alert(
          'Помилка',
          'Помилка при додаванні відгуку. Спробуйте пізніше.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinutesWord = (minutes) => {
    if (minutes === 1 || (minutes > 20 && minutes % 10 === 1)) return 'хвилину';
    if (
      (minutes >= 2 && minutes <= 4) ||
      (minutes > 20 && minutes % 10 >= 2 && minutes % 10 <= 4)
    )
      return 'хвилини';
    return 'хвилин';
  };

  const getHoursWord = (hours) => {
    if (hours === 1 || (hours > 20 && hours % 10 === 1)) return 'годину';
    if (
      (hours >= 2 && hours <= 4) ||
      (hours > 20 && hours % 10 >= 2 && hours % 10 <= 4)
    )
      return 'години';
    return 'годин';
  };

  const getDaysWord = (days) => {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дні';
    return 'днів';
  };

  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return 'Дата невідома';

      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Дата невідома';

      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      // Якщо минуло менше години
      if (diffInMinutes < 60) {
        return `${diffInMinutes} ${getMinutesWord(diffInMinutes)} тому`;
      }

      // Якщо минуло менше доби
      if (diffInHours < 24) {
        return `${diffInHours} ${getHoursWord(diffInHours)} тому`;
      }

      // Якщо минуло менше тижня
      if (diffInDays < 7) {
        return `${diffInDays} ${getDaysWord(diffInDays)} тому`;
      }

      // В інших випадках показуємо повну дату
      return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Помилка дати';
    }
  };

  const ReviewItem = ({ review }) => {
    const [deleteStatus, setDeleteStatus] = useState({
      canDelete: false,
      reason: '',
    });
    const [showDeleteReason, setShowDeleteReason] = useState(false);

    useEffect(() => {
      const checkDeletePermission = async () => {
        const status = await reviewService.canDeleteReview(review.id);
        setDeleteStatus(status);
      };
      checkDeletePermission();
    }, [review.id]);

    const handleDeletePress = () => {
      if (!deleteStatus.canDelete) {
        setShowDeleteReason(true);
        setTimeout(() => setShowDeleteReason(false), 3000);
        return;
      }

      Alert.alert(
        'Видалення відгуку',
        'Ви впевнені, що хочете видалити цей відгук?',
        [
          {
            text: 'Скасувати',
            style: 'cancel',
          },
          {
            text: 'Видалити',
            style: 'destructive',
            onPress: async () => {
              try {
                setLoading(true);
                await reviewService.deleteReview(locationId, review.id);
                await loadReviews();
                await loadDeletionsStats();
                Alert.alert(
                  'Успішно',
                  `Відгук видалено. Залишилось видалень на сьогодні: ${
                    deletionsStats.remainingDeletions - 1
                  }`
                );
              } catch (error) {
                Alert.alert(
                  'Помилка',
                  error.message || 'Не вдалося видалити відгук'
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ],
        { cancelable: true }
      );
    };

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewHeaderLeft}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={review.rating >= star ? '#FFD700' : '#E0E0E0'}
                />
              ))}
            </View>
            <Text style={styles.reviewDate}>
              {formatDate(review.createdAt)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDeletePress}
            style={[
              styles.deleteButton,
              !deleteStatus.canDelete && styles.deleteButtonDisabled,
            ]}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={deleteStatus.canDelete ? '#FF3B30' : '#999'}
            />
          </TouchableOpacity>
        </View>
        {showDeleteReason && (
          <Text style={styles.deleteReasonText}>{deleteStatus.reason}</Text>
        )}
        <Text style={styles.reviewComment}>{review.comment}</Text>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <Header title={locationTitle} onBack={onClose} />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2196F3"
            style={styles.loader}
          />
        ) : (
          <ScrollView>
            <View style={styles.content}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  Середній рейтинг: {averageRating.toFixed(1)}
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={24}
                      color={averageRating >= star ? '#FFD700' : '#E0E0E0'}
                    />
                  ))}
                </View>
              </View>

              {deletionsStats.remainingDeletions < MAX_DELETIONS_PER_DAY && (
                <View style={styles.statsContainer}>
                  <Text style={styles.statsText}>
                    Видалено відгуків сьогодні: {deletionsStats.deletionsToday}
                    {'\n'}
                    Залишилось можливих видалень:{' '}
                    {deletionsStats.remainingDeletions}
                  </Text>
                </View>
              )}

              {!canAddReview && timeRemaining > 0 && (
                <View style={styles.timeRemainingContainer}>
                  <Text style={styles.timeRemainingText}>
                    Ви зможете додати наступний відгук через{' '}
                    {reviewService.formatTimeRemaining(timeRemaining)}
                  </Text>
                </View>
              )}

              <View style={styles.addReviewContainer}>
                <Text style={styles.subtitle}>Додати відгук</Text>

                <View style={styles.ratingInput}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      disabled={!canAddReview}>
                      <Ionicons
                        name={rating >= star ? 'star' : 'star-outline'}
                        size={32}
                        color={
                          rating >= star
                            ? '#FFD700'
                            : canAddReview
                            ? '#000'
                            : '#888'
                        }
                        style={styles.starButton}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={[
                    styles.commentInput,
                    commentError ? styles.inputError : null,
                    !canAddReview && styles.inputDisabled,
                  ]}
                  multiline
                  placeholder={
                    canAddReview
                      ? 'Ваш відгук...'
                      : 'Ви вже додали відгук сьогодні'
                  }
                  value={comment}
                  onChangeText={handleCommentChange}
                  editable={canAddReview}
                />

                {commentError ? (
                  <Text style={styles.errorText}>{commentError}</Text>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !canAddReview ||
                    commentError ||
                    !comment.trim() ||
                    rating === 0
                      ? styles.submitButtonDisabled
                      : null,
                  ]}
                  onPress={handleSubmit}
                  disabled={
                    !canAddReview ||
                    !!commentError ||
                    !comment.trim() ||
                    rating === 0
                  }>
                  <Text style={styles.submitButtonText}>
                    {canAddReview ? 'Відправити' : 'Відгук недоступний'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reviewsList}>
                <Text style={styles.subtitle}>Відгуки</Text>
                {reviews.length === 0 ? (
                  <Text style={styles.noReviews}>
                    Поки що немає відгуків. Будьте першим!
                  </Text>
                ) : (
                  reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 8,
  },
  statsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsText: {
    color: '#1976D2',
    textAlign: 'center',
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  timeRemainingContainer: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeRemainingText: {
    color: '#F57C00',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  addReviewContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 4,
  },
  commentInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#9E9E9E',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsList: {
    marginTop: 24,
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  reviewItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteReasonText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
