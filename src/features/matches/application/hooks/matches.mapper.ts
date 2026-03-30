import { NewMatchUser, MatchVibeStory } from '../../domain/types/matches.types';

export const mapMatchData = (rawMatches: any[]): NewMatchUser[] => {
  return rawMatches.map((m: any) => {
    const userId = (m?.user?._id || m?.user?.id || m?.conversationId || m?._id)?.toString();
    const conversationId = (m?.conversationId || m?._id || userId)?.toString();

    return {
      id: userId,
      listKey: `${conversationId}:${userId}`,
      name: m.user?.fullName || m.user?.displayName || 'Vibe User',
      age: m.user?.birthYear ? new Date().getFullYear() - m.user.birthYear : 20,
      avatar: m.user?.avatar || 'https://via.placeholder.com/150',
      isNew: !m.lastMessage,
      isOnline: m.user?.isOnline || false,
      conversationId,
    };
  });
};

export const mapStoryFeed = (storyFeed: any[], myId: string): { matchedStories: MatchVibeStory[], ownVibeStories: any[] } => {
  const matchedStories: MatchVibeStory[] = storyFeed
    .map((group: any) => {
      const latestStory = group?.stories?.[group.stories.length - 1];
      if (!latestStory) return null;

      return {
        id: (latestStory.id || latestStory._id).toString(),
        ownerId: (group.user.id || group.user._id).toString(),
        ownerName: group.user.name,
        ownerAvatar: group.user.avatar || 'https://via.placeholder.com/150',
        backgroundImage: latestStory.imageUrl,
        expiresIn: '24h',
        hasLocation: !!latestStory.location,
        hasMusic: !!latestStory.music,
        stories: group.stories,
      } as MatchVibeStory;
    })
    .filter((s: MatchVibeStory | null) => {
      if (!s) return false;
      const ownerId = s.ownerId?.toString();
      return ownerId !== myId;
    }) as MatchVibeStory[];

  const ownStoryGroup = storyFeed.find((group: any) => {
    const groupUserId = (group?.user?.id || group?.user?._id)?.toString();
    return groupUserId === myId;
  });
  const ownVibeStories = ownStoryGroup ? ownStoryGroup.stories : [];

  return { matchedStories, ownVibeStories };
};
