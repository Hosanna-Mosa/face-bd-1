

const translations = {
    en: {
      navbar: {
        services: "Services",
        industries: "Industries",
        about: "About",
        careers: "Careers",
        blog: "Blog",
        contact: "Contact",
        getQuote: "Get Quote",
        contactUs: "Contact Us",
      },
      footer: {
        company: "CBM",
        description:
          "Leading provider of testing, inspection, certification, and advisory services. Committed to safety, security, and sustainability worldwide.",
        services: {
          title: "Services",
          list: [
            "Testing & Certification",
            "Inspection Services",
            "Audit & Assessment",
            "Training & Education",
            "Digital Solutions",
            "Consulting Services",
          ],
        },
        industries: {
          title: "Industries",
          list: [
            "Automotive",
            "Healthcare & Medical",
            "Energy & Utilities",
            "Manufacturing",
            "Construction",
            "Food & Agriculture",
          ],
        },
        contact: {
          title: "Contact",
          address: "CBM 360 TIV – UK\n79 Denyer St, London SW3 2NY, UK",
          phone: "+44 7934 980214",
          email: "Support@cbm360tiv.com\ninfo@cbm360tiv.com",
        },
        newsletter: "Stay Updated",
        placeholderEmail: "Enter your email",
      },
      pages: {
        services: {
          hero: {
            title: "Leading Testing, Inspection & Certification Services",
            subtitle: "Trusted Worldwide",
            description: "Ensuring safety, security, and sustainability across industries with comprehensive testing, inspection, certification, and advisory services.",
            primaryCTAText: "Explore Services",
            secondaryCTAText: "Get Quote",
          },
        },
        about: {
          title: "About",
          breadcrumb: {
            home: "Home",
            about: "About"
          },
          loading: "Loading...",
          error: "Failed to load content"
        },
        careers: {
          title: "Current Openings",
          description: "Explore exciting career opportunities across our global organization. Find the perfect role to advance your career.",
          applyNow: "Apply Now",
          hiringProcess: {
            title: "Our Hiring Process",
            description: "We've designed our process to be transparent, efficient, and focused on finding the right mutual fit.",
            steps: {
              review: {
                title: "Application Review",
                description: "Our talent team reviews your application and qualifications against role requirements."
              },
              interview: {
                title: "Initial Interview",
                description: "Phone or video interview to discuss your background, interests, and fit for the role."
              },
              assessment: {
                title: "Technical Assessment",
                description: "Role-specific technical evaluation or case study to assess your capabilities."
              },
              final: {
                title: "Final Interview",
                description: "Meet with hiring managers and team members to discuss collaboration and next steps."
              }
            }
          },
          currentOpenings: {
            loadingText: "Loading careers...",
            generalApplicationText: "Don't see the right role? We're always looking for talented individuals.",
            submitGeneralApplication: "Submit General Application"
          }
        },
        blog: {
          title: "Latest Articles",
          description: "Technical insights and industry updates from our team of experts."
        },
        contact: {
          officesTitle: "Our Global Offices",
          officesDescription: "With locations worldwide, we're always close to you. Find your nearest CBM office for local support and services.",
          formTitle: "Send Us a Message",
          formDescription: "Fill out the form below and our experts will get back to you within 24 hours.",
          supportTitle: "Get Direct Support",
          supportDescription: "Prefer to speak directly? Our customer support team is available to help you with immediate questions and urgent requests.",
          supportPhoneTitle: "Phone Support",
          supportPhoneDesc: "Speak with our customer service team",
          supportPhoneHours: "Mon-Fri: 8:00 AM - 6:00 PM EST",
          supportEmailTitle: "Email Support",
          supportEmailDesc: "Send detailed inquiries and documentation",
          supportEmailResponse: "Response within 24 hours",
          supportEmergencyTitle: "Emergency Support",
          supportEmergencyDesc: "24/7 support for urgent certification issues",
          supportEmergencyNote: "Available 24/7 for emergencies",
          responseGuaranteeTitle: "Quick Response Guarantee",
          responsePhone: "Phone inquiries answered within 3 rings",
          responseEmail: "Email responses within 24 hours",
          responseQuote: "Quote requests processed within 48 hours",
          labels: {
            firstName: "First Name *",
            lastName: "Last Name *",
            email: "Email Address *",
            phone: "Phone Number",
            company: "Company *",
            industry: "Industry",
            service: "Service Needed",
            message: "Message *",
            consent: "I agree to CBM processing my personal data for the purpose of responding to my inquiry. I understand I can withdraw consent at any time."
          },
          placeholders: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@company.com",
            phone: "+44 7934 980214",
            company: "Your Company Name",
            selectIndustry: "Select Industry",
            selectService: "Select Service",
            message: "Please describe your requirements, timeline, and any specific questions you have..."
          },
          cta: {
            send: "Send Message",
            sending: "Sending..."
          }
        },
      },
      services: {
        completeServicePortfolio: {
          heading: "Complete Service Portfolio",
          subheading: "From product testing to regulatory compliance, we provide comprehensive solutions to help you succeed in global markets.",
        },
        servicesList: [
          {
            id: 1,
            title: "Testing (T)",
            description: "Comprehensive testing services to validate safety, performance, and compliance.",
            icon: "Search",
            link: "/services/testing",
            imageUrl: "/testing-inspection-bg.jpg",
            features: [
              "Non-destructive testing",
              "Performance & reliability",
              "Standards compliance",
            ]
          },
          {
            id: 2,
            title: "Condition based Monitoring (CBM)",
            description: "Predictive maintenance using analytics, sensors, and diagnostics to reduce downtime.",
            icon: "Settings",
            link: "/services/cbm",
            features: [
              "Vibration & acoustic analysis",
              "Thermography & oil analysis",
              "Asset health dashboards",
            ]
          },
          {
            id: 3,
            title: "Inspection (I)",
            description: "Independent inspection services ensuring quality and regulatory adherence.",
            icon: "Shield",
            link: "/services/inspection",
            features: [
              "Third-party inspection",
              "Vendor surveillance",
              "Site & factory audits",
            ]
          },
          {
            id: 4,
            title: "Auditing (A)",
            description: "Process, supplier, and system audits to identify risks and drive improvement.",
            icon: "FileText",
            link: "/services/auditing",
            features: [
              "Supplier audits",
              "Process capability reviews",
              "Compliance gap analysis",
            ]
          },
          {
            id: 5,
            title: "Verification & Certification (VC)",
            description: "Verification and certification services to demonstrate trust and compliance.",
            icon: "Award",
            link: "/services/verification-certification",
            features: [
              "Management systems",
              "Product certification",
              "Regulatory approvals",
            ]
          },
          {
            id: 6,
            title: "Innovation & R&D",
            description: "Next-generation solutions powered by IoT, AI, Robotics, and Industry 4.0 technologies.",
            icon: "Brain",
            link: "/services/innovation-rd",
            features: [
              "IoT & AI monitoring",
              "Robotic inspection",
              "Digital twin technology",
            ]
          },
        ]
      },
      industryStats: [
        {
          number: "72+",
          label: "Countries Served",
          description: "Global presence with local expertise"
        },
        {
          number: "7,000+",
          label: "Experts Worldwide",
          description: "Highly qualified professionals"
        },
        {
          number: "25+",
          label: "Testing Laboratories",
          description: "State-of-the-art facilities"
        },
        {
          number: "33",
          label: "Years of Excellence",
          description: "Trusted since 1992"
        }
      ],
    },
  
    fr: {
      navbar: {
        services: "Services",
        industries: "Industries",
        about: "À propos",
        careers: "Carrières",
        blog: "Blog",
        contact: "Contact",
        getQuote: "Obtenir un devis",
        contactUs: "Contactez-nous",
      },
      footer: {
        company: "CBM",
        description:
          "Fournisseur leader de services de test, d'inspection, de certification et de conseil. Engagé pour la sécurité, la sûreté et la durabilité dans le monde entier.",
        services: {
          title: "Services",
          list: [
            "Tests et certification",
            "Services d'inspection",
            "Audit et évaluation",
            "Formation et éducation",
            "Solutions numériques",
            "Services de conseil",
          ],
        },
        industries: {
          title: "Industries",
          list: [
            "Automobile",
            "Santé & médical",
            "Énergie & services publics",
            "Fabrication",
            "Construction",
            "Alimentation & agriculture",
          ],
        },
        contact: {
          title: "Contact",
          address: "CBM 360 TIV – UK\n79 Denyer St, London SW3 2NY, UK",
          phone: "+44 7934 980214",
          email: "Support@cbm360tiv.com\ninfo@cbm360tiv.com",
        },
        newsletter: "Restez informé",
        placeholderEmail: "Entrez votre email",
      },
      pages: {
        services: {
          hero: {
            title: "Services de test, d'inspection et de certification de premier plan",
            subtitle: "De confiance dans le monde entier",
            description: "Garantir la sécurité, la sûreté et la durabilité dans tous les secteurs grâce à des services complets de test, d'inspection, de certification et de conseil.",
            primaryCTAText: "Explorer les services",
            secondaryCTAText: "Obtenir un devis",
          },
        },
        about: {
          title: "À propos",
          breadcrumb: {
            home: "Accueil",
            about: "À propos"
          },
          loading: "Chargement...",
          error: "Échec du chargement du contenu"
        },
        careers: {
          title: "Offres d'emploi actuelles",
          description: "Découvrez des opportunités de carrière passionnantes au sein de notre organisation mondiale. Trouvez le poste idéal pour faire progresser votre carrière.",
          applyNow: "Postuler maintenant",
          hiringProcess: {
            title: "Notre processus de recrutement",
            description: "Nous avons conçu un processus transparent, efficace et axé sur la recherche de l'adéquation mutuelle.",
            steps: {
              review: {
                title: "Examen de la candidature",
                description: "Notre équipe RH examine votre candidature et vos qualifications par rapport aux exigences du poste."
              },
              interview: {
                title: "Entretien initial",
                description: "Entretien téléphonique ou vidéo pour discuter de votre parcours, de vos intérêts et de votre adéquation au poste."
              },
              assessment: {
                title: "Évaluation technique",
                description: "Évaluation technique spécifique au poste ou étude de cas pour évaluer vos compétences."
              },
              final: {
                title: "Entretien final",
                description: "Rencontrez les responsables du recrutement et les membres de l'équipe pour discuter de la collaboration et des prochaines étapes."
              }
            }
          },
          currentOpenings: {
            loadingText: "Chargement des offres...",
            generalApplicationText: "Vous ne trouvez pas le bon poste ? Nous recherchons toujours des talents.",
            submitGeneralApplication: "Envoyer une candidature spontanée"
          }
        },
        blog: {
          title: "Derniers Articles",
          description: "Analyses techniques et actualités du secteur de notre équipe d'experts."
        },
        contact: {
          officesTitle: "Nos bureaux dans le monde",
          officesDescription: "Avec des sites dans le monde entier, nous sommes toujours proches de vous. Trouvez le bureau CBM le plus proche pour un support et des services locaux.",
          formTitle: "Envoyez-nous un message",
          formDescription: "Remplissez le formulaire ci-dessous et nos experts vous répondront sous 24 heures.",
          supportTitle: "Support direct",
          supportDescription: "Vous préférez parler directement ? Notre équipe d'assistance client est disponible pour vous aider avec des questions immédiates et des demandes urgentes.",
          supportPhoneTitle: "Assistance téléphonique",
          supportPhoneDesc: "Parlez à notre service client",
          supportPhoneHours: "Lun-Ven : 8h00 - 18h00 (EST)",
          supportEmailTitle: "Assistance email",
          supportEmailDesc: "Envoyez des demandes détaillées et de la documentation",
          supportEmailResponse: "Réponse sous 24 heures",
          supportEmergencyTitle: "Assistance d'urgence",
          supportEmergencyDesc: "Support 24/7 pour les demandes urgentes de certification",
          supportEmergencyNote: "Disponible 24/7 pour les urgences",
          responseGuaranteeTitle: "Garantie de réponse rapide",
          responsePhone: "Appels répondus en moins de 3 sonneries",
          responseEmail: "Réponses aux emails sous 24 heures",
          responseQuote: "Devis traités sous 48 heures",
          labels: {
            firstName: "Prénom *",
            lastName: "Nom *",
            email: "Adresse e-mail *",
            phone: "Numéro de téléphone",
            company: "Entreprise *",
            industry: "Industrie",
            service: "Service requis",
            message: "Message *",
            consent: "J'accepte que CBM traite mes données personnelles afin de répondre à ma demande. Je comprends que je peux retirer mon consentement à tout moment."
          },
          placeholders: {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@entreprise.com",
            phone: "+33 1 23 45 67 89",
            company: "Nom de votre entreprise",
            selectIndustry: "Sélectionner une industrie",
            selectService: "Sélectionner un service",
            message: "Veuillez décrire vos besoins, votre calendrier et vos questions spécifiques..."
          },
          cta: {
            send: "Envoyer le message",
            sending: "Envoi..."
          }
        },
      },
      services: {
        completeServicePortfolio: {
          heading: "Portfolio de services complet",
          subheading: "Des tests de produits à la conformité réglementaire, nous fournissons des solutions complètes pour vous aider à réussir sur les marchés mondiaux.",
        },
        servicesList: [
          {
            id: 1,
            title: "Tests (T)",
            description: "Services de test complets pour valider la sécurité, les performances et la conformité.",
            icon: "Search",
            link: "/services/testing",
            imageUrl: "/testing-inspection-bg.jpg",
            features: [
              "Tests non destructifs",
              "Performance et fiabilité",
              "Conformité aux normes",
            ]
          },
          {
            id: 2,
            title: "Surveillance basée sur l'état (CBM)",
            description: "Maintenance prédictive utilisant l'analytique, les capteurs et les diagnostics pour réduire les temps d'arrêt.",
            icon: "Settings",
            link: "/services/cbm",
            features: [
              "Analyse vibratoire et acoustique",
              "Thermographie et analyse d'huile",
              "Tableaux de bord de santé des actifs",
            ]
          },
          {
            id: 3,
            title: "Inspection (I)",
            description: "Services d'inspection indépendants garantissant la qualité et le respect de la réglementation.",
            icon: "Shield",
            link: "/services/inspection",
            features: [
              "Inspection tierce partie",
              "Surveillance des fournisseurs",
              "Audits de site et d'usine",
            ]
          },
          {
            id: 4,
            title: "Audit (A)",
            description: "Audits de processus, de fournisseurs et de systèmes pour identifier les risques et stimuler l'amélioration.",
            icon: "FileText",
            link: "/services/auditing",
            features: [
              "Audits de fournisseurs",
              "Examens de capacité de processus",
              "Analyse des écarts de conformité",
            ]
          },
          {
            id: 5,
            title: "Vérification et Certification (VC)",
            description: "Services de vérification et de certification pour démontrer la confiance et la conformité.",
            icon: "Award",
            link: "/services/verification-certification",
            features: [
              "Systèmes de management",
              "Certification de produits",
              "Approbations réglementaires",
            ]
          },
          {
            id: 6,
            title: "Innovation et R&D",
            description: "Solutions de nouvelle génération alimentées par l'IoT, l'IA, la robotique et les technologies Industrie 4.0.",
            icon: "Brain",
            link: "/services/innovation-rd",
            features: [
              "Surveillance IoT et IA",
              "Inspection robotique",
              "Technologie de jumeau numérique",
            ]
          },
        ]
      },
      industryStats: [
        {
          number: "72+",
          label: "Pays Desservis",
          description: "Présence mondiale avec expertise locale"
        },
        {
          number: "7,000+",
          label: "Experts dans le Monde",
          description: "Professionnels hautement qualifiés"
        },
        {
          number: "25+",
          label: "Laboratoires de Test",
          description: "Installations de pointe"
        },
        {
          number: "33",
          label: "Années d'Excellence",
          description: "De confiance depuis 1992"
        }
      ],
    },
  
    pt: {
      navbar: {
        services: "Serviços",
        industries: "Indústrias",
        about: "Sobre",
        careers: "Carreiras",
        blog: "Blog",
        contact: "Contato",
        getQuote: "Solicitar Orçamento",
        contactUs: "Contate-Nos",
      },
      footer: {
        company: "CBM",
        description:
          "Fornecedor líder de serviços de teste, inspeção, certificação e consultoria. Comprometido com segurança, proteção e sustentabilidade em todo o mundo.",
        services: {
          title: "Serviços",
          list: [
            "Teste & Certificação",
            "Serviços de Inspeção",
            "Auditoria & Avaliação",
            "Treinamento & Educação",
            "Soluções Digitais",
            "Serviços de Consultoria",
          ],
        },
        industries: {
          title: "Indústrias",
          list: [
            "Automotivo",
            "Saúde & Médico",
            "Energia & Utilidades",
            "Manufatura",
            "Construção",
            "Alimentação & Agricultura",
          ],
        },
        contact: {
          title: "Contato",
          address: "CBM 360 TIV – UK\n79 Denyer St, London SW3 2NY, UK",
          phone: "+44 7934 980214",
          email: "Support@cbm360tiv.com\ninfo@cbm360tiv.com",
        },
        newsletter: "Fique Atualizado",
        placeholderEmail: "Digite seu email",
      },
      pages: {
        services: {
          hero: {
            title: "Principais serviços de Teste, Inspeção e Certificação",
            subtitle: "Confiável em todo o mundo",
            description: "Garantindo segurança, proteção e sustentabilidade em diversos setores com serviços abrangentes de teste, inspeção, certificação e consultoria.",
            primaryCTAText: "Explorar Serviços",
            secondaryCTAText: "Solicitar Orçamento",
          },
        },
        about: {
          title: "Sobre",
          breadcrumb: {
            home: "Início",
            about: "Sobre"
          },
          loading: "Carregando...",
          error: "Falha ao carregar conteúdo"
        },
        careers: {
          title: "Vagas Abertas",
          description: "Explore oportunidades de carreira empolgantes em nossa organização global. Encontre o cargo ideal para avançar na sua carreira.",
          applyNow: "Candidatar-se agora",
          hiringProcess: {
            title: "Nosso processo de contratação",
            description: "Criamos um processo transparente, eficiente e focado em encontrar o melhor encaixe mútuo.",
            steps: {
              review: {
                title: "Análise da candidatura",
                description: "Nossa equipe de talentos avalia sua candidatura e qualificações em relação aos requisitos da vaga."
              },
              interview: {
                title: "Entrevista inicial",
                description: "Entrevista por telefone ou vídeo para discutir sua experiência, interesses e aderência à função."
              },
              assessment: {
                title: "Avaliação técnica",
                description: "Avaliação técnica específica da função ou estudo de caso para avaliar suas capacidades."
              },
              final: {
                title: "Entrevista final",
                description: "Reunião com os gestores e membros da equipe para discutir colaboração e próximos passos."
              }
            }
          },
          currentOpenings: {
            loadingText: "Carregando vagas...",
            generalApplicationText: "Não encontrou a vaga ideal? Estamos sempre em busca de talentos.",
            submitGeneralApplication: "Enviar candidatura geral"
          }
        },
        blog: {
          title: "Artigos Mais Recentes",
          description: "Percepções técnicas e novidades do setor da nossa equipe de especialistas."
        },
        contact: {
          officesTitle: "Nossos Escritórios Globais",
          officesDescription: "Com locais em todo o mundo, estamos sempre perto de você. Encontre o escritório CBM mais próximo para suporte e serviços locais.",
          formTitle: "Envie-nos uma mensagem",
          formDescription: "Preencha o formulário abaixo e nossos especialistas retornarão em até 24 horas.",
          supportTitle: "Obter suporte direto",
          supportDescription: "Prefere falar diretamente? Nossa equipe de suporte ao cliente está disponível para ajudar com dúvidas imediatas e solicitações urgentes.",
          supportPhoneTitle: "Suporte por telefone",
          supportPhoneDesc: "Fale com nossa equipe de atendimento",
          supportPhoneHours: "Seg-Sex: 8:00 - 18:00 (EST)",
          supportEmailTitle: "Suporte por e-mail",
          supportEmailDesc: "Envie dúvidas detalhadas e documentação",
          supportEmailResponse: "Resposta em até 24 horas",
          supportEmergencyTitle: "Suporte de emergência",
          supportEmergencyDesc: "Suporte 24/7 para questões urgentes de certificação",
          supportEmergencyNote: "Disponível 24/7 para emergências",
          responseGuaranteeTitle: "Garantia de resposta rápida",
          responsePhone: "Ligações atendidas em até 3 toques",
          responseEmail: "Respostas por e-mail em até 24 horas",
          responseQuote: "Solicitações de cotação processadas em até 48 horas",
          labels: {
            firstName: "Nome *",
            lastName: "Sobrenome *",
            email: "Endereço de e-mail *",
            phone: "Número de telefone",
            company: "Empresa *",
            industry: "Indústria",
            service: "Serviço necessário",
            message: "Mensagem *",
            consent: "Concordo que a CBM processe meus dados pessoais para responder à minha solicitação. Entendo que posso retirar o consentimento a qualquer momento."
          },
          placeholders: {
            firstName: "João",
            lastName: "Silva",
            email: "joao.silva@empresa.com",
            phone: "+55 (11) 1234-5678",
            company: "Nome da sua empresa",
            selectIndustry: "Selecionar indústria",
            selectService: "Selecionar serviço",
            message: "Descreva seus requisitos, prazos e dúvidas específicas..."
          },
          cta: {
            send: "Enviar mensagem",
            sending: "Enviando..."
          }
        },
      },
      services: {
        completeServicePortfolio: {
          heading: "Portfólio Completo de Serviços",
          subheading: "Desde testes de produtos até conformidade regulatória, fornecemos soluções abrangentes para ajudá-lo a ter sucesso nos mercados globais.",
        },
        servicesList: [
          {
            id: 1,
            title: "Testes (T)",
            description: "Serviços abrangentes de teste para validar segurança, desempenho e conformidade.",
            icon: "Search",
            link: "/services/testing",
            imageUrl: "/testing-inspection-bg.jpg",
            features: [
              "Testes não destrutivos",
              "Desempenho e confiabilidade",
              "Conformidade com padrões",
            ]
          },
          {
            id: 2,
            title: "Monitoramento Baseado em Condição (CBM)",
            description: "Manutenção preditiva usando análise, sensores e diagnósticos para reduzir tempo de inatividade.",
            icon: "Settings",
            link: "/services/cbm",
            features: [
              "Análise de vibração e acústica",
              "Termografia e análise de óleo",
              "Dashboards de saúde de ativos",
            ]
          },
          {
            id: 3,
            title: "Inspeção (I)",
            description: "Serviços de inspeção independentes garantindo qualidade e aderência regulatória.",
            icon: "Shield",
            link: "/services/inspection",
            features: [
              "Inspeção de terceiros",
              "Vigilância de fornecedores",
              "Auditorias de site e fábrica",
            ]
          },
          {
            id: 4,
            title: "Auditoria (A)",
            description: "Auditorias de processo, fornecedor e sistema para identificar riscos e impulsionar melhorias.",
            icon: "FileText",
            link: "/services/auditing",
            features: [
              "Auditorias de fornecedores",
              "Revisões de capacidade de processo",
              "Análise de lacunas de conformidade",
            ]
          },
          {
            id: 5,
            title: "Verificação e Certificação (VC)",
            description: "Serviços de verificação e certificação para demonstrar confiança e conformidade.",
            icon: "Award",
            link: "/services/verification-certification",
            features: [
              "Sistemas de gestão",
              "Certificação de produtos",
              "Aprovações regulatórias",
            ]
          },
          {
            id: 6,
            title: "Inovação e P&D",
            description: "Soluções de próxima geração alimentadas por IoT, IA, Robótica e tecnologias Indústria 4.0.",
            icon: "Brain",
            link: "/services/innovation-rd",
            features: [
              "Monitoramento IoT e IA",
              "Inspeção robótica",
              "Tecnologia de gêmeo digital",
            ]
          },
        ]
      },
      industryStats: [
        {
          number: "72+",
          label: "Países Atendidos",
          description: "Presença global com expertise local"
        },
        {
          number: "7,000+",
          label: "Especialistas no Mundo",
          description: "Profissionais altamente qualificados"
        },
        {
          number: "25+",
          label: "Laboratórios de Teste",
          description: "Instalações de última geração"
        },
        {
          number: "33",
          label: "Anos de Excelência",
          description: "Confiável desde 1992"
        }
      ],
    },
  
    es: {
      navbar: {
        services: "Servicios",
        industries: "Industrias",
        about: "Acerca de",
        careers: "Carreras",
        blog: "Blog",
        contact: "Contacto",
        getQuote: "Obtener Cotización",
        contactUs: "Contáctenos",
      },
      footer: {
        company: "CBM",
        description:
          "Proveedor líder de servicios de prueba, inspección, certificación y asesoría. Comprometido con la seguridad, la protección y la sostenibilidad en todo el mundo.",
        services: {
          title: "Servicios",
          list: [
            "Pruebas & Certificación",
            "Servicios de Inspección",
            "Auditoría & Evaluación",
            "Capacitación & Educación",
            "Soluciones Digitales",
            "Servicios de Consultoría",
          ],
        },
        industries: {
          title: "Industrias",
          list: [
            "Automotriz",
            "Salud & Médico",
            "Energía & Utilidades",
            "Manufactura",
            "Construcción",
            "Alimentos & Agricultura",
          ],
        },
        contact: {
          title: "Contacto",
          address: "CBM 360 TIV – UK\n79 Denyer St, London SW3 2NY, UK",
          phone: "+44 7934 980214",
          email: "Support@cbm360tiv.com\ninfo@cbm360tiv.com",
        },
        newsletter: "Mantente Actualizado",
        placeholderEmail: "Ingrese su correo electrónico",
      },
      pages: {
        services: {
          hero: {
            title: "Servicios líderes de Pruebas, Inspección y Certificación",
            subtitle: "De confianza en todo el mundo",
            description: "Garantizando la seguridad, la protección y la sostenibilidad en todas las industrias con servicios integrales de prueba, inspección, certificación y asesoría.",
            primaryCTAText: "Explorar Servicios",
            secondaryCTAText: "Obtener Cotización",
          },
        },
        about: {
          title: "Acerca de",
          breadcrumb: {
            home: "Inicio",
            about: "Acerca de"
          },
          loading: "Cargando...",
          error: "Error al cargar contenido"
        },
        careers: {
          title: "Vacantes Actuales",
          description: "Explora emocionantes oportunidades de carrera en nuestra organización global. Encuentra el puesto perfecto para impulsar tu carrera.",
          applyNow: "Postular ahora",
          hiringProcess: {
            title: "Nuestro proceso de contratación",
            description: "Hemos diseñado un proceso transparente, eficiente y centrado en encontrar el ajuste mutuo adecuado.",
            steps: {
              review: {
                title: "Revisión de la solicitud",
                description: "Nuestro equipo de talento revisa tu solicitud y calificaciones en relación con los requisitos del puesto."
              },
              interview: {
                title: "Entrevista inicial",
                description: "Entrevista telefónica o por video para hablar sobre tu experiencia, intereses y encaje con el puesto."
              },
              assessment: {
                title: "Evaluación técnica",
                description: "Evaluación técnica específica del puesto o caso práctico para valorar tus capacidades."
              },
              final: {
                title: "Entrevista final",
                description: "Reúnete con los responsables de contratación y miembros del equipo para hablar de la colaboración y los siguientes pasos."
              }
            }
          },
          currentOpenings: {
            loadingText: "Cargando vacantes...",
            generalApplicationText: "¿No ves el puesto adecuado? Siempre buscamos personas con talento.",
            submitGeneralApplication: "Enviar candidatura general"
          }
        },
        blog: {
          title: "Artículos Recientes",
          description: "Perspectivas técnicas y novedades de la industria de nuestro equipo de expertos."
        },
        contact: {
          officesTitle: "Nuestras Oficinas Globales",
          officesDescription: "Con ubicaciones en todo el mundo, siempre estamos cerca de ti. Encuentra tu oficina CBM más cercana para soporte y servicios locales.",
          formTitle: "Envíanos un mensaje",
          formDescription: "Completa el formulario y nuestros expertos te responderán dentro de 24 horas.",
          supportTitle: "Obtén soporte directo",
          supportDescription: "¿Prefieres hablar directamente? Nuestro equipo de atención está disponible para ayudarte con preguntas inmediatas y solicitudes urgentes.",
          supportPhoneTitle: "Soporte telefónico",
          supportPhoneDesc: "Habla con nuestro equipo de atención al cliente",
          supportPhoneHours: "Lun-Vie: 8:00 - 18:00 (EST)",
          supportEmailTitle: "Soporte por correo",
          supportEmailDesc: "Envía consultas detalladas y documentación",
          supportEmailResponse: "Respuesta dentro de 24 horas",
          supportEmergencyTitle: "Soporte de emergencia",
          supportEmergencyDesc: "Atención 24/7 para problemas urgentes de certificación",
          supportEmergencyNote: "Disponible 24/7 para emergencias",
          responseGuaranteeTitle: "Garantía de respuesta rápida",
          responsePhone: "Llamadas respondidas dentro de 3 timbres",
          responseEmail: "Respuestas por correo dentro de 24 horas",
          responseQuote: "Solicitudes de cotización procesadas dentro de 48 horas",
          labels: {
            firstName: "Nombre *",
            lastName: "Apellido *",
            email: "Correo electrónico *",
            phone: "Número de teléfono",
            company: "Compañía *",
            industry: "Industria",
            service: "Servicio requerido",
            message: "Mensaje *",
            consent: "Acepto que CBM procese mis datos personales para responder a mi consulta. Entiendo que puedo retirar mi consentimiento en cualquier momento."
          },
          placeholders: {
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan.perez@empresa.com",
            phone: "+34 600 000 000",
            company: "Nombre de tu empresa",
            selectIndustry: "Seleccionar industria",
            selectService: "Seleccionar servicio",
            message: "Describe tus requisitos, plazos y preguntas específicas..."
          },
          cta: {
            send: "Enviar mensaje",
            sending: "Enviando..."
          }
        },
      },
      services: {
        completeServicePortfolio: {
          heading: "Portafolio Completo de Servicios",
          subheading: "Desde pruebas de productos hasta cumplimiento regulatorio, proporcionamos soluciones integrales para ayudarle a tener éxito en los mercados globales.",
        },
        servicesList: [
          {
            id: 1,
            title: "Pruebas (T)",
            description: "Servicios integrales de prueba para validar seguridad, rendimiento y cumplimiento.",
            icon: "Search",
            link: "/services/testing",
            imageUrl: "/testing-inspection-bg.jpg",
            features: [
              "Pruebas no destructivas",
              "Rendimiento y confiabilidad",
              "Cumplimiento de estándares",
            ]
          },
          {
            id: 2,
            title: "Monitoreo Basado en Condición (CBM)",
            description: "Mantenimiento predictivo utilizando análisis, sensores y diagnósticos para reducir el tiempo de inactividad.",
            icon: "Settings",
            link: "/services/cbm",
            features: [
              "Análisis de vibración y acústica",
              "Termografía y análisis de aceite",
              "Tableros de salud de activos",
            ]
          },
          {
            id: 3,
            title: "Inspección (I)",
            description: "Servicios de inspección independientes que garantizan calidad y adherencia regulatoria.",
            icon: "Shield",
            link: "/services/inspection",
            features: [
              "Inspección de terceros",
              "Vigilancia de proveedores",
              "Auditorías de sitio y fábrica",
            ]
          },
          {
            id: 4,
            title: "Auditoría (A)",
            description: "Auditorías de proceso, proveedor y sistema para identificar riesgos e impulsar mejoras.",
            icon: "FileText",
            link: "/services/auditing",
            features: [
              "Auditorías de proveedores",
              "Revisiones de capacidad de proceso",
              "Análisis de brechas de cumplimiento",
            ]
          },
          {
            id: 5,
            title: "Verificación y Certificación (VC)",
            description: "Servicios de verificación y certificación para demostrar confianza y cumplimiento.",
            icon: "Award",
            link: "/services/verification-certification",
            features: [
              "Sistemas de gestión",
              "Certificación de productos",
              "Aprobaciones regulatorias",
            ]
          },
          {
            id: 6,
            title: "Innovación y I+D",
            description: "Soluciones de próxima generación impulsadas por IoT, IA, Robótica y tecnologías Industria 4.0.",
            icon: "Brain",
            link: "/services/innovation-rd",
            features: [
              "Monitoreo IoT e IA",
              "Inspección robótica",
              "Tecnología de gemelo digital",
            ]
          },
        ]
      },
      industryStats: [
        {
          number: "72+",
          label: "Países Atendidos",
          description: "Presencia global con experiencia local"
        },
        {
          number: "7,000+",
          label: "Expertos en el Mundo",
          description: "Profesionales altamente calificados"
        },
        {
          number: "25+",
          label: "Laboratorios de Prueba",
          description: "Instalaciones de vanguardia"
        },
        {
          number: "33",
          label: "Años de Excelencia",
          description: "Confiable desde 1992"
        }
      ],
    },
  
    ru: {
      navbar: {
        services: "Услуги",
        industries: "Отрасли",
        about: "О нас",
        careers: "Карьера",
        blog: "Блог",
        contact: "Контакты",
        getQuote: "Получить предложение",
        contactUs: "Свяжитесь с нами",
      },
      footer: {
        company: "CBM",
        description:
          "Ведущий поставщик услуг по тестированию, инспекции, сертификации и консультированию. Привержен безопасности, защите и устойчивости по всему миру.",
        services: {
          title: "Услуги",
          list: [
            "Тестирование и сертификация",
            "Инспекционные услуги",
            "Аудит и оценка",
            "Обучение и образование",
            "Цифровые решения",
            "Консалтинговые услуги",
          ],
        },
        industries: {
          title: "Отрасли",
          list: [
            "Автомобильная промышленность",
            "Здравоохранение и медицина",
            "Энергетика и коммунальные услуги",
            "Производство",
            "Строительство",
            "Продовольствие и сельское хозяйство",
          ],
        },
        contact: {
          title: "Контакты",
          address: "CBM 360 TIV – UK\n79 Denyer St, London SW3 2NY, UK",
          phone: "+44 7934 980214",
          email: "Support@cbm360tiv.com\ninfo@cbm360tiv.com",
        },
        newsletter: "Будьте в курсе",
        placeholderEmail: "Введите ваш email",
      },
      pages: {
        services: {
          hero: {
            title: "Ведущие услуги по тестированию, инспекции и сертификации",
            subtitle: "Доверие по всему миру",
            description: "Обеспечение безопасности, надежности и устойчивого развития в различных отраслях благодаря комплексным услугам по тестированию, инспекции, сертификации и консультированию.",
            primaryCTAText: "Изучить услуги",
            secondaryCTAText: "Получить предложение",
          },
        },
        about: {
          title: "О нас",
          breadcrumb: {
            home: "Главная",
            about: "О нас"
          },
          loading: "Загрузка...",
          error: "Ошибка загрузки контента"
        },
        careers: {
          title: "Актуальные вакансии",
          description: "Изучите интересные карьерные возможности в нашей глобальной организации. Найдите идеальную роль для развития вашей карьеры.",
          applyNow: "Подать заявку",
          hiringProcess: {
            title: "Наш процесс найма",
            description: "Мы разработали прозрачный и эффективный процесс, нацеленный на поиск взаимного соответствия.",
            steps: {
              review: {
                title: "Рассмотрение заявки",
                description: "Наша команда по подбору изучает вашу заявку и квалификацию в соответствии с требованиями роли."
              },
              interview: {
                title: "Первичное интервью",
                description: "Телефонное или видео-интервью для обсуждения вашего опыта, интересов и соответствия роли."
              },
              assessment: {
                title: "Техническая оценка",
                description: "Тематическая техническая проверка или кейс для оценки ваших компетенций."
              },
              final: {
                title: "Финальное интервью",
                description: "Встреча с руководителями и членами команды для обсуждения сотрудничества и следующих шагов."
              }
            }
          },
          currentOpenings: {
            loadingText: "Загрузка вакансий...",
            generalApplicationText: "Не нашли подходящую роль? Мы всегда рады талантливым специалистам.",
            submitGeneralApplication: "Отправить общую заявку"
          }
        },
        blog: {
          title: "Последние статьи",
          description: "Технические обзоры и новости отрасли от нашей команды экспертов."
        },
        contact: {
          officesTitle: "Наши офисы по всему миру",
          officesDescription: "С офисами по всему миру мы всегда рядом. Найдите ближайший офис CBM для локальной поддержки и услуг.",
          formTitle: "Отправьте нам сообщение",
          formDescription: "Заполните форму ниже, и наши специалисты свяжутся с вами в течение 24 часов.",
          supportTitle: "Получите прямую поддержку",
          supportDescription: "Предпочитаете поговорить напрямую? Наша служба поддержки готова помочь с оперативными вопросами и срочными запросами.",
          supportPhoneTitle: "Телефонная поддержка",
          supportPhoneDesc: "Свяжитесь с нашей службой поддержки",
          supportPhoneHours: "Пн-Пт: 8:00 - 18:00 (EST)",
          supportEmailTitle: "Поддержка по email",
          supportEmailDesc: "Отправляйте подробные запросы и документы",
          supportEmailResponse: "Ответ в течение 24 часов",
          supportEmergencyTitle: "Экстренная поддержка",
          supportEmergencyDesc: "Круглосуточная поддержка срочных вопросов сертификации",
          supportEmergencyNote: "Доступно 24/7 для экстренных случаев",
          responseGuaranteeTitle: "Гарантия быстрого ответа",
          responsePhone: "Ответ на звонки в течение 3 гудков",
          responseEmail: "Ответ по электронной почте в течение 24 часов",
          responseQuote: "Обработка запросов на расчет в течение 48 часов",
          labels: {
            firstName: "Имя *",
            lastName: "Фамилия *",
            email: "Адрес электронной почты *",
            phone: "Номер телефона",
            company: "Компания *",
            industry: "Отрасль",
            service: "Требуемая услуга",
            message: "Сообщение *",
            consent: "Я согласен на обработку CBM моих персональных данных для ответа на мой запрос. Я понимаю, что могу отозвать согласие в любое время."
          },
          placeholders: {
            firstName: "Иван",
            lastName: "Иванов",
            email: "ivan.ivanov@company.com",
            phone: "+7 (999) 123-45-67",
            company: "Название вашей компании",
            selectIndustry: "Выберите отрасль",
            selectService: "Выберите услугу",
            message: "Опишите ваши требования, сроки и конкретные вопросы..."
          },
          cta: {
            send: "Отправить сообщение",
            sending: "Отправка..."
          }
        },
      },
      services: {
        completeServicePortfolio: {
          heading: "Полный портфель услуг",
          subheading: "От тестирования продуктов до соблюдения нормативных требований, мы предоставляем комплексные решения для успеха на глобальных рынках.",
        },
        servicesList: [
          {
            id: 1,
            title: "Тестирование (T)",
            description: "Комплексные услуги тестирования для проверки безопасности, производительности и соответствия требованиям.",
            icon: "Search",
            link: "/services/testing",
            imageUrl: "/testing-inspection-bg.jpg",
            features: [
              "Неразрушающий контроль",
              "Производительность и надежность",
              "Соответствие стандартам",
            ]
          },
          {
            id: 2,
            title: "Мониторинг по состоянию (CBM)",
            description: "Предиктивное обслуживание с использованием аналитики, датчиков и диагностики для снижения простоев.",
            icon: "Settings",
            link: "/services/cbm",
            features: [
              "Анализ вибрации и акустики",
              "Термография и анализ масла",
              "Панели состояния активов",
            ]
          },
          {
            id: 3,
            title: "Инспекция (I)",
            description: "Независимые инспекционные услуги, обеспечивающие качество и соблюдение нормативных требований.",
            icon: "Shield",
            link: "/services/inspection",
            features: [
              "Инспекция третьей стороной",
              "Надзор за поставщиками",
              "Аудит площадок и заводов",
            ]
          },
          {
            id: 4,
            title: "Аудит (A)",
            description: "Аудит процессов, поставщиков и систем для выявления рисков и стимулирования улучшений.",
            icon: "FileText",
            link: "/services/auditing",
            features: [
              "Аудит поставщиков",
              "Обзор производственных возможностей",
              "Анализ пробелов в соответствии",
            ]
          },
          {
            id: 5,
            title: "Верификация и Сертификация (VC)",
            description: "Услуги верификации и сертификации для демонстрации доверия и соответствия требованиям.",
            icon: "Award",
            link: "/services/verification-certification",
            features: [
              "Системы менеджмента",
              "Сертификация продукции",
              "Регуляторные одобрения",
            ]
          },
          {
            id: 6,
            title: "Инновации и НИОКР",
            description: "Решения следующего поколения на основе IoT, ИИ, робототехники и технологий Индустрии 4.0.",
            icon: "Brain",
            link: "/services/innovation-rd",
            features: [
              "Мониторинг IoT и ИИ",
              "Роботизированная инспекция",
              "Технология цифрового двойника",
            ]
          },
        ]
      },
      industryStats: [
        {
          number: "72+",
          label: "Обслуживаемые Страны",
          description: "Глобальное присутствие с местной экспертизой"
        },
        {
          number: "7,000+",
          label: "Экспертов по Миру",
          description: "Высококвалифицированные специалисты"
        },
        {
          number: "25+",
          label: "Испытательных Лабораторий",
          description: "Современные объекты"
        },
        {
          number: "33",
          label: "Лет Совершенства",
          description: "Доверие с 1992 года"
        }
      ],
    },

    zh: {
      navbar: {
        services: "服务",
        industries: "行业",
        about: "关于",
        careers: "职业发展",
        blog: "博客",
        contact: "接触",
        getQuote: "获取报价",
        contactUs: "联系我们",
      },
      footer: {
        company: "煤层气",
        description:
          "领先的测试、检验、认证和咨询服务提供商。致力于全球安全、保障和可持续发展。",
        services: {
          title: "服务",
          list: [
            "测试与认证",
            "检验服务",
            "审计与评估",
            "培训与教育",
            "数字解决方案",
            "咨询服务",
          ],
        },
        industries: {
          title: "行业",
          list: [
            "汽车",
            "医疗保健",
            "能源与公用事业",
            "制造业",
            "建造",
            "食品和农业",
          ],
        },
        contact: {
          title: "接触",
          address: "CBM 360 TIV – UK\n79 Denyer St, London SW3 2NY, UK",
          phone: "+44 7934 980214",
          email: "Support@cbm360tiv.com\ninfo@cbm360tiv.com",
        },
        newsletter: "保持更新",
        placeholderEmail: "输入您的电子邮件",
      },
      pages: {
        services: {
          hero: {
            title: "领先的测试、检验和认证服务",
            subtitle: "全球信赖",
            description:
              "通过全面的测试、检验、认证和咨询服务确保各行业的安全、保障和可持续性。",
            primaryCTAText: "探索服务",
            secondaryCTAText: "获取报价",
          },
        },
        about: {
          title: "关于",
          breadcrumb: {
            home: "家",
            about: "关于",
          },
          loading: "加载中...",
          error: "内容加载失败",
        },
        careers: {
          title: "当前职位空缺",
          description:
            "探索我们全球组织中激动人心的职业发展机会。找到理想的职位，助您职业发展。",
          applyNow: "立即申请",
          hiringProcess: {
            title: "我们的招聘流程",
            description:
              "我们设计的流程透明、高效，并专注于寻找合适的相互契合点。",
            steps: {
              review: {
                title: "申请审核",
                description:
                  "我们的人才团队将根据职位要求审核您的申请和资格。",
              },
              interview: {
                title: "初次面试",
                description:
                  "通过电话或视频面试来讨论您的背景、兴趣以及是否适合该职位。",
              },
              assessment: {
                title: "技术评估",
                description:
                  "特定角色的技术评估或案例研究来评估您的能力。",
              },
              final: {
                title: "最终面试",
                description:
                  "与招聘经理和团队成员会面，讨论合作和后续步骤。",
              },
            },
          },
          currentOpenings: {
            loadingText: "正在加载职业...",
            generalApplicationText:
              "没有找到合适的职位？我们一直在寻找有才华的人才。",
            submitGeneralApplication: "提交通用申请",
          },
        },
        blog: {
          title: "最新文章",
          description: "来自我们专家团队的技术见解和行业更新。",
        },
        contact: {
          officesTitle: "我们的全球办事处",
          officesDescription:
            "我们在全球各地设有办事处，随时为您提供服务。查找您附近的 CBM 办事处，获取本地支持和服务。",
          formTitle: "给我们留言",
          formDescription:
            "填写下面的表格，我们的专家将在 24 小时内回复您。",
          supportTitle: "获得直接支持",
          supportDescription:
            "想直接联系？我们的客户支持团队随时准备解答您的紧急问题和请求。",
          supportPhoneTitle: "电话支持",
          supportPhoneDesc: "与我们的客户服务团队联系",
          supportPhoneHours: "周一至周五：上午 8:00 - 下午 6:00（东部标准时间）",
          supportEmailTitle: "电子邮件支持",
          supportEmailDesc: "发送详细的询问和文件",
          supportEmailResponse: "24小时内回复",
          supportEmergencyTitle: "紧急支援",
          supportEmergencyDesc: "全天候支持紧急认证问题",
          supportEmergencyNote: "全天候提供紧急服务",
          responseGuaranteeTitle: "快速响应保证",
          responsePhone: "电话咨询在 3 声响铃内得到答复",
          responseEmail: "24小时内回复电子邮件",
          responseQuote: "报价请求在 48 小时内处理",
          labels: {
            firstName: "名 *",
            lastName: "姓 *",
            email: "电子邮件地址 *",
            phone: "电话号码",
            company: "公司 *",
            industry: "行业",
            service: "需要服务",
            message: "信息 *",
            consent:
              "我同意 CBM 处理我的个人数据以回复我的咨询。我理解我可以随时撤回同意。",
          },
          placeholders: {
            firstName: "约翰",
            lastName: "多伊",
            email: "john.doe@company.com",
            phone: "+44 7934 980214",
            company: "您的公司名称",
            selectIndustry: "选择行业",
            selectService: "选择服务",
            message: "请描述您的要求、时间表以及任何具体问题……",
          },
          cta: {
            send: "发送消息",
            sending: "正在发送...",
          },
        },
      },
      services: {
        completeServicePortfolio: {
          heading: "完整的服务组合",
          subheading:
            "从产品测试到法规遵从，我们提供全面的解决方案，帮助您在全球市场取得成功。",
        },
        servicesList: [
          {
            id: 1,
            title: "测试（T）",
            description: "全面的测试服务，以验证安全性、性能和合规性。",
            icon: "Search",
            link: "/services/testing",
            imageUrl: "/测试检查-bg.jpg",
            features: [
              "无损检测",
              "性能和可靠性",
              "标准合规性",
            ],
          },
          {
            id: 2,
            title: "基于状态的监测（CBM）",
            description:
              "使用分析、传感器和诊断进行预测性维护以减少停机时间。",
            icon: "Settings",
            link: "/services/cbm",
            features: [
              "振动和声学分析",
              "热成像和油分析",
              "资产健康仪表板",
            ],
          },
          {
            id: 3,
            title: "检查（一）",
            description: "独立检验服务确保质量和法规遵守。",
            icon: "Shield",
            link: "/services/inspection",
            features: [
              "第三方检验",
              "供应商监控",
              "现场和工厂审核",
            ],
          },
          {
            id: 4,
            title: "审计（A）",
            description:
              "流程、供应商和系统审计，以识别风险并推动改进。",
            icon: "FileText",
            link: "/services/auditing",
            features: [
              "供应商审核",
              "过程能力评审",
              "合规差距分析",
            ],
          },
          {
            id: 5,
            title: "验证与认证（VC）",
            description: "验证和认证服务以证明信任和合规性。",
            icon: "Award",
            link: "/services/verification-certification",
            features: [
              "管理系统",
              "产品认证",
              "监管部门批准",
            ],
          },
          {
            id: 6,
            title: "创新与研发",
            description:
              "由物联网、人工智能、机器人和工业 4.0 技术支持的下一代解决方案。",
            icon: "Brain",
            link: "/services/innovation-rd",
            features: [
              "物联网和人工智能监控",
              "机器人检查",
              "数字孪生技术",
            ],
          },
        ],
      },
      industryStats: [
        {
          number: "72岁以上",
          label: "服务国家",
          description: "拥有本地专业知识的全球影响力",
        },
        {
          number: "7,000+",
          label: "全球专家",
          description: "高素质的专业人员",
        },
        {
          number: "25岁以上",
          label: "测试实验室",
          description: "最先进的设施",
        },
        {
          number: "33",
          label: "多年的卓越成就",
          description: "自 1992 年以来值得信赖",
        },
      ],
    },
  };
  
  module.exports = translations;

