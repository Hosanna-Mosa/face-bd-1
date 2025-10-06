'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const Section = require('../models/Section');
const Page = require('../models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbm';

// New pharmaceutical services data
const PHARMACEUTICAL_SERVICES = {
  inspection: [
    {
      sectionId: 'pharmaceutical-products-inspection-ppi',
      title: 'Pharmaceutical Products Inspection (PPI)',
      bodyText: `From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Comprehensive pharmaceutical product inspection services ensuring quality, safety, and regulatory compliance for pharmaceutical manufacturing facilities worldwide.

Pharmaceutical Products Inspection (PPI) is a critical quality assurance process that ensures pharmaceutical products meet stringent regulatory standards and safety requirements. CBM 360 TIV provides specialized inspection services for pharmaceutical manufacturing facilities, covering all aspects of product quality, contamination control, and regulatory compliance.

Why Choose Pharmaceutical Products Inspection from CBM 360 TIV?

We can help you:

• Ensure compliance with FDA, EMA, and international pharmaceutical regulations
• Validate product quality and purity throughout the manufacturing process
• Detect contamination and quality deviations before product release
• Support Good Manufacturing Practice (GMP) compliance programs
• Provide independent third-party verification for regulatory submissions
• Minimize product recalls and regulatory violations
• Enhance consumer safety and product reliability
• Support pharmaceutical supply chain integrity

Trusted Pharmaceutical Inspection by Industry Experts

CBM 360 TIV deploys certified pharmaceutical inspectors with extensive experience in pharmaceutical manufacturing, quality systems, and regulatory compliance. Our inspection services cover all phases of pharmaceutical production from raw materials to finished products.

Global Support Across Pharmaceutical Industries

Our pharmaceutical inspection services cover:

💊 Pharmaceutical Manufacturing Plants – Tablet production, capsule filling, liquid formulations, sterile products
🏭 API Manufacturing Facilities – Active pharmaceutical ingredient production and purification
🧪 Quality Control Laboratories – Analytical testing, method validation, stability studies
🏥 Biotechnology Facilities – Biologic drug production, cell culture, fermentation processes
📦 Packaging and Distribution Centers – Primary and secondary packaging, cold chain management

Our Pharmaceutical Products Inspection Services Include:

• Raw material and excipient inspection
• In-process quality control verification
• Finished product release testing oversight
• Contamination control system validation
• Cleaning validation and verification
• Equipment qualification and calibration checks
• Documentation and batch record review
• Regulatory compliance audits

Standards We Follow:

• FDA 21 CFR Part 210 & 211 – Current Good Manufacturing Practice regulations
• ICH Q7 – Good Manufacturing Practice for Active Pharmaceutical Ingredients
• ISO 13485 – Quality management systems for medical devices
• USP General Chapters – Pharmaceutical compendial standards
• EU GMP Guidelines – European pharmaceutical manufacturing standards
• WHO GMP Guidelines – World Health Organization standards

Ready to Ensure Pharmaceutical Quality and Compliance?

Let CBM 360 TIV provide expert pharmaceutical products inspection services to ensure your products meet the highest quality and safety standards.

To discuss how our Pharmaceutical Products Inspection Services can support your pharmaceutical manufacturing operations, contact CBM 360 TIV today.`,
      page: 'inspection',
      pageNumber: 15,
      language: 'en',
      images: [],
      coverPhoto: '',
      isActive: true
    },
    {
      sectionId: 'pharmaceutical-plant-equipment-inspection-ppei',
      title: 'Pharmaceutical Plant Equipment Inspection (PPEI)',
      bodyText: `From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Specialized equipment inspection services for pharmaceutical manufacturing facilities ensuring operational reliability, safety, and regulatory compliance.

Pharmaceutical Plant Equipment Inspection (PPEI) focuses on the critical equipment and systems that support pharmaceutical manufacturing operations. CBM 360 TIV provides comprehensive inspection services for pharmaceutical plant equipment, ensuring optimal performance, safety, and compliance with stringent pharmaceutical regulations.

Why Choose Pharmaceutical Plant Equipment Inspection from CBM 360 TIV?

We can help you:

• Ensure equipment reliability and minimize unplanned downtime
• Validate equipment performance and qualification status
• Support preventive maintenance and asset management programs
• Ensure compliance with pharmaceutical equipment standards
• Identify potential equipment failures before they impact production
• Optimize equipment lifecycle and performance
• Support regulatory inspections and audits
• Enhance pharmaceutical manufacturing efficiency

Trusted Equipment Inspection by Pharmaceutical Experts

CBM 360 TIV provides certified equipment inspectors with specialized knowledge of pharmaceutical manufacturing equipment, validation requirements, and regulatory standards. Our inspection services ensure your critical equipment operates safely and efficiently.

Comprehensive Equipment Coverage

Our pharmaceutical equipment inspection services cover:

🏭 Production Equipment – Tablet presses, capsule fillers, coating machines, granulators
🌡️ HVAC and Environmental Systems – Clean rooms, air handling units, temperature control
💧 Utilities and Support Systems – Water for injection systems, steam generators, compressed air
🔬 Laboratory Equipment – Analytical instruments, balances, pH meters, dissolution testers
📦 Packaging Equipment – Blister machines, bottle fillers, labeling systems, serialization equipment

Our Pharmaceutical Plant Equipment Inspection Services Include:

• Equipment qualification verification (IQ/OQ/PQ)
• Preventive maintenance inspection
• Calibration status verification
• Safety system functionality checks
• Cleaning and sanitization validation
• Equipment performance monitoring
• Utility system integrity assessment
• Documentation and compliance review

Standards We Follow:

• FDA 21 CFR Part 11 – Electronic records and signatures
• GAMP 5 – Good Automated Manufacturing Practice
• ISPE Baseline Guides – International Society for Pharmaceutical Engineering
• ASME BPE – Bioprocessing Equipment standards
• 3-A Sanitary Standards – Hygienic equipment design
• NFPA Standards – Fire safety and electrical codes

Ready to Optimize Your Pharmaceutical Equipment Performance?

Let CBM 360 TIV provide expert pharmaceutical plant equipment inspection services to ensure your manufacturing equipment operates at peak performance and compliance.

To discuss how our Pharmaceutical Plant Equipment Inspection Services can support your pharmaceutical operations, contact CBM 360 TIV today.`,
      page: 'inspection',
      pageNumber: 16,
      language: 'en',
      images: [],
      coverPhoto: '',
      isActive: true
    }
  ],
  verificationCertification: [
    {
      sectionId: 'pharmaceutical-plant-refinery-fitness-verification-certification',
      title: 'Pharmaceutical Plant & Refinery Fitness Verification & Certification',
      bodyText: `From CBM 360 TIV - Known as Condition Based Monitoring 360° Technical Industrial Verification – Comprehensive fitness verification and certification services for pharmaceutical plants and refinery facilities ensuring operational safety, regulatory compliance, and asset integrity.

Pharmaceutical Plant & Refinery Fitness Verification & Certification provides independent assessment and certification of facility fitness for continued operation. CBM 360 TIV delivers specialized verification services that ensure pharmaceutical and refinery facilities meet stringent safety, quality, and regulatory requirements.

Why Choose Pharmaceutical Plant & Refinery Fitness Verification & Certification from CBM 360 TIV?

We can help you:

• Verify facility fitness for safe and compliant operation
• Support regulatory approval and licensing requirements
• Provide independent third-party certification for stakeholders
• Ensure compliance with international safety and quality standards
• Minimize operational risks and regulatory violations
• Support insurance and financial requirements
• Enhance stakeholder confidence and market access
• Optimize facility performance and reliability

Trusted Verification & Certification by Industry Experts

CBM 360 TIV provides certified verification specialists with extensive experience in pharmaceutical and refinery operations, regulatory compliance, and international standards. Our certification services provide credible, independent verification of facility fitness and compliance.

Comprehensive Facility Coverage

Our verification and certification services cover:

💊 Pharmaceutical Manufacturing Facilities – API production, formulation, packaging, quality control
🏭 Chemical and Petrochemical Refineries – Crude oil processing, chemical synthesis, product purification
🧪 Biotechnology Facilities – Biologic production, cell culture, fermentation, purification
⚗️ Specialty Chemical Plants – Fine chemicals, pharmaceutical intermediates, custom manufacturing
🏥 Medical Device Manufacturing – Device production, sterilization, packaging, quality systems

Our Pharmaceutical Plant & Refinery Fitness Verification & Certification Services Include:

• Facility design and construction verification
• Process safety management certification
• Environmental compliance verification
• Quality system certification
• Equipment and utility system fitness assessment
• Regulatory compliance certification
• Risk assessment and mitigation verification
• Operational readiness certification

Standards We Follow:

• FDA 21 CFR Parts 210, 211, 600-680 – Pharmaceutical regulations
• ICH Guidelines – International pharmaceutical harmonization
• OSHA Process Safety Management (PSM) – Chemical process safety
• EPA Environmental Regulations – Environmental compliance
• ISO 9001, ISO 14001, ISO 45001 – Management system standards
• API Standards – American Petroleum Institute refinery standards
• NFPA Codes – Fire and explosion prevention

Ready to Verify and Certify Your Facility Fitness?

Let CBM 360 TIV provide expert pharmaceutical plant and refinery fitness verification and certification services to ensure your facilities meet the highest standards of safety, quality, and compliance.

To discuss how our Pharmaceutical Plant & Refinery Fitness Verification & Certification Services can support your operations, contact CBM 360 TIV today.`,
      page: 'verification-certification-services',
      pageNumber: 11,
      language: 'en',
      images: [],
      coverPhoto: '',
      isActive: true
    }
  ]
};

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

async function createSection(sectionData) {
  try {
    // Check if section already exists
    const existingSection = await Section.findOne({ sectionId: sectionData.sectionId });
    if (existingSection) {
      console.log(`⚠️  Section already exists: ${sectionData.title}`);
      return existingSection;
    }

    const section = await Section.create(sectionData);
    console.log(`✅ Created section: ${section.title}`);
    return section;
  } catch (error) {
    console.error(`❌ Failed to create section: ${sectionData.title}`, error.message);
    throw error;
  }
}

async function linkSectionToPage(sectionId, pageSlug) {
  try {
    const section = await Section.findOne({ sectionId });
    if (!section) {
      throw new Error(`Section not found: ${sectionId}`);
    }

    const page = await Page.findOne({ slug: pageSlug });
    if (!page) {
      throw new Error(`Page not found: ${pageSlug}`);
    }

    // Check if section is already linked
    if (page.sections.includes(section._id)) {
      console.log(`⚠️  Section already linked to page: ${section.title} -> ${page.title}`);
      return;
    }

    // Add section to page
    page.sections.push(section._id);
    await page.save();
    console.log(`✅ Linked section to page: ${section.title} -> ${page.title}`);
  } catch (error) {
    console.error(`❌ Failed to link section to page:`, error.message);
    throw error;
  }
}

async function addPharmaceuticalServices() {
  try {
    await connectToDatabase();
    
    console.log('🚀 Starting pharmaceutical services addition...\n');

    // Create inspection services
    console.log('📋 Creating inspection services...');
    for (const sectionData of PHARMACEUTICAL_SERVICES.inspection) {
      const section = await createSection(sectionData);
      await linkSectionToPage(section.sectionId, 'inspection');
    }

    // Create verification & certification services
    console.log('\n🏆 Creating verification & certification services...');
    for (const sectionData of PHARMACEUTICAL_SERVICES.verificationCertification) {
      const section = await createSection(sectionData);
      await linkSectionToPage(section.sectionId, 'verification-certification-services');
    }

    console.log('\n🎉 Successfully added all pharmaceutical services!');
    console.log('\nSummary:');
    console.log('✅ Pharmaceutical Products Inspection (PPI) - Added to Inspection category');
    console.log('✅ Pharmaceutical Plant Equipment Inspection (PPEI) - Added to Inspection category');
    console.log('✅ Pharmaceutical Plant & Refinery Fitness Verification & Certification - Added to VC category');

  } catch (error) {
    console.error('❌ Failed to add pharmaceutical services:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  addPharmaceuticalServices()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { addPharmaceuticalServices };
