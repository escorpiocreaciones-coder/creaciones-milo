window.STORE_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'cajitas', label: 'Cajitas' },
  { id: 'carteles', label: 'Carteles' },
  { id: 'peluches', label: 'Peluches' },
  { id: 'libros', label: 'Libros digitales' },
  { id: 'combos', label: 'Combos' }
];

window.PRODUCTS = [
  {
    id: 'caja-nuestro-momento',
    name: 'Caja de recuerdos "Nuestro momento"',
    category: 'cajitas',
    lead: 'Una caja llena de fotos, notas y pequeÃ±os detalles.',
    description: 'La favorita para aniversarios y cumpleaÃ±os. Armamos una caja rÃ­gida con sus fotos favoritas, tarjetas escritas a mano y un lazo que la hace inolvidable.',
    price: 185,
    badge: 'MÃ¡s vendida',
    featured: 1,
    palette: ['#743142', '#d58f80', '#f5ddd1', '#c7a05b'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: 'Mediana', price: 0 },
          { label: 'Grande', price: 45 }
        ]
      },
      {
        name: 'acabado',
        label: 'Acabado',
        values: [
          { label: 'ClÃ¡sico', price: 0 },
          { label: 'Premium', price: 25 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres de la pareja', placeholder: 'Ej: Ana & Luis', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha especial', type: 'date' },
      { name: 'mensaje', label: 'Mensaje o dedicatoria', type: 'textarea', placeholder: 'Escribe algo que quieras incluir dentro de la caja', maxlength: 240 }
    ],
    includes: ['Caja rÃ­gida decorada', '12 fotos impresas', 'Tarjeta con dedicatoria', 'Lazo y detalles decorativos'],
    delivery: 'Lista en 5 a 7 dÃ­as hÃ¡biles.',
    tags: 'aniversario cumpleaÃ±os pareja fotos recuerdos'
  },
  {
    id: 'caja-explosiva-te-amo',
    name: 'Caja explosiva "Te amo"',
    category: 'cajitas',
    lead: 'Se abre y despliega fotos, mensajes y sorpresas.',
    description: 'Una sorpresa que se despliega frente a sus ojos. Cada solapa lleva una foto y una frase, y el centro guarda un mensaje especial para esa persona.',
    price: 220,
    badge: 'Sorpresa',
    featured: 2,
    palette: ['#a93e57', '#ee9aa6', '#fbe2e3', '#d2a14e'],
    options: [
      {
        name: 'fotos',
        label: 'Cantidad de fotos',
        values: [
          { label: '12 fotos', price: 0 },
          { label: '24 fotos', price: 35 }
        ]
      },
      {
        name: 'color',
        label: 'Paleta',
        values: [
          { label: 'Rosa', price: 0 },
          { label: 'Vino', price: 0 },
          { label: 'Terracota', price: 0 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres de la pareja', placeholder: 'Ej: MarÃ­a & JosÃ©', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha especial', type: 'date' },
      { name: 'mensaje', label: 'Mensaje central', type: 'textarea', placeholder: 'El mensaje que verÃ¡ al abrir la caja', maxlength: 240 }
    ],
    includes: ['Caja explosiva armada', 'Fotos en cada solapa', 'Mensajes personalizados', 'DecoraciÃ³n en la paleta elegida'],
    delivery: 'Lista en 5 a 7 dÃ­as hÃ¡biles.',
    tags: 'sorpresa explosiva amor aniversario fotos'
  },
  {
    id: 'caja-acrilica-floral',
    name: 'Caja acrÃ­lica floral',
    category: 'cajitas',
    lead: 'Elegancia floral con una foto y un mensaje para siempre.',
    description: 'Una pieza decorativa para mesa de noche o escritorio. Combinamos acrÃ­lico, flores preservadas y una foto impresa en alta calidad con un mensaje grabado.',
    price: 150,
    featured: 5,
    palette: ['#83664d', '#ddb99d', '#fbf0e5', '#b8875d'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: 'PequeÃ±a', price: 0 },
          { label: 'Mediana', price: 30 }
        ]
      },
      {
        name: 'flores',
        label: 'Flores',
        values: [
          { label: 'Rosas', price: 0 },
          { label: 'Mixtas', price: 12 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres', placeholder: 'Ej: SofÃ­a & Daniel', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha especial', type: 'date' },
      { name: 'mensaje', label: 'Frase corta', type: 'textarea', placeholder: 'Una frase breve para acompaÃ±ar la foto', maxlength: 120 }
    ],
    includes: ['Caja de acrÃ­lico', 'Foto impresa', 'Flores preservadas', 'Mensaje en vinilo'],
    delivery: 'Lista en 4 a 6 dÃ­as hÃ¡biles.',
    tags: 'acrilico flores foto elegante aniversario'
  },
  {
    id: 'cartel-madera-nombres',
    name: 'Cartel de madera grabado',
    category: 'carteles',
    lead: 'Nombres, fecha y un corazÃ³n grabados en madera.',
    description: 'Un cartel cÃ¡lido para celebrar una boda, aniversario o primer hogar. Lo personalizamos con sus nombres, la fecha y la frase que elijas.',
    price: 120,
    badge: 'Hecho a mano',
    featured: 4,
    palette: ['#644634', '#c99b6c', '#f4e5d2', '#9c704b'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: '20 x 15 cm', price: 0 },
          { label: '30 x 20 cm', price: 40 }
        ]
      },
      {
        name: 'madera',
        label: 'Tono de madera',
        values: [
          { label: 'Natural', price: 0 },
          { label: 'Nogal', price: 0 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres', placeholder: 'Ej: Ana & Luis', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha', type: 'date' },
      { name: 'frase', label: 'Frase', placeholder: 'Ej: Nuestro hogar, nuestra historia', maxlength: 90 }
    ],
    includes: ['Base de madera', 'Grabado personalizado', 'Soporte para mesa', 'Empaque de regalo'],
    delivery: 'Listo en 3 a 5 dÃ­as hÃ¡biles.',
    tags: 'madera cartel grabado boda aniversario hogar'
  },
  {
    id: 'cartel-acrilico-corazon',
    name: 'Cartel acrÃ­lico corazÃ³n',
    category: 'carteles',
    lead: 'Un corazÃ³n transparente con su foto y sus nombres.',
    description: 'Un detalle moderno y luminoso. El acrÃ­lico deja ver la foto y el mensaje desde cualquier Ã¡ngulo, con una base de madera para colocarlo donde quieras.',
    price: 145,
    palette: ['#7a4f59', '#e5b8b1', '#fff5f2', '#c49a5a'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: '15 cm', price: 0 },
          { label: '22 cm', price: 35 }
        ]
      },
      {
        name: 'base',
        label: 'Base',
        values: [
          { label: 'Madera', price: 0 },
          { label: 'AcrÃ­lico', price: 18 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres', placeholder: 'Ej: Valeria & AndrÃ©s', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha', type: 'date' },
      { name: 'mensaje', label: 'Mensaje', type: 'textarea', placeholder: 'Una frase corta', maxlength: 120 }
    ],
    includes: ['CorazÃ³n de acrÃ­lico', 'Foto impresa', 'Base decorativa', 'Empaque de regalo'],
    delivery: 'Listo en 3 a 5 dÃ­as hÃ¡biles.',
    tags: 'acrilico corazon cartel foto pareja moderno'
  },
  {
    id: 'peluche-personalizado',
    name: 'Peluche con camiseta personalizada',
    category: 'peluches',
    lead: 'Un abrazo suave con su nombre o una frase especial.',
    description: 'Elegimos un peluche suave y le agregamos una camiseta con el nombre, la fecha o esa frase que solo ustedes entienden.',
    price: 160,
    featured: 3,
    palette: ['#875b45', '#d7a27d', '#f6e2cf', '#b6756b'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: '25 cm', price: 0 },
          { label: '35 cm', price: 50 }
        ]
      },
      {
        name: 'color',
        label: 'Color',
        values: [
          { label: 'CafÃ©', price: 0 },
          { label: 'Blanco', price: 0 },
          { label: 'Rosa', price: 0 }
        ]
      }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre o frase para la camiseta', placeholder: 'Ej: Para mi amor', required: true, maxlength: 40 },
      { name: 'mensaje', label: 'Mensaje para la tarjeta', type: 'textarea', placeholder: 'Un mensaje corto', maxlength: 160 }
    ],
    includes: ['Peluche suave', 'Camiseta personalizada', 'Tarjeta dedicatoria', 'Bolsa de regalo'],
    delivery: 'Listo en 4 a 6 dÃ­as hÃ¡biles.',
    tags: 'peluche oso camiseta nombre abrazo regalo'
  },
  {
    id: 'peluche-gigante',
    name: 'Peluche gigante con mensaje',
    category: 'peluches',
    lead: 'El abrazo mÃ¡s grande para una sorpresa inolvidable.',
    description: 'Un peluche de gran tamaÃ±o con una cinta y un mensaje bordado o impreso. Ideal para cumpleaÃ±os, aniversarios o para pedir perdÃ³n con estilo.',
    price: 250,
    badge: 'Abrazo XL',
    palette: ['#6c4a3a', '#c98f6b', '#f1d5c3', '#9d5b55'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: '50 cm', price: 0 },
          { label: '70 cm', price: 120 }
        ]
      },
      {
        name: 'detalle',
        label: 'Detalle',
        values: [
          { label: 'Cinta con mensaje', price: 0 },
          { label: 'CorazÃ³n bordado', price: 20 }
        ]
      }
    ],
    fields: [
      { name: 'nombre', label: 'Para quiÃ©n es', placeholder: 'Ej: Para mi princesa', required: true, maxlength: 40 },
      { name: 'mensaje', label: 'Mensaje', type: 'textarea', placeholder: 'Escribe el mensaje que llevarÃ¡ el peluche', maxlength: 160 }
    ],
    includes: ['Peluche de gran tamaÃ±o', 'Mensaje personalizado', 'Cinta decorativa', 'Entrega coordinada'],
    delivery: 'Listo en 5 a 7 dÃ­as hÃ¡biles.',
    tags: 'peluche gigante grande oso regalo sorpresa'
  },
  {
    id: 'libro-digital',
    name: 'Libro digital de fotos',
    category: 'libros',
    lead: 'Su historia en un enlace privado, con fotos y mensajes.',
    description: 'Un libro web privado que se abre como una historia. Elegimos juntos las fotos, los textos y la canciÃ³n; el resultado es un enlace que pueden guardar y volver a ver cuando quieran.',
    price: 99,
    badge: 'Nuevo',
    featured: 0,
    palette: ['#5b3a4a', '#c98c9a', '#f7e7e6', '#c9a15a'],
    options: [
      {
        name: 'paginas',
        label: 'Cantidad de pÃ¡ginas',
        values: [
          { label: '10 pÃ¡ginas', price: 0 },
          { label: '20 pÃ¡ginas', price: 40 },
          { label: '30 pÃ¡ginas', price: 80 }
        ]
      },
      {
        name: 'entrega',
        label: 'Formato',
        values: [
          { label: 'Enlace privado', price: 0 },
          { label: 'Enlace + PDF', price: 20 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres de la pareja', placeholder: 'Ej: Ana & Luis', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha especial', type: 'date' },
      { name: 'mensaje', label: 'Mensaje principal', type: 'textarea', placeholder: 'La frase que quieres que aparezca en la portada o en la Ãºltima pÃ¡gina', maxlength: 240 },
      { name: 'musica', label: 'Enlace de YouTube o Spotify', type: 'url', placeholder: 'Opcional: pega el enlace de su canciÃ³n', maxlength: 300 }
    ],
    includes: ['Enlace privado', 'DiseÃ±o responsive', 'Fotos y mensajes', 'CanciÃ³n opcional'],
    delivery: 'Listo en 48 a 72 horas despuÃ©s de recibir el material.',
    tags: 'libro digital fotos pareja aniversario web enlace'
  },
  {
    id: 'combo-caja-peluche',
    name: 'Combo caja + peluche',
    category: 'combos',
    lead: 'Dos sorpresas en una sola entrega.',
    description: 'La combinaciÃ³n perfecta: una caja de recuerdos personalizada y un peluche con mensaje. Coordinamos los colores para que todo se vea como un solo regalo.',
    price: 300,
    badge: 'Ahorra â‚¡4 000',
    featured: 6,
    palette: ['#7c3046', '#d9867a', '#f6ddd0', '#c79a56'],
    options: [
      {
        name: 'peluche',
        label: 'Peluche',
        values: [
          { label: '25 cm', price: 0 },
          { label: '35 cm', price: 50 }
        ]
      },
      {
        name: 'caja',
        label: 'Caja',
        values: [
          { label: 'Mediana', price: 0 },
          { label: 'Grande', price: 40 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres de la pareja', placeholder: 'Ej: Camila & Diego', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha especial', type: 'date' },
      { name: 'mensaje', label: 'Mensaje', type: 'textarea', placeholder: 'El mensaje para la caja y el peluche', maxlength: 240 }
    ],
    includes: ['Caja de recuerdos', 'Peluche personalizado', 'Tarjeta dedicatoria', 'Empaque combinado'],
    delivery: 'Listo en 6 a 8 dÃ­as hÃ¡biles.',
    tags: 'combo caja peluche regalo pareja aniversario'
  },
  {
    id: 'caja-primera-cita',
    name: 'Caja "Nuestra primera cita"',
    category: 'cajitas',
    lead: 'Un viaje a ese primer momento que cambiÃ³ todo.',
    description: 'Recreamos su primera cita en una caja: entradas, fotos, dulces y esos detalles que les recuerdan dÃ³nde empezÃ³ su historia.',
    price: 200,
    palette: ['#5e4a3a', '#c99c7a', '#f3e3d2', '#b36b5c'],
    options: [
      {
        name: 'tamano',
        label: 'TamaÃ±o',
        values: [
          { label: 'Mediana', price: 0 },
          { label: 'Grande', price: 40 }
        ]
      },
      {
        name: 'tematica',
        label: 'TemÃ¡tica',
        values: [
          { label: 'Cine', price: 0 },
          { label: 'CafÃ©', price: 0 },
          { label: 'Playa', price: 0 }
        ]
      }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres', placeholder: 'Ej: LucÃ­a & Marco', required: true, maxlength: 60 },
      { name: 'fecha', label: 'Fecha de la primera cita', type: 'date' },
      { name: 'mensaje', label: 'Recuerdo o mensaje', type: 'textarea', placeholder: 'CuÃ©ntanos quÃ© quieres recordar de ese dÃ­a', maxlength: 240 }
    ],
    includes: ['Caja temÃ¡tica', 'Fotos y recuerdos', 'Detalles comestibles', 'Tarjeta personalizada'],
    delivery: 'Lista en 5 a 7 dÃ­as hÃ¡biles.',
    tags: 'primera cita recuerdos cine cafe playa aniversario'
  }
];

