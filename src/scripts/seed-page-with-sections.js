'use strict';

const { connectToDatabase } = require('../setup/database');
const DataSeeder = require('../utils/seeder');
const { logger } = require('../setup/logger');

// Util to generate sectionId from a title (e.g., "Visual Testing (VT)" -> "visual-testing")
function generateSectionId(title) {
  return title
    .replace(/\(.*?\)/g, '') // remove parenthetical content
    .replace(/&/g, ' and ') // normalize ampersand
    .replace(/[\/,]/g, ' ') // replace slashes and commas with space
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

// Sample data for the new page and sections (Industries)
const samplePageData = {
  title: 'Industries',
  description: 'Industries we serve across energy, manufacturing, infrastructure, and process sectors.',
  slug: 'industries',
  language: 'en',
  pageNumber: 1,
  isActive: true,
  metadata: {
    keywords: [
      'industries',
      'oil-and-gas',
      'power-plants',
      'mining',
      'manufacturing',
      'infrastructure'
    ],
    author: 'Seed Script',
    lastModified: new Date()
  }
};

const sampleSectionsData = [
  {
    title: 'Mining & Metals Plants & Refineries',
    bodyText: 'At CBM 360 TIV, we deliver end-to-end industrial solutions for the Mining & Metals sector. Our services are designed to ensure safety, quality, reliability, and compliance across all stages of mining and metal production.\n\nMining & Metals Industry Focus\n\nWe specialize in providing solutions for each key mineral, including:\n\nCopper & Cobalt, Nickel & Zinc, Lead, Coltan, Niobium, Tantalum, Gold & Platinum, Bauxite & Aluminium, Manganese, Iron, Titanium, Uranium, Lithium, Diamond, Coal\n\nThe Mining & Metals industry is a global sector focused on extracting, processing, and refining metallic ores and minerals. It provides the essential raw materials for construction, technology, clean energy, and industrial infrastructure. The industry is undergoing a major transformation, driven by sustainability goals and growing demand for critical minerals used in emerging technologies.\n\nBenefits:\n\nEnsures global compliance and regulatory adherence.\nProvides independent, third-party verification.\nMinimizes operational risks and downtime.\nEnhances asset reliability, product integrity, and stakeholder confidence.\nSupports responsible and sustainable mining practices.\n\n"CBM 360 TIV – Trusted Testing, Inspection, Monitoring, and Certification for Mining & Metals Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 1,
    sectionId: generateSectionId('Mining & Metals Plants & Refineries'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Cement Plants',
    bodyText: 'At CBM 360 TIV, we provide end-to-end industrial solutions to ensure safety, reliability, compliance, and performance in cement plants. Our services include:\n\nCement Plant Industry Overview\n\nCement plants are the backbone of construction and infrastructure development, producing cement from raw materials like limestone, clay, and gypsum. The industry demands high reliability, process efficiency, and stringent quality standards due to the continuous operation of kilns, mills, and conveyors.\n\nCBM 360 TIV supports cement plants by:\n\nEnsuring critical rotating machinery (kiln drives, ball mills, crushers) operates reliably\n\nConducting structural inspections for silos, storage tanks, and conveyors\n\nImplementing predictive maintenance using CBM and IoT/AI solutions\n\nPerforming audits and verification to ensure compliance with HSE and quality standards\n\nDeveloping innovative technologies to enhance plant efficiency, safety, and sustainability\n\nKey Benefits for Cement Plants\n\nIncreased equipment reliability and operational uptime\n\nReduced maintenance costs through predictive monitoring\n\nCompliance with international quality and safety standards\n\nEnhanced plant efficiency, safety, and sustainability\n\nEarly detection of faults in kilns, mills, and structural components\n\n"CBM 360 TIV – Ensuring Safety, Reliability, and Efficiency for Cement Plants Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 2,
    sectionId: generateSectionId('Cement Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Steel Plants',
    bodyText: 'At CBM 360 TIV, we provide comprehensive industrial solutions for steel plants, ensuring safety, reliability, compliance, and operational efficiency. Our services include:\n\nSteel Plant Industry Overview\n\nSteel plants are the backbone of infrastructure, construction, and industrial manufacturing, producing steel from iron ore, scrap, and alloying materials. The industry requires continuous operation of high-temperature furnaces, rolling mills, and heavy machinery, making reliability, predictive maintenance, and safety essential.\n\nCBM 360 TIV supports steel plants by:\n\nEnsuring rotating machinery and critical equipment operate efficiently\n\nConducting structural inspections for furnaces, storage silos, and conveyors\n\nImplementing predictive maintenance using CBM and IoT/AI systems\n\nPerforming audits and verification to ensure compliance with HSE and quality standards\n\nDeveloping innovative R&D solutions to enhance steel plant efficiency, safety, and sustainability\n\nKey Benefits for Steel Plants\n\nMaximize equipment uptime and reliability\n\nReduce maintenance costs through predictive monitoring\n\nEnsure compliance with international quality and safety standards\n\nImprove operational efficiency and sustainability\n\nEarly detection of faults in furnaces, mills, conveyors, and structural systems\n\n"CBM 360 TIV – Enhancing Safety, Reliability, and Performance for Steel Plants Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 3,
    sectionId: generateSectionId('Steel Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Oil & Gas',
    bodyText: 'At CBM 360 TIV, we provide comprehensive industrial solutions for the oil and gas sector, covering both onshore and offshore platforms, jackets, process complexes, and tank farms. Our services ensure safety, compliance, reliability, and operational efficiency.\n\nOil & Gas Industry Overview\n\nOil and gas facilities, including onshore processing plants, offshore platforms, jackets, and tank farms, are complex and high-risk environments. They require continuous monitoring, rigorous inspection, and advanced maintenance to ensure operational reliability, safety, and regulatory compliance.\n\nCBM 360 TIV supports oil and gas operations by:\n\nEnsuring critical rotating machinery and process equipment operate efficiently\n\nConducting structural and safety inspections for platforms, jackets, tanks, and piping networks\n\nImplementing predictive maintenance using CBM, IoT, and AI-based monitoring systems\n\nPerforming audits and verification to comply with HSE, ISO, API, ASME, and international standards\n\nDeveloping innovative R&D solutions to enhance efficiency, reliability, and safety across the facility\n\nKey Benefits for Oil & Gas Facilities\n\nMaximized equipment uptime and operational reliability.\n\nReduced maintenance costs through predictive monitoring.\n\nCompliance with international safety, quality, and environmental standards.\n\nImproved structural integrity and process safety.\n\nEarly detection of faults in machinery, tanks, pipelines, and structural systems.\n\n"CBM 360 TIV – Ensuring Safety, Reliability, and Compliance for Onshore and Offshore Oil & Gas Facilities Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 4,
    sectionId: generateSectionId('Oil & Gas'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Petrochemical Plants & Refineries',
    bodyText: 'At CBM 360 TIV, we deliver specialized Testing, Inspection, Condition-Based Monitoring, Auditing, Verification & Certification, and R&D solutions for the petrochemical industry, ensuring safe, reliable, and efficient operations. Our expertise covers ethylene plants, polypropylene units, aromatics complexes, olefin plants, refineries, and downstream petrochemical facilities.\n\nPetrochemical Industry Overview\n\nPetrochemical plants form the backbone of modern industry, producing the building blocks for plastics, textiles, fertilizers, pharmaceuticals, and specialty chemicals. Operating under extreme temperatures, pressures, and corrosive conditions, these facilities demand robust safety, monitoring, and inspection practices.\n\nCBM 360 TIV supports petrochemical operators by:\n\nEnhancing asset integrity and operational safety.\n\nConducting shutdown and turnaround inspections with minimal downtime.\n\nDeploying IoT & AI-based predictive monitoring systems for reliability.\n\nPerforming global standard certifications and compliance audits.\n\nDelivering next-gen R&D solutions for smart, sustainable operations.\n\nKey Benefits for Petrochemical Plants\n\nIncrease plant safety, uptime, and efficiency.\n\nReduce maintenance costs with predictive strategies.\n\nEnsure compliance with global process safety regulations.\n\nExtend asset lifecycle and performance.\n\nEnable digital transformation with IoT, AI & robotics.\n\n"CBM 360 TIV – Powering Petrochemical Safety, Reliability, and Smart Operations."',
    images: [],
    language: 'en',
    pageNumber: 5,
    sectionId: generateSectionId('Petrochemical Plants & Refineries'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Fertilizer Plants',
    bodyText: 'At CBM 360 TIV, we provide end-to-end Testing, Inspection, Condition-Based Monitoring, Auditing, Verification & Certification, and R&D solutions tailored for the fertilizer industry. Our expertise covers ammonia, urea, phosphatic, potash, and complex fertilizer plants, ensuring safety, compliance, and reliability of critical assets.\n\nFertilizer Plant Industry Overview\n\nFertilizer plants are highly complex, high-pressure process facilities that play a crucial role in global food security. With the demand for fertilizers rising, plants face challenges of equipment aging, corrosion, energy efficiency, and environmental compliance.\n\nCBM 360 TIV supports fertilizer industries by:\n\nEnsuring integrity and safety of high-pressure equipment and reactors\n\nConducting shutdown inspections and turnaround services to minimize downtime\n\nImplementing predictive maintenance through CBM and IoT systems\n\nPerforming compliance audits and certifications for global regulatory standards\n\nInnovating with Industry 4.0 technologies for smart fertilizer plants\n\nKey Benefits for Fertilizer Plants\n\nImprove plant safety and asset reliability.\n\nReduce unplanned outages and maintenance costs.\n\nEnsure regulatory compliance and certification.\n\nExtend equipment life cycles through predictive monitoring.\n\nSupport sustainability and energy efficiency\n\n"CBM 360 TIV – Ensuring Safety, Reliability, and Innovation in Fertilizer Manufacturing."',
    images: [],
    language: 'en',
    pageNumber: 6,
    sectionId: generateSectionId('Fertilizer Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Pharmaceutical Plants',
    bodyText: 'At CBM 360 TIV, we provide comprehensive Testing, Inspection, CBM, Auditing, Verification & Certification, and R&D solutions for pharmaceutical manufacturing facilities, ensuring compliance, safety, and operational excellence. Our expertise covers API manufacturing, formulations, sterile production, and biotechnology facilities.\n\nPharmaceutical Plant Industry Overview\n\nPharmaceutical plants require highly controlled environments, stringent quality standards, and validated processes to ensure the safety and efficacy of drugs and biologics. Continuous monitoring, predictive maintenance, and regulatory compliance are critical to avoiding contamination, ensuring uptime, and meeting international standards.\n\nCBM 360 TIV supports pharmaceutical manufacturers by:\n\nEnsuring equipment reliability and process integrity\n\nConducting GMP-compliant inspections and audits\n\nImplementing IoT and AI-based condition monitoring for critical utilities and equipment\n\nPerforming verification and certification to meet FDA, EMA, and WHO guidelines\n\nDelivering innovative R&D solutions for smart, automated, and efficient pharmaceutical operations.\n\nKey Benefits for Pharmaceutical Plants\n\nMaintain GMP compliance and regulatory adherence.\n\nReduce equipment downtime and maintenance costs.\n\nEnsure safety, product quality, and process efficiency.\n\nExtend service life of critical machinery and utilities.\n\nEnable digital transformation with smart monitoring and predictive maintenance.\n\n"CBM 360 TIV – Ensuring Safety, Compliance, and Smart Operations in Pharmaceutical Manufacturing."',
    images: [],
    language: 'en',
    pageNumber: 7,
    sectionId: generateSectionId('Pharmaceutical Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'FSO/FPSO',
    bodyText: 'At CBM 360 TIV, we provide end-to-end industrial solutions for FSO (Floating Storage & Offloading) and FPSO (Floating Production, Storage & Offloading) units, ensuring safety, reliability, compliance, and operational efficiency. Our services include:\n\nFSO / FPSO Industry Overview\n\nFSO and FPSO units are critical offshore assets for oil and gas storage, processing, and offloading. They operate in harsh marine environments with complex mechanical, electrical, and structural systems. Maintaining equipment reliability, structural integrity, and safety compliance is essential for uninterrupted production and safe operations.\n\nCBM 360 TIV supports FSO/FPSO operations by:\n\nEnsuring rotating machinery, pumps, compressors, and generators operate efficiently\n\nConducting structural and hull inspections for topside and subsea components\n\nImplementing predictive maintenance using CBM, IoT, and AI-based monitoring systems\n\nPerforming audits and verification to comply with HSE, ISO, API, ABS, and DNV standards\n\nDeveloping innovative R&D solutions to enhance offshore operational efficiency, safety, and sustainability.\n\nKey Benefits for FSO / FPSO Units\n\nMaximize equipment uptime and operational reliability.\n\nReduce maintenance costs through predictive monitoring.\n\nEnsure compliance with international offshore and safety standards.\n\nImprove structural integrity and safety of critical offshore assets.\n\nEarly detection of faults in machinery, piping, and storage systems.\n\n"CBM 360 TIV – Ensuring Safety, Reliability, and Performance for FSO and FPSO Operations Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 8,
    sectionId: generateSectionId('FSO/FPSO'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Power Plants and Utilities',
    bodyText: 'At CBM 360 TIV, we provide comprehensive industrial solutions for power plants and utility facilities, ensuring safety, reliability, compliance, and operational efficiency. Our services include:\n\nPower Plant & Utilities Overview\n\nPower plants—including coal, gas, thermal, geothermal, hydroelectric, and utilities—are critical for energy generation and distribution. These facilities require continuous operation, high reliability, and strict compliance with safety and environmental standards.\n\nCBM 360 TIV supports power generation facilities by:\n\nEnsuring critical equipment such as turbines, generators, boilers, and pumps operate efficiently\n\nConducting structural and operational inspections for power plant infrastructure, piping networks, and utilities\n\nImplementing predictive maintenance using CBM, IoT, and AI-based monitoring systems\n\nPerforming audits and verification to comply with HSE, ISO, IEC, API, and local regulations\n\nDeveloping innovative R&D solutions to enhance plant efficiency, reliability, and sustainability\n\nKey Benefits for Power Plants & Utilities\n\nMaximize equipment uptime and operational reliability.\n\nReduce maintenance costs through predictive monitoring.\n\nEnsure compliance with international safety, quality, and environmental standards.\n\nEnhance plant efficiency, sustainability, and operational safety.\n\nEarly detection of faults in turbines, boilers, generators, and structural components.\n\n"CBM 360 TIV – Ensuring Reliability, Safety, and Efficiency Across Power Plants and Utilities Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 9,
    sectionId: generateSectionId('Power Plants and Utilities'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Sugar Plants',
    bodyText: 'At CBM 360 TIV, we provide comprehensive industrial solutions for sugar plants, ensuring safety, reliability, compliance, and operational efficiency. Our services include:\n\nSugar Plant Industry Overview\n\nSugar plants process sugarcane or sugar beet into sugar and by-products such as molasses and bagasse. These facilities require continuous operation, robust equipment, and strict quality control to meet production targets and ensure safety.\n\nCBM 360 TIV supports sugar plants by:\n\nEnsuring critical equipment such as crushers, mills, boilers, and centrifuges operate efficiently\n\nConducting structural and equipment inspections for conveyors, storage tanks, piping, and plant machinery\n\nImplementing predictive maintenance using CBM, IoT, and AI-based monitoring systems\n\nPerforming audits and verification to comply with ISO and food safety standards\n\nDeveloping innovative R&D solutions to enhance operational efficiency, reliability, and safety.\n\nKey Benefits for Sugar Plants\n\nMaximize equipment uptime and production efficiency.\n\nReduce maintenance costs through predictive monitoring.\n\nEnsure compliance with quality, safety, and food standards.\n\nEnhance plant safety, operational reliability, and process efficiency.\n\nEarly detection of faults in machinery, piping, and storage systems.\n\n"CBM 360 TIV – Ensuring Safety, Reliability, and Efficiency for Sugar Plants Worldwide."',
    images: [],
    language: 'en',
    pageNumber: 10,
    sectionId: generateSectionId('Sugar Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Paper & Pulp Manufacturing Plants',
    bodyText: 'At CBM 360 TIV, we provide comprehensive Testing, Inspection, Condition-Based Monitoring, Auditing, Verification & Certification, and R&D services for paper and pulp manufacturing plants, ensuring operational efficiency, safety, and compliance. Our solutions cover raw material processing, pulping, paper production, and finishing lines.\n\nPaper & Pulp Industry Overview\n\nPaper and pulp manufacturing involves complex chemical and mechanical processes that require continuous monitoring, maintenance, and quality assurance. Plants face challenges such as high-temperature operations, mechanical wear, environmental compliance, and energy optimization.\n\nCBM 360 TIV supports paper and pulp plants by:\n\nEnsuring equipment reliability and operational safety\n\nConducting periodic inspections and predictive maintenance\n\nImplementing IoT & AI-based CBM for critical equipment\n\nPerforming audits and certifications for regulatory and quality compliance\n\nDriving innovation in automation, energy efficiency, and smart monitoring.\n\nKey Benefits for Paper & Pulp Plants\n\nImprove plant safety, uptime, and operational efficiency.\n\nReduce maintenance costs and unplanned downtime.\n\nEnsure regulatory compliance and quality certification.\n\nExtend equipment life and process reliability.\n\nEnable smart manufacturing with Industry 4.0 technologies.\n\n"CBM 360 TIV – Enhancing Safety, Reliability, and Innovation in Paper & Pulp Manufacturing."',
    images: [],
    language: 'en',
    pageNumber: 11,
    sectionId: generateSectionId('Paper & Pulp Manufacturing Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Agri & FMCG, Beverage Processing Plants',
    bodyText: 'At CBM 360 TIV, we provide specialized Testing, Inspection, Condition-Based Monitoring (CBM), Auditing, Verification & Certification, and R&D solutions for the Agri & Food Sector, helping businesses maintain product safety, equipment reliability, compliance, and operational efficiency.\n\nIndustry Segments We Serve\n\n1. FMCG & Food Processing Plants\n\nInspection and monitoring of packaging lines, automated conveyors, storage, and bottling units.\nCBM for rotating equipment, chillers, pumps, and HVAC systems.\n\n2. Beverage Manufacturing Plants\n\nQuality assurance for bottling, filling, sterilization, and labelling lines.\nNDT and CBM for pumps, motors, storage tanks, and pasteurization equipment.\n\n3. Pepper & Spice Processing Plants\n\nQuality control and inspection of dryers, grinders, sterilizers, and packaging lines.\nCBM for motors, gearboxes, and conveyors to reduce downtime and contamination risk.\n\n4. General Food & Agribusiness Processing\n\nEnd-to-end process inspection, predictive maintenance, and verification of all critical equipment.\nEnsures safety, quality, and compliance for domestic and export markets.\n\nKey Benefits for the Agri & Food Sector\n\nMaintain food safety and hygiene compliance.\nReduce equipment downtime and maintenance costs.\nImprove process efficiency, quality, and traceability.\nAchieve global certification standards for export readiness.\nEnable Industry 4.0 transformation through smart monitoring, IoT, and AI.\n\n"CBM 360 TIV – Ensuring Safety, Quality, and Smart Operations Across the Agri & Food Sector."',
    images: [],
    language: 'en',
    pageNumber: 12,
    sectionId: generateSectionId('Agri & FMCG, Beverage Processing Plants'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Industrial Manufacturing & Processing',
    bodyText: 'At CBM 360 TIV, we provide end-to-end solutions for industrial manufacturing and processing plants, ensuring safety, compliance, reliability, and innovation. Our expertise covers production facilities, heavy machinery, automated systems, and processing equipment.\n\nIndustrial Manufacturing & Processing Overview\n\nIndustrial manufacturing and processing form the backbone of modern industry, covering fabrication, assembly, packaging, and large-scale production across multiple sectors. These facilities require high efficiency, continuous uptime, and compliance with strict quality and safety standards.\n\nCBM 360 TIV supports the manufacturing and processing industry by:\n\nEnsuring production machinery and automated systems operate reliably\n\nConducting structural and process inspections for manufacturing lines, utilities, and support infrastructure\n\nImplementing predictive maintenance using IoT, AI, and CBM solutions for improved efficiency\n\nPerforming audits and certifications to meet international standards and client requirements\n\nDriving innovation through R&D for automation, robotics, and sustainable industrial technologies.\n\nKey Benefits for Industrial Manufacturing & Processing\n\nMaximize production uptime and efficiency.\n\nReduce maintenance costs through predictive monitoring.\n\nEnsure compliance with international quality and safety standards.\n\nEnhance productivity, sustainability, and process reliability.\n\nEnable digital transformation with Industry 4.0 technologies.\n\n"CBM 360 TIV – Powering Safety, Reliability, and Innovation in Industrial Manufacturing & Processing."',
    images: [],
    language: 'en',
    pageNumber: 13,
    sectionId: generateSectionId('Industrial Manufacturing & Processing'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Heavy Automotive',
    bodyText: 'At CBM 360 TIV, we deliver specialized industrial solutions for the heavy automotive sector, ensuring safety, quality, compliance, and equipment reliability. Our expertise covers manufacturing plants, maintenance facilities, and operational fleets.\n\nHeavy Automotive Department & Equipment Overview\n\nThe heavy automotive sector, including trucks, buses, construction vehicles, mining equipment, defence vehicles, and industrial fleets, requires high reliability, durability, and safety standards. Regular testing, inspection, and monitoring are critical to ensure operational efficiency and extended service life.\n\nCBM 360 TIV supports the heavy automotive industry by:\n\nEnsuring engines, transmissions, and braking systems operate with maximum reliability\n\nConducting structural and component inspections for safety and performance\n\nImplementing predictive maintenance using CBM, IoT, and AI diagnostics for fleets and equipment\n\nPerforming audits and certifications to comply with ISO, IATF, and global automotive standards\n\nDriving innovation through R&D for advanced monitoring, automation, and vehicle health systems.\n\nKey Benefits for Heavy Automotive Sector\n\nImprove vehicle reliability, safety, and efficiency.\n\nReduce maintenance costs through predictive diagnostics.\n\nEnsure compliance with international automotive and safety standards.\n\nEnhance fleet uptime, lifecycle management, and operational readiness.\n\nEarly detection of faults in engines, transmissions, hydraulics, and structural parts.\n\n"CBM 360 TIV – Driving Safety, Reliability, and Innovation in the Heavy Automotive Industry."',
    images: [],
    language: 'en',
    pageNumber: 14,
    sectionId: generateSectionId('Heavy Automotive'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Railway',
    bodyText: 'At CBM 360 TIV, we provide comprehensive industrial solutions for the railway sector, ensuring safety, reliability, compliance, and operational efficiency across rolling stock, infrastructure, and railway equipment. Our services include:\n\nRailway Department & Equipment Overview\n\nRailway operations involve complex infrastructure, rolling stock, and machinery, requiring continuous inspection, maintenance, and monitoring to ensure safe and reliable transportation.\n\nCBM 360 TIV supports the railway sector by:\n\nEnsuring rolling stock, locomotives, and critical machinery operate efficiently\n\nConducting structural and operational inspections for tracks, bridges, signalling systems, and maintenance equipment\n\nImplementing predictive maintenance using CBM, IoT, and AI-based monitoring systems\n\nPerforming audits and verification to comply with railway safety standards and operational protocols\n\nDeveloping innovative R&D solutions to improve safety, reliability, and efficiency in railway operations.\n\nKey Benefits for Railway Operations\n\nMaximize equipment uptime and operational reliability.\n\nReduce maintenance costs through predictive monitoring.\n\nEnsure compliance with safety, quality, and operational standards.\n\nEnhance structural integrity, rolling stock performance, and safety.\n\nEarly detection of faults in rails, wheels, engines, and signalling equipment.\n\n"CBM 360 TIV – Ensuring Safety, Reliability, and Operational Excellence in Railway Equipment and Infrastructure."',
    images: [],
    language: 'en',
    pageNumber: 15,
    sectionId: generateSectionId('Railway'),
    page: 'industries',
    isActive: true,
    translations: {}
  },
  {
    title: 'Roads and Bridges',
    bodyText: 'At CBM 360 TIV, we deliver comprehensive testing, inspection, monitoring, and certification solutions for roads, bridges, and civil infrastructure projects, ensuring safety, durability, and compliance with international standards.\n\nRoads & Bridges Overview \n\nRoads and bridges are critical lifelines of modern infrastructure, enabling transport, trade, and connectivity. They endure heavy traffic loads, weathering, and environmental stress, requiring regular inspection, monitoring, and certification to maintain long-term safety and performance.\n\nCBM 360 TIV supports governments, EPC contractors, and infrastructure developers by:\n\nEnsuring quality construction and long-term reliability of roads and bridges\n\nConducting structural and material inspections for early fault detection\n\nImplementing IoT & AI-based predictive monitoring systems for smart infrastructure\n\nPerforming load testing, verification, and certification for compliance\n\nProviding innovative R&D solutions for sustainable transport infrastructure.\n\nKey Benefits for Roads & Bridges\n\nImprove public safety and infrastructure reliability.\n\nReduce maintenance costs with predictive monitoring.\n\nEnsure compliance with international standards & regulations.\n\nExtend lifecycle of roads, highways, and bridges.\n\nEnable smart infrastructure management with IoT, AI, and robotics.\n\n"CBM 360 TIV – Building Safer Roads and Bridges with Innovation, Testing, and Smart Monitoring."',
    images: [],
    language: 'en',
    pageNumber: 16,
    sectionId: generateSectionId('Roads and Bridges'),
    page: 'industries',
    isActive: true,
    translations: {}
  }
];

async function seedPageWithSections() {
  try {
    // Connect to database
    await connectToDatabase();
    logger.info('🔌 Connected to database');

    // Initialize seeder
    const seeder = new DataSeeder();

    // Step 1: Validate sections before any DB writes
    logger.info('🧪 Step 1: Validating sections (sectionId, uniqueness, format)...');
    const validation = validateSections(sampleSectionsData);
    if (!validation.isValid) {
      logger.error('❌ Section validation failed. Details:');
      validation.errors.forEach(err => logger.error(`   - ${err}`));
      process.exit(1);
    }

    // Step 2: Create sections first
    logger.info('📝 Step 2: Creating sections...');
    const sectionsResult = await seeder.createSections(sampleSectionsData);
    
    if (sectionsResult.some(r => r.error)) {
      logger.error('❌ Some sections failed to create');
      sectionsResult.forEach((result, index) => {
        if (result.error) {
          logger.error(`   Section ${index + 1}: ${result.error}`);
        }
      });
      throw new Error('Section creation failed');
    }
    
    logger.info(`✅ Created ${sectionsResult.length} sections successfully`);

    // Step 3: Create page with references to sections
    logger.info('📄 Step 3: Creating page with sections...');
    
    // Get the created sections to reference them in the page
    const createdSections = sectionsResult.map(section => section._id);
    const pageDataWithSections = {
      ...samplePageData,
      sections: createdSections
    };
    
    const pageResult = await seeder.createPage(pageDataWithSections);
    logger.info(`✅ Page created successfully: ${pageResult.title} (${pageResult.slug})`);

    // Step 4: Display summary
    logger.info('📊 Seeding Summary:');
    logger.info(`   Sections: ${sectionsResult.length}`);
    logger.info(`   Page: 1`);
    logger.info(`   Page Slug: ${pageResult.slug}`);
    logger.info(`   Sections in Page: ${pageResult.sections.length}`);

    // Step 5: Verify the data
    logger.info('🔍 Step 5: Verifying data...');
    await verifyData();

    logger.info('🎉 Page and sections seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

async function verifyData() {
  const Section = require('../models/Section');
  const Page = require('../models/Page');

  // Check sections
  const sectionsCount = await Section.countDocuments({ page: 'industries' });
  logger.info(`   ✅ Found ${sectionsCount} sections for industries`);

  // Check page
  const page = await Page.findOne({ slug: 'industries' }).populate('sections');
  if (page) {
    logger.info(`   ✅ Found page: "${page.title}" with ${page.sections.length} sections`);
    
    // Display section details
    page.sections.forEach((section, index) => {
      logger.info(`     Section ${index + 1}: "${section.title}" (${section.sectionId})`);
      logger.info(`       Language: ${section.language}`);
      logger.info(`       Page Number: ${section.pageNumber}`);
    });
  } else {
    logger.error('   ❌ Page not found');
  }

  // Display sample data
  logger.info('\n📋 Sample Data Preview:');
  logger.info(`   Page Title: ${page.title}`);
  logger.info(`   Page Description: ${page.description}`);
  logger.info(`   Page Slug: ${page.slug}`);
  logger.info(`   Total Sections: ${page.sections.length}`);
}

// Function to clear the seeded data
async function clearSeededData() {
  try {
    await connectToDatabase();
    logger.info('🔌 Connected to database');

    const Section = require('../models/Section');
    const Page = require('../models/Page');

    // Delete the page and its sections
    const page = await Page.findOne({ slug: 'industries' });
    if (page) {
      await Page.deleteOne({ slug: 'industries' });
      logger.info('🗑️ Deleted industries page');
    }

    const sectionsResult = await Section.deleteMany({ page: 'industries' });
    logger.info(`🗑️ Deleted ${sectionsResult.deletedCount} sections`);

    logger.info('✅ Seeded data cleared successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to clear data:', error.message);
    process.exit(1);
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('clear')) {
    logger.info('🧹 Clearing seeded data...');
    clearSeededData();
  } else {
    logger.info('🌱 Starting page and sections seeding...');
    seedPageWithSections();
  }
}

module.exports = { seedPageWithSections, clearSeededData };

// Validate section objects prior to DB writes
function validateSections(sections) {
  const errors = [];
  const seenIds = new Set();
  const seenTitles = new Set();

  sections.forEach((section, index) => {
    const path = `Section[${index + 1}]`;

    // Title validation
    if (!section.title || typeof section.title !== 'string') {
      errors.push(`${path}: title is missing or not a string`);
    } else if (seenTitles.has(section.title)) {
      errors.push(`${path}: duplicate title "${section.title}"`);
    } else {
      seenTitles.add(section.title);
    }

    // sectionId validation
    if (!section.sectionId || typeof section.sectionId !== 'string') {
      errors.push(`${path}: sectionId is missing or not a string`);
    } else {
      const expected = generateSectionId(section.title || '');
      if (section.sectionId !== expected) {
        errors.push(`${path}: sectionId mismatch. Expected "${expected}" from title, found "${section.sectionId}"`);
      }
      if (/[^a-z0-9-]/.test(section.sectionId)) {
        errors.push(`${path}: sectionId contains invalid characters (only [a-z0-9-] allowed)`);
      }
      if (seenIds.has(section.sectionId)) {
        errors.push(`${path}: duplicate sectionId "${section.sectionId}"`);
      } else {
        seenIds.add(section.sectionId);
      }
    }

    // page and language basics
    if (section.page !== 'industries') {
      errors.push(`${path}: page must be "industries"`);
    }
    if (section.language !== 'en') {
      errors.push(`${path}: language must be "en"`);
    }

    // pageNumber sanity
    if (typeof section.pageNumber !== 'number' || section.pageNumber <= 0) {
      errors.push(`${path}: pageNumber must be a positive number`);
    }
  });

  return { isValid: errors.length === 0, errors };
}
