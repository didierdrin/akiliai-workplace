import { Timestamp } from 'firebase/firestore';
import { Article, Category } from '../hooks/useFirebase';

// Sample articles for development/testing
export const sampleArticles: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Global Markets Rally as Tech Stocks Surge to Record Highs',
    content: `
      <p>Major technology stocks led a broad market rally today as investors showed renewed confidence in the sector's growth prospects. The surge comes amid positive earnings reports and optimistic guidance from industry leaders.</p>
      
      <p>The technology-heavy NASDAQ Composite Index rose 3.2% in early trading, with several prominent tech companies posting significant gains. Apple Inc. jumped 4.1% after reporting better-than-expected quarterly revenues, while Microsoft Corporation gained 3.8% following strong cloud computing growth figures.</p>
      
      <p>"We're seeing a fundamental shift in investor sentiment toward technology stocks," said Maria Rodriguez, senior market analyst at Global Investment Partners. "The combination of strong earnings, innovative product launches, and expanding market opportunities is driving this renewed optimism."</p>
      
      <p>The rally extended beyond traditional tech giants, with emerging technology companies also experiencing substantial gains. Electric vehicle manufacturers, renewable energy technology firms, and artificial intelligence companies all posted impressive performance numbers.</p>
      
      <p>Market analysts attribute the surge to several factors, including increased corporate spending on digital transformation initiatives, growing consumer demand for technology products, and positive regulatory developments in key international markets.</p>
      
      <p>Looking ahead, investors will be closely watching upcoming earnings reports from other major technology companies, as well as economic indicators that could influence market sentiment in the coming weeks.</p>
    `,
    excerpt: 'Major technology stocks led a broad market rally today as investors showed renewed confidence in the sector\'s growth prospects. The surge comes amid positive earnings reports and optimistic guidance from industry leaders.',
    author: 'Sarah Johnson',
    publishDate: '2025-01-07T10:30:00Z',
    category: 'Finance',
    subcategory: 'Markets',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop',
    tags: ['markets', 'technology', 'stocks', 'nasdaq', 'earnings'],
    viewCount: 15420,
    readTime: '5 min read',
    featured: true,
    status: 'published'
  },
  {
    title: 'Revolutionary AI Breakthrough Promises to Transform Healthcare',
    content: `
      <p>Scientists at leading research institutions have developed a new artificial intelligence system capable of diagnosing rare diseases with 95% accuracy, potentially revolutionizing medical diagnosis and treatment worldwide.</p>
      
      <p>The breakthrough, published in the latest issue of Nature Medicine, describes an AI system that can analyze complex medical data, including genetic information, imaging scans, and clinical symptoms, to identify rare conditions that often take years to diagnose through traditional methods.</p>
      
      <p>Dr. Michael Chen, lead researcher at the Advanced Medical AI Institute, explained: "This system represents a paradigm shift in how we approach medical diagnosis. By leveraging machine learning algorithms trained on vast datasets of medical cases, we can identify patterns and connections that might be missed by human physicians."</p>
      
      <p>The AI system has been tested on over 10,000 cases of rare diseases, achieving a diagnostic accuracy rate of 95.3%, compared to the current average of 67% for traditional diagnostic methods. The system also reduced average diagnosis time from 4.8 years to just 3.2 weeks.</p>
      
      <p>Clinical trials are set to begin at major medical centers across North America and Europe, with the goal of integrating the system into routine medical practice within the next two years. Healthcare providers are optimistic about the potential to improve patient outcomes and reduce healthcare costs.</p>
      
      <p>The development comes at a time when healthcare systems worldwide are facing increasing pressure from aging populations and rising healthcare costs, making efficient and accurate diagnostic tools more critical than ever.</p>
    `,
    excerpt: 'Scientists at leading research institutions have developed a new AI system capable of diagnosing rare diseases with 95% accuracy, potentially revolutionizing medical diagnosis and treatment worldwide.',
    author: 'Dr. Michael Chen',
    publishDate: '2025-01-07T08:15:00Z',
    category: 'Tech',
    subcategory: 'AI & Machine Learning',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop',
    tags: ['ai', 'healthcare', 'medical', 'diagnosis', 'machine-learning'],
    viewCount: 12350,
    readTime: '7 min read',
    featured: true,
    status: 'published'
  },
  {
    title: 'Climate Summit Reaches Historic Agreement on Carbon Reduction',
    content: `
      <p>World leaders at the international climate summit have reached a groundbreaking agreement to reduce global carbon emissions by 50% over the next decade, marking a significant step in the fight against climate change.</p>
      
      <p>The agreement, signed by representatives from 195 countries, establishes binding targets for carbon emission reductions and creates a comprehensive framework for international cooperation on climate action. The deal includes substantial financial commitments from developed nations to support clean energy transitions in developing countries.</p>
      
      <p>Emma Rodriguez, chief climate negotiator for the European Union, called the agreement "a historic moment for humanity." She added: "This represents the most ambitious global commitment to climate action we have ever seen, with concrete timelines and accountability mechanisms."</p>
      
      <p>Key provisions of the agreement include:</p>
      <ul>
        <li>Mandatory 50% reduction in carbon emissions by 2035</li>
        <li>$500 billion annual fund for clean energy development</li>
        <li>Phase-out of coal power plants by 2030 in developed nations</li>
        <li>Investment in renewable energy infrastructure</li>
        <li>Enhanced protection for global forests and biodiversity</li>
      </ul>
      
      <p>Environmental groups have largely praised the agreement, though some activists argue that the timelines are not aggressive enough given the urgency of the climate crisis. Industry leaders are beginning to adjust their long-term strategies to align with the new requirements.</p>
      
      <p>The agreement will officially take effect on January 1, 2026, with annual review meetings scheduled to monitor progress and adjust targets as needed.</p>
    `,
    excerpt: 'World leaders at the international climate summit have reached a groundbreaking agreement to reduce global carbon emissions by 50% over the next decade, marking a significant step in the fight against climate change.',
    author: 'Emma Rodriguez',
    publishDate: '2025-01-06T14:22:00Z',
    category: 'World News',
    subcategory: 'Climate',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=500&fit=crop',
    tags: ['climate', 'environment', 'summit', 'carbon-emissions', 'global-warming'],
    viewCount: 18900,
    readTime: '6 min read',
    featured: true,
    status: 'published'
  }
];

// Sample categories
export const sampleCategories: Omit<Category, 'id'>[] = [
  {
    name: 'Finance',
    description: 'Financial markets, banking, economics, and business analysis',
    color: '#10b981',
    order: 1,
    subcategories: ['Markets', 'Banking & Insurance', 'ETFs & Mutual Funds', 'Fintech', 'Crypto', 'Economics']
  },
  {
    name: 'Tech',
    description: 'Technology news, innovation, and digital transformation',
    color: '#3b82f6',
    order: 2,
    subcategories: ['AI & Machine Learning', 'Energy Tech', 'Entrepreneurs', 'Software', 'Hardware', 'Cybersecurity']
  },
  {
    name: 'Politics',
    description: 'Political news, policy analysis, and government affairs',
    color: '#ef4444',
    order: 3,
    subcategories: ['Elections', 'Policy', 'International Relations', 'Government', 'Law & Justice']
  },
  {
    name: 'World News',
    description: 'International news and global affairs',
    color: '#f59e0b',
    order: 4,
    subcategories: ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Climate']
  },
  {
    name: 'Medicine',
    description: 'Healthcare, medical research, and public health',
    color: '#8b5cf6',
    order: 5,
    subcategories: ['Research', 'Public Health', 'Pharmaceuticals', 'Medical Devices', 'Mental Health']
  },
  {
    name: 'Business',
    description: 'Corporate news, industry analysis, and economic trends',
    color: '#06b6d4',
    order: 6,
    subcategories: ['Corporate', 'Startups', 'Industry Analysis', 'Supply Chain', 'Real Estate']
  },
  {
    name: 'Sports',
    description: 'Sports news, analysis, and competition coverage',
    color: '#84cc16',
    order: 7,
    subcategories: ['Football', 'Basketball', 'Baseball', 'International Sports', 'Olympics']
  },
  {
    name: 'Opinion',
    description: 'Editorial content and expert analysis',
    color: '#64748b',
    order: 8,
    subcategories: []
  }
];

// Function to seed Firebase with sample data (for development)
export const seedFirebaseData = async () => {
  // This would be used in development to populate Firebase with sample data
  // Implementation would go here if needed for testing
  console.log('Sample data prepared for Firebase seeding');
};
