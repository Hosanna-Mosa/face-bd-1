'use strict';

const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { connectToDatabase } = require('../setup/database');

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const blogData = [
  {
    title: "The Future of Non-Destructive Testing: AI and Machine Learning Integration",
    slug: "the-future-of-non-destructive-testing-ai-and-machine-learning-integration",
    excerpt: "Explore how artificial intelligence and machine learning are revolutionizing non-destructive testing methodologies, improving accuracy and efficiency across industries.",
    content: "Artificial intelligence and machine learning are transforming the landscape of non-destructive testing (NDT) in unprecedented ways. These technologies are enabling more accurate defect detection, faster analysis, and improved reliability across various industries including aerospace, automotive, and manufacturing.\n\nKey benefits include:\n• Automated defect recognition with 95% accuracy\n• Real-time analysis and reporting\n• Reduced human error and inspection time\n• Predictive maintenance capabilities\n• Enhanced data visualization and interpretation\n\nThe integration of AI in NDT processes allows for continuous learning and improvement, making inspections more efficient and reliable than ever before.",
    publishedAt: new Date('2024-03-15'),
    tags: ["ai", "machine-learning", "ndt", "innovation", "technology"],
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        alt: "AI and Machine Learning in NDT",
        caption: "Advanced AI systems analyzing NDT data",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
        alt: "Machine Learning Algorithms",
        caption: "ML algorithms processing inspection data",
        order: 2
      }
    ],
    isPublished: true,
    isFeatured: true,
    viewCount: 1250,
    readingTime: 8,
    metaDescription: "Discover how AI and machine learning are revolutionizing non-destructive testing, improving accuracy and efficiency across industries."
  },
  {
    title: "Understanding ISO 9712:2021 - Latest Updates in NDT Personnel Certification",
    slug: "understanding-iso-9712-2021-latest-updates-in-ndt-personnel-certification",
    excerpt: "A comprehensive guide to the latest ISO 9712:2021 standard updates and their impact on NDT personnel certification requirements worldwide.",
    content: "The ISO 9712:2021 standard represents a significant update to NDT personnel certification requirements, introducing new competency frameworks and assessment methods. This revision emphasizes practical skills, theoretical knowledge, and continuous professional development.\n\nMajor changes include:\n• Updated qualification requirements for Level I, II, and III personnel\n• Enhanced practical examination procedures\n• New digital certification management systems\n• Improved international recognition and portability\n• Stricter continuing education requirements\n\nThese updates ensure that NDT professionals maintain the highest standards of competency and stay current with evolving industry practices and technologies.",
    publishedAt: new Date('2024-03-12'),
    tags: ["iso-9712", "certification", "standards", "training", "ndt"],
    featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        alt: "ISO 9712 Certification",
        caption: "ISO 9712:2021 certification standards",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
        alt: "NDT Training",
        caption: "NDT personnel training and certification",
        order: 2
      }
    ],
    isPublished: true,
    isFeatured: true,
    viewCount: 980,
    readingTime: 12,
    metaDescription: "Comprehensive guide to ISO 9712:2021 updates and their impact on NDT personnel certification requirements worldwide."
  },
  {
    title: "Ultrasonic Testing in Aerospace: Ensuring Safety in Critical Applications",
    slug: "ultrasonic-testing-in-aerospace-ensuring-safety-in-critical-applications",
    excerpt: "Discover how ultrasonic testing plays a crucial role in aerospace safety, from component inspection to structural integrity assessment.",
    content: "Ultrasonic testing (UT) is a cornerstone of aerospace safety, providing critical insights into the structural integrity of aircraft components. This non-destructive method uses high-frequency sound waves to detect internal flaws, cracks, and material discontinuities that could compromise flight safety.\n\nApplications in aerospace include:\n• Engine component inspection\n• Wing and fuselage structural assessment\n• Landing gear integrity verification\n• Composite material evaluation\n• Weld quality assurance\n\nAdvanced UT techniques such as phased array and time-of-flight diffraction (TOFD) enable precise defect characterization and sizing, ensuring that aircraft meet the stringent safety standards required for commercial and military aviation.",
    publishedAt: new Date('2024-03-10'),
    tags: ["ultrasonic-testing", "aerospace", "safety", "inspection", "ndt"],
    featuredImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
        alt: "Aerospace Ultrasonic Testing",
        caption: "Ultrasonic testing of aircraft components",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
        alt: "Aircraft Inspection",
        caption: "Aircraft structural integrity inspection",
        order: 2
      }
    ],
    isPublished: true,
    isFeatured: false,
    viewCount: 750,
    readingTime: 10,
    metaDescription: "Learn how ultrasonic testing ensures aerospace safety through critical component inspection and structural integrity assessment."
  },
  {
    title: "Radiographic Testing: Digital Revolution in Industrial Inspection",
    slug: "radiographic-testing-digital-revolution-in-industrial-inspection",
    excerpt: "Learn about the digital transformation in radiographic testing and how it's improving inspection capabilities in industrial applications.",
    content: "The digital revolution in radiographic testing has transformed traditional film-based methods into sophisticated digital systems that offer superior image quality, faster processing, and enhanced analysis capabilities. Digital radiography (DR) and computed radiography (CR) are now standard in many industrial applications.\n\nKey advantages of digital radiography:\n• Immediate image availability and review\n• Enhanced image processing and analysis tools\n• Reduced chemical waste and environmental impact\n• Improved image storage and retrieval systems\n• Remote inspection capabilities\n• Better defect detection sensitivity\n\nThese technological advances have made radiographic testing more efficient, cost-effective, and environmentally friendly while maintaining the high standards required for critical industrial inspections.",
    publishedAt: new Date('2024-03-08'),
    tags: ["radiographic-testing", "digital", "industrial", "innovation", "ndt"],
    featuredImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
        alt: "Digital Radiographic Testing",
        caption: "Digital radiographic testing equipment",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop",
        alt: "Industrial Inspection",
        caption: "Industrial radiographic inspection process",
        order: 2
      }
    ],
    isPublished: true,
    isFeatured: false,
    viewCount: 620,
    readingTime: 7,
    metaDescription: "Explore the digital transformation in radiographic testing and its impact on industrial inspection capabilities."
  },
  {
    title: "Magnetic Particle Testing: Best Practices for Surface Crack Detection",
    slug: "magnetic-particle-testing-best-practices-for-surface-crack-detection",
    excerpt: "Master the fundamentals of magnetic particle testing with our comprehensive guide to surface crack detection techniques and best practices.",
    content: "Magnetic particle testing (MPT) is one of the most effective methods for detecting surface and near-surface discontinuities in ferromagnetic materials. This reliable technique is widely used across industries for quality assurance and safety-critical applications.\n\nBest practices for effective MPT include:\n• Proper surface preparation and cleaning\n• Correct magnetization technique selection\n• Appropriate particle type and application method\n• Adequate lighting conditions for inspection\n• Proper interpretation of indications\n• Documentation and reporting standards\n\nUnderstanding the physics behind magnetic particle testing and following established procedures ensures reliable defect detection and helps maintain the highest quality standards in manufacturing and maintenance operations.",
    publishedAt: new Date('2024-03-05'),
    tags: ["magnetic-particle", "surface-testing", "crack-detection", "best-practices", "ndt"],
    featuredImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop",
        alt: "Magnetic Particle Testing",
        caption: "Magnetic particle testing equipment in use",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1565043589221-1a6fd9a85377?w=800&h=400&fit=crop",
        alt: "Surface Crack Detection",
        caption: "Surface crack detection using MPT",
        order: 2
      }
    ],
    isPublished: true,
    isFeatured: false,
    viewCount: 890,
    readingTime: 9,
    metaDescription: "Comprehensive guide to magnetic particle testing best practices for effective surface crack detection in industrial applications."
  }
];

async function seedBlog() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Clear existing blog posts
    await Blog.deleteMany({});
    console.log('Cleared existing blog posts');

    // Insert new blog posts
    const blogs = await Blog.insertMany(blogData);
    console.log(`Successfully seeded ${blogs.length} blog posts`);

    // Display created blogs
    blogs.forEach(blog => {
      console.log(`- ${blog.title} (${blog.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding blog data:', error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  seedBlog();
}

module.exports = { seedBlog };





