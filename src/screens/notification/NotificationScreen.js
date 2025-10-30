// FILE: src/screens/notification/NotificationScreen.jsx
// Notifications Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  setActiveTab,
} from '../../store/slices/notificationSlice';
import { colors } from '../../styles/colors';

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, isLoading, activeTab } = useSelector(
    (state) => state.notification
  );

  const [showActions, setShowActions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
    dispatch(fetchUnreadCount());
  }, [activeTab]);

  const loadNotifications = () => {
    const isRead = activeTab === 'unread' ? false : null;
    dispatch(fetchNotifications({ page: 1, limit: 20, isRead }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    await dispatch(fetchUnreadCount());
    setRefreshing(false);
  };

  const handleTabPress = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id));
    } // Navigate based on notification type
    switch (notification.type) {
      case 'medication_reminder':
        navigation.navigate('MedicationList');
        break;
      case 'event_announcement':
        if (notification.data?.eventId) {
          navigation.navigate('EventDetail', { eventId: notification.data.eventId });
        }
        break;
      case 'blog_post':
        if (notification.data?.blogId) {
          navigation.navigate('BlogDetail', { blogId: notification.data.blogId });
        }
        break;
      case 'educational_content':
        if (notification.data?.contentId) {
          navigation.navigate('EducationalDetail', { contentId: notification.data.contentId });
        }
        break;
      default:
        break;
    }
  };

  const handleMarkAllAsRead = () => {
    Alert.alert('Mark All as Read', 'Mark all notifications as read?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark All',
        onPress: () => {
          dispatch(markAllNotificationsAsRead());
          setShowActions(false);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            dispatch(clearAllNotifications());
            setShowActions(false);
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All',
      'Are you sure you want to delete all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            dispatch(clearAllNotifications());
            setShowActions(false);
          },
        },
      ]
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'medication_reminder':
        return 'medical';
      case 'event_announcement':
        return 'calendar';
      case 'blog_post':
        return 'newspaper';
      case 'educational_content':
        return 'school';
      default:
        return 'notifications';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.notificationItemUnread]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}>
      <View style={styles.notificationIconContainer}>
        <View style={[styles.notificationIcon, !item.isRead && styles.notificationIconUnread]}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={!item.isRead ? colors.primaryDark : colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.isRead && styles.notificationTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.notificationBody} numberOfLines={2}>
          {item.body}
        </Text>
      </View>

      <View style={styles.notificationRight}>
        <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert('Options', 'Choose an action', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: item.isRead ? 'Mark as Unread' : 'Mark as Read',
                onPress: () => {
                  if (!item.isRead) {
                    dispatch(markNotificationAsRead(item._id));
                  }
                },
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => dispatch(deleteNotification(item._id)),
              },
            ]);
          }}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyText}>No notifications</Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'unread' ? 'No unread notifications' : 'You have no notifications yet'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleMarkAllAsRead}
            disabled={unreadCount === 0}>
            <Ionicons
              name="checkmark-done"
              size={24}
              color={unreadCount === 0 ? colors.textSecondary : colors.primaryDark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowActions(!showActions)}>
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => handleTabPress('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.tabActive]}
          onPress={() => handleTabPress('unread')}>
          <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Label */}
      {notifications.length > 0 && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Today</Text>
        </View>
      )}

      {/* Notifications List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Bottom Actions */}
      {showActions && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
            <Text style={styles.actionButtonText}>Clear All</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAll}>
            <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>Delete All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCloseButton} onPress={() => setShowActions(false)}>
            <Ionicons name="checkmark" size={24} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryDark,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  tabTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  dateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  listContainer: {
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    marginBottom: 1,
  },
  notificationItemUnread: {
    backgroundColor: '#F0F7FF',
  },
  notificationIconContainer: {
    marginRight: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIconUnread: {
    backgroundColor: '#E3F2FD',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 4,
  },
  notificationTitleUnread: {
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  notificationBody: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 18,
  },
  notificationRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  moreButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  actionButtonTextDanger: {
    color: '#EF4444',
  },
  actionDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  actionCloseButton: {
    marginLeft: 8,
  },
});

export default NotificationScreen;
