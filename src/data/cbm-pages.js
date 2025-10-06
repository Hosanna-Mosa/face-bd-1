'use strict';

// CBM page data (English only to start)
const cbmPages = [
  {
    title: "Condition Based Monitoring (CBM)",
    description: "Advanced condition monitoring and predictive maintenance services for industrial equipment. We provide comprehensive CBM solutions including vibration analysis, laser alignment, IoT monitoring, thermography, and oil analysis to optimize equipment performance and prevent failures.",
    slug: "cbm",
    language: "en",
    pageNumber: 2,
    isActive: true,
    sections: [
      "vibration-analysis-balancing",
      "laser-shaft-alignment",
      "remote-cbm-iot-cloud",
      "infrared-thermography",
      "lubrication-oil-analysis"
    ],
    // No translations needed initially - add them later!
    metadata: {
      keywords: ["cbm", "condition monitoring", "predictive maintenance", "vibration analysis", "laser alignment", "iot monitoring", "thermography", "oil analysis"],
      author: "CBM Team",
      lastModified: new Date()
    }
  }
];

module.exports = cbmPages;

