/**
 * Utility to generate icons/emojis for links based on their URL
 */

export function getLinkIcon(url: string): string {
    try {
        const domain = new URL(url).hostname.toLowerCase()
        
        // Map common domains to emojis
        if (domain.includes('github')) return '🔗'
        if (domain.includes('twitter') || domain.includes('x.com')) return '🐦'
        if (domain.includes('linkedin')) return '💼'
        if (domain.includes('instagram')) return '📸'
        if (domain.includes('youtube')) return '🎥'
        if (domain.includes('facebook')) return '👥'
        if (domain.includes('discord')) return '💬'
        if (domain.includes('slack')) return '💬'
        if (domain.includes('medium')) return '📝'
        if (domain.includes('dev.to')) return '👨‍💻'
        if (domain.includes('stackoverflow')) return '📚'
        if (domain.includes('dribbble')) return '🎨'
        if (domain.includes('behance')) return '🎨'
        if (domain.includes('figma')) return '🎨'
        if (domain.includes('notion')) return '📋'
        if (domain.includes('docs.google')) return '📄'
        if (domain.includes('spotify')) return '🎵'
        if (domain.includes('soundcloud')) return '🎵'
        if (domain.includes('twitch')) return '🎮'
        if (domain.includes('tiktok')) return '🎬'
        if (domain.includes('reddit')) return '🤖'
        if (domain.includes('pinterest')) return '📌'
        
        // Portfolio/personal sites
        if (domain.includes('portfolio') || domain.includes('website')) return '🌐'
        
        // Default icon
        return '🌐'
    } catch {
        // If URL is invalid, return default
        return '🌐'
    }
}
