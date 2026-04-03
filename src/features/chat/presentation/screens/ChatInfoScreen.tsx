import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { useChatInfo } from '../../application/hooks/useChatInfo';
import { ChatProfileHeader } from '../components/ChatInfo/ChatProfileHeader';
import { ChatMediaTabs } from '../components/ChatInfo/ChatMediaTabs';
import { ChatMediaItem } from '../components/ChatInfo/ChatMediaItem';
import { ChatMediaPreview } from '../components/shared/ChatMediaPreview';
import { EmptyState } from '../../../../shared/components/feedback/Empty/EmptyState';
import { ChatDetailHeader } from '../components/ChatDetail/ChatDetailHeader';

export const ChatInfoScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, userId, name, avatar, blockedByMe: initialBlockedByMe } = route.params || {};

  const {
    activeTab,
    setActiveTab,
    media,
    loadingMedia,
    loadingMore,
    fetchMore,
    handleViewProfile,
    handleClearChat,
    handleBlock,
    blockedByMe,
    previewVisible,
    setPreviewVisible,
    selectedIndex,
    setSelectedIndex,
    previewData,
    handlePreviewMedia,
    handleSaveToGallery,
    playingId,
    playTime,
    handleToggleAudio,
  } = useChatInfo({
    conversationId,
    userId,
    name,
    avatar,
    initialBlockedByMe,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      
      <ChatDetailHeader 
        name="Thông tin" 
        onBack={() => navigation.goBack()}
        isInfoMode
      />

      <FlatList
        data={media}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ChatMediaItem
            item={item}
            index={index}
            type={activeTab}
            onPress={() => activeTab === 'media' ? handlePreviewMedia(index) : handleToggleAudio(item)}
            isPlaying={playingId === item._id}
            playTime={playTime}
          />
        )}
        ListHeaderComponent={
          <>
            <ChatProfileHeader
              name={name}
              avatar={avatar}
              isBlocked={blockedByMe}
              onViewProfile={handleViewProfile}
              onClearChat={handleClearChat}
              onBlock={handleBlock}
            />
            <ChatMediaTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </>
        }
        numColumns={activeTab === 'media' ? 3 : 1}
        key={activeTab} // Re-render when switching layouts
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={colors.messengerBlue} style={styles.loader} />
          ) : null
        }
        ListEmptyComponent={
          !loadingMedia ? (
            <EmptyState
              title={activeTab === 'media' ? "Chưa có ảnh/video" : "Chưa có tin nhắn thoại"}
              subtitle="Các tệp phương tiện được chia sẻ sẽ xuất hiện ở đây"
              emoji={activeTab === 'media' ? "🖼️" : "🎙️"}
            />
          ) : (
            <ActivityIndicator color={colors.messengerBlue} style={styles.loader} />
          )
        }
        contentContainerStyle={styles.listContent}
      />

      <ChatMediaPreview
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={previewData.map(m => m.mediaUrl).filter((url): url is string => !!url)}
        initialIndex={selectedIndex}
        onSave={handleSaveToGallery}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  loader: {
    marginVertical: spacing.xl,
  },
});
