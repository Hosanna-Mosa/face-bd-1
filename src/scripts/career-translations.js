/**
 * Career Translation Data
 * 
 * This file contains all the translations for career-related content including
 * employment types, seniority levels, work arrangements, and static page content.
 */

const CAREER_TRANSLATIONS = {
  // Employment Types
  employmentTypes: {
    'Full-time': {
      fr: 'Temps plein',
      pt: 'Tempo integral',
      es: 'Tiempo completo',
      ru: 'Полная занятость'
    },
    'Part-time': {
      fr: 'Temps partiel',
      pt: 'Meio período',
      es: 'Medio tiempo',
      ru: 'Неполная занятость'
    },
    'Contract': {
      fr: 'Contrat',
      pt: 'Contrato',
      es: 'Contrato',
      ru: 'Контракт'
    },
    'Internship': {
      fr: 'Stage',
      pt: 'Estágio',
      es: 'Prácticas',
      ru: 'Стажировка'
    },
    'Temporary': {
      fr: 'Temporaire',
      pt: 'Temporário',
      es: 'Temporal',
      ru: 'Временная работа'
    }
  },

  // Seniority Levels
  seniorityLevels: {
    'Entry Level': {
      fr: 'Niveau débutant',
      pt: 'Nível inicial',
      es: 'Nivel inicial',
      ru: 'Начальный уровень'
    },
    'Mid Level': {
      fr: 'Niveau intermédiaire',
      pt: 'Nível médio',
      es: 'Nivel medio',
      ru: 'Средний уровень'
    },
    'Senior Level': {
      fr: 'Niveau senior',
      pt: 'Nível sênior',
      es: 'Nivel senior',
      ru: 'Старший уровень'
    },
    'Lead': {
      fr: 'Chef d\'équipe',
      pt: 'Líder',
      es: 'Líder',
      ru: 'Руководитель'
    },
    'Manager': {
      fr: 'Gestionnaire',
      pt: 'Gerente',
      es: 'Gerente',
      ru: 'Менеджер'
    },
    'Director': {
      fr: 'Directeur',
      pt: 'Diretor',
      es: 'Director',
      ru: 'Директор'
    }
  },

  // Work Arrangements
  workArrangements: {
    'Onsite': {
      fr: 'Sur site',
      pt: 'Presencial',
      es: 'En el sitio',
      ru: 'На месте'
    },
    'Remote': {
      fr: 'À distance',
      pt: 'Remoto',
      es: 'Remoto',
      ru: 'Удаленно'
    },
    'Hybrid': {
      fr: 'Hybride',
      pt: 'Híbrido',
      es: 'Híbrido',
      ru: 'Гибридный'
    }
  },

  // Common Departments
  departments: {
    'Engineering': {
      fr: 'Ingénierie',
      pt: 'Engenharia',
      es: 'Ingeniería',
      ru: 'Инженерия'
    },
    'Technology': {
      fr: 'Technologie',
      pt: 'Tecnologia',
      es: 'Tecnología',
      ru: 'Технология'
    },
    'Healthcare': {
      fr: 'Santé',
      pt: 'Saúde',
      es: 'Salud',
      ru: 'Здравоохранение'
    },
    'Manufacturing': {
      fr: 'Fabrication',
      pt: 'Manufatura',
      es: 'Manufactura',
      ru: 'Производство'
    },
    'Environmental': {
      fr: 'Environnement',
      pt: 'Ambiental',
      es: 'Ambiental',
      ru: 'Экология'
    },
    'Sales': {
      fr: 'Ventes',
      pt: 'Vendas',
      es: 'Ventas',
      ru: 'Продажи'
    }
  },

  // Common Locations (keeping as is since they're proper nouns)
  locations: {
    'Detroit, MI': {
      fr: 'Détroit, Michigan',
      pt: 'Detroit, Michigan',
      es: 'Detroit, Michigan',
      ru: 'Детройт, Мичиган'
    },
    'Austin, TX': {
      fr: 'Austin, Texas',
      pt: 'Austin, Texas',
      es: 'Austin, Texas',
      ru: 'Остин, Техас'
    },
    'San Diego, CA': {
      fr: 'San Diego, Californie',
      pt: 'San Diego, Califórnia',
      es: 'San Diego, California',
      ru: 'Сан-Диего, Калифорния'
    },
    'Phoenix, AZ': {
      fr: 'Phoenix, Arizona',
      pt: 'Phoenix, Arizona',
      es: 'Phoenix, Arizona',
      ru: 'Финикс, Аризона'
    },
    'Seattle, WA': {
      fr: 'Seattle, Washington',
      pt: 'Seattle, Washington',
      es: 'Seattle, Washington',
      ru: 'Сиэтл, Вашингтон'
    },
    'New York, NY': {
      fr: 'New York, New York',
      pt: 'Nova York, Nova York',
      es: 'Nueva York, Nueva York',
      ru: 'Нью-Йорк, Нью-Йорк'
    }
  }
};

/**
 * Get translated value for a given key and language
 * @param {string} category - Category of translation (employmentTypes, seniorityLevels, etc.)
 * @param {string} key - The key to translate
 * @param {string} language - Target language code
 * @returns {string} - Translated value or original key if translation not found
 */
function getTranslatedValue(category, key, language) {
  if (!CAREER_TRANSLATIONS[category] || !CAREER_TRANSLATIONS[category][key]) {
    return key; // Return original if not found
  }
  
  const translation = CAREER_TRANSLATIONS[category][key][language];
  return translation || key; // Return original if translation not found
}

/**
 * Translate employment type
 * @param {string} type - Employment type
 * @param {string} language - Target language
 * @returns {string} - Translated employment type
 */
function translateEmploymentType(type, language) {
  return getTranslatedValue('employmentTypes', type, language);
}

/**
 * Translate seniority level
 * @param {string} level - Seniority level
 * @param {string} language - Target language
 * @returns {string} - Translated seniority level
 */
function translateSeniorityLevel(level, language) {
  return getTranslatedValue('seniorityLevels', level, language);
}

/**
 * Translate work arrangement
 * @param {string} arrangement - Work arrangement
 * @param {string} language - Target language
 * @returns {string} - Translated work arrangement
 */
function translateWorkArrangement(arrangement, language) {
  return getTranslatedValue('workArrangements', arrangement, language);
}

/**
 * Translate department
 * @param {string} department - Department name
 * @param {string} language - Target language
 * @returns {string} - Translated department name
 */
function translateDepartment(department, language) {
  return getTranslatedValue('departments', department, language);
}

/**
 * Translate location
 * @param {string} location - Location name
 * @param {string} language - Target language
 * @returns {string} - Translated location name
 */
function translateLocation(location, language) {
  return getTranslatedValue('locations', location, language);
}

module.exports = {
  CAREER_TRANSLATIONS,
  getTranslatedValue,
  translateEmploymentType,
  translateSeniorityLevel,
  translateWorkArrangement,
  translateDepartment,
  translateLocation
};
