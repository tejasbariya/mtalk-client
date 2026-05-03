export const getAvatarUrl = (avatar, username) => {
    if (avatar && avatar.trim()) return avatar;
    // Use DiceBear avataaars endpoint
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}&scale=80`;
};