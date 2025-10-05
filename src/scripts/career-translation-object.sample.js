/**
 * Sample Career Translation Object Structure
 * 
 * This file demonstrates the structure of translated career data
 * that will be stored in the translations Map of each Career document.
 */

// Example of how translated career data will be structured
const sampleCareerTranslationObject = {
  // French translations
  fr: {
    title: "Ingénieur de Test Senior - Automobile",
    description: "Diriger des projets de test automobile pour les principaux constructeurs. Expérience requise avec les tests de collision et les systèmes de sécurité des véhicules.",
    department: "Ingénierie",
    location: "Détroit, MI",
    responsibilities: [
      "Diriger des projets de test automobile",
      "Collaborer avec les équipes de développement",
      "Analyser les résultats de test"
    ],
    requirements: [
      "Diplôme en ingénierie automobile",
      "5+ années d'expérience",
      "Connaissance des normes de sécurité"
    ],
    benefits: [
      "Assurance santé complète",
      "Plan de retraite 401k",
      "Formation continue"
    ],
    tags: ["automobile", "test", "sécurité", "ingénierie"]
  },

  // Portuguese translations
  pt: {
    title: "Engenheiro de Testes Sênior - Automotivo",
    description: "Liderar projetos de teste automotivo para principais OEMs. Experiência com testes de colisão e sistemas de segurança veicular necessária.",
    department: "Engenharia",
    location: "Detroit, MI",
    responsibilities: [
      "Liderar projetos de teste automotivo",
      "Colaborar com equipes de desenvolvimento",
      "Analisar resultados de teste"
    ],
    requirements: [
      "Graduação em engenharia automotiva",
      "5+ anos de experiência",
      "Conhecimento de padrões de segurança"
    ],
    benefits: [
      "Seguro de saúde completo",
      "Plano de aposentadoria 401k",
      "Treinamento contínuo"
    ],
    tags: ["automotivo", "teste", "segurança", "engenharia"]
  },

  // Spanish translations
  es: {
    title: "Ingeniero de Pruebas Senior - Automotriz",
    description: "Liderar proyectos de pruebas automotrices para principales OEMs. Se requiere experiencia con pruebas de choque y sistemas de seguridad vehicular.",
    department: "Ingeniería",
    location: "Detroit, MI",
    responsibilities: [
      "Liderar proyectos de pruebas automotrices",
      "Colaborar con equipos de desarrollo",
      "Analizar resultados de pruebas"
    ],
    requirements: [
      "Título en ingeniería automotriz",
      "5+ años de experiencia",
      "Conocimiento de estándares de seguridad"
    ],
    benefits: [
      "Seguro de salud completo",
      "Plan de jubilación 401k",
      "Capacitación continua"
    ],
    tags: ["automotriz", "pruebas", "seguridad", "ingeniería"]
  },

  // Russian translations
  ru: {
    title: "Старший инженер по тестированию - Автомобильная промышленность",
    description: "Руководить проектами автомобильного тестирования для крупных OEM. Требуется опыт работы с краш-тестами и системами безопасности транспортных средств.",
    department: "Инженерия",
    location: "Детройт, Мичиган",
    responsibilities: [
      "Руководить проектами автомобильного тестирования",
      "Сотрудничать с командами разработки",
      "Анализировать результаты тестирования"
    ],
    requirements: [
      "Диплом в области автомобильной инженерии",
      "5+ лет опыта",
      "Знание стандартов безопасности"
    ],
    benefits: [
      "Полное медицинское страхование",
      "Пенсионный план 401k",
      "Непрерывное обучение"
    ],
    tags: ["автомобильная промышленность", "тестирование", "безопасность", "инженерия"]
  }
};

// Example of how the Career document will look with translations
const sampleCareerWithTranslations = {
  _id: "507f1f77bcf86cd799439011",
  title: "Senior Test Engineer - Automotive",
  department: "Engineering",
  location: "Detroit, MI",
  type: "Full-time",
  level: "Senior Level",
  description: "Lead automotive testing projects for major OEMs. Experience with crash testing and vehicle safety systems required.",
  responsibilities: [
    "Lead automotive testing projects",
    "Collaborate with development teams",
    "Analyze test results"
  ],
  requirements: [
    "Degree in automotive engineering",
    "5+ years experience",
    "Knowledge of safety standards"
  ],
  benefits: [
    "Comprehensive health insurance",
    "401k retirement plan",
    "Continuous training"
  ],
  tags: ["automotive", "testing", "safety", "engineering"],
  workArrangement: "Onsite",
  isActive: true,
  postedAt: new Date(),
  applicationUrl: "https://example.com/apply",
  
  // Translations Map - this is what gets populated by the translation script
  translations: sampleCareerTranslationObject,
  
  createdAt: new Date(),
  updatedAt: new Date()
};

module.exports = {
  sampleCareerTranslationObject,
  sampleCareerWithTranslations
};
