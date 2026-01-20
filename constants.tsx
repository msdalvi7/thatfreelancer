
import { Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Designing',
    category: 'Design',
    description: 'High-quality logos, social media posts, and brand identity assets.',
    icon: '🎨',
    packages: [
      { id: 'gd-1', name: 'Standard Post', price: 15, deliveryTime: '24 Hours', revisions: 2, features: ['1 HQ Design', 'Source File', 'Unlimited Variations'] },
      { id: 'gd-2', name: 'Premium Logo', price: 49, deliveryTime: '48 Hours', revisions: 5, features: ['3 Concepts', 'All Formats', 'Commercial Use'] }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    category: 'Marketing',
    description: 'We handle your posting, engagement, and strategy so you don\'t have to.',
    icon: '📱',
    packages: [
      { id: 'sm-1', name: 'Weekly Growth', price: 99, deliveryTime: '7 Days', revisions: 1, features: ['5 Posts/Week', 'Caption Writing', 'Hashtag Research'] }
    ]
  },
  {
    id: 'copywriting',
    title: 'Copywriting',
    category: 'Writing',
    description: 'Sales-driven copy that converts visitors into customers.',
    icon: '✍️',
    packages: [
      { id: 'cw-1', name: 'Ad Copy', price: 25, deliveryTime: '12 Hours', revisions: 3, features: ['3 Variations', 'Competitor Analysis', 'Hook-driven'] }
    ]
  },
  {
    id: 'content-writing',
    title: 'Content Writing',
    category: 'Writing',
    description: 'SEO-friendly blog posts and articles for your business.',
    icon: '📝',
    packages: [
      { id: 'cnt-1', name: 'SEO Blog Post', price: 40, deliveryTime: '48 Hours', revisions: 2, features: ['1000 Words', 'Keyword Research', 'Plagiarism Report'] }
    ]
  },
  {
    id: 'linkedin-mgmt',
    title: 'LinkedIn Management',
    category: 'Professional',
    description: 'Boost your personal brand or company page with authority content.',
    icon: '💼',
    packages: [
      { id: 'li-1', name: 'Personal Branding', price: 79, deliveryTime: 'Monthly', revisions: 0, features: ['4 Thought Leadership Posts', 'Engagement', 'Profile Optimization'] }
    ]
  },
  {
    id: 'script-writing',
    title: 'Script Writing',
    category: 'Video',
    description: 'Viral-ready scripts for Reels, YouTube, and Ads.',
    icon: '🎬',
    packages: [
      { id: 'sw-1', name: 'Viral Reel Script', price: 20, deliveryTime: '24 Hours', revisions: 2, features: ['Hooks', 'CTA', 'B-roll cues'] }
    ]
  },
  {
    id: 'caption-writing',
    title: 'Caption Writing',
    category: 'Writing',
    description: 'Engaging captions that stop the scroll.',
    icon: '💬',
    packages: [
      { id: 'cap-1', name: 'Pack of 10', price: 30, deliveryTime: '24 Hours', revisions: 1, features: ['10 Custom Captions', 'Hashtags', 'Emojis'] }
    ]
  }
];

export const APP_THEME = {
  primary: 'purple-600',
  secondary: 'orange-500',
  accent: 'orange-400',
  success: 'emerald-500',
  warning: 'amber-500',
  dark: 'slate-900'
};
