// TODO fetch this lazily when async await is ready
export const articles = [
  {
    id: 0,
    type: 'article',
    title: 'A Practical Approach',
    description: 'Content coming soon',
    teaser: 'read more',
    read: false,
    preview: true,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    id: 1,
    type: 'article',
    title: 'Keep Learning Free',
    description: 'Content coming soon',
    teaser: 'read more',
    read: false,
    preview: true,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    id: 2,
    type: 'article',
    title: 'Contributors & Curators',
    description: 'Content coming soon',
    teaser: 'read more',
    read: false,
    preview: true,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    id: 3,
    type: 'article',
    title: 'Start Learning',
    description: 'Content coming soon',
    teaser: 'read more',
    read: false,
    preview: true,
    markdown: './-utils/md/articles/foo.md'
  }
];

export const resume = [
  {
    id: 4,
    type: 'resume',
    employer: 'Ally Financial',
    tenure: '2013 - Present',
    titles: ['Senior Software Engineer', '+ Application Architect'],
    technologies: [
      'Vanilla JavaScript ES5/6/7',
      'Node',
      'Ember/Ember-Data/Ember-Engines',
      'QUnit',
      'REST API',
      'Handlebars',
      'Sass',
      'Git CLI',
      'Github Enterprise',
      'Bitbucket Enterprise'
    ],
    company: 'A Leader in Digital Financial Services. The Ally Online Services web application has over 1 million active users',
    overview: 'Architecting and engineering software infrastructure for various enterprise web applications that make up Ally Online Services. Project Lead responsible for oversight and code-review of first party, third party, and off-shore engineers and developers. Teaching repeatable patterns, intelligent abstractions, and best practices. Responsibilities for overall applications stability, maintainability, and scalability.',
    leadership: [
      'Project leadership',
      'Architecting and Solutioning',
      'Project and Timeline Management',
      'Live coding reviews with off-shore teams, and staff augmentation teams',
      'Oversight and live code review of third party feature contributors',
      'Peer code review',
      'Mentoring and Education',
      'Spearheading Open Source Initiatives'
    ],
    bubblesTitle: 'Core contributor on:',
    bubbles: [
      {
        id: 0,
        path: '#!/about/resume/ally/bubbles/0',
        text: 'Custom<br>Charts',
        size: 'small',
        description:'<h1 class="title is-5"><small>2013</small> &nbsp;Custom charts and graphs with real-time feedback</h1> <ul> <li>Two way binding with the burgeoning Ember 0.X</li><li>An island implementation of Ember (pre ember-islands)</li><li>Pure CSS bar charts</li><li>Vanilla JS line graphs (due to dependency limitations)</li></ul>'
      },
      {
        id: 1,
        path: '#!/about/resume/ally/bubbles/1',
        text: 'Single Page<br>Mobile Site',
        size: 'medium',
        description:'<h1 class="title is-5"><small>2014</small> &nbsp;Single page mobile website</h1> <ul> <li>Routing implementation with Javascript and Apache</li><li>Leveraging/reusing existing desktop components</li><li>Google Maps API implementation (ATM locator)</li><li>Framework free (due to dependency limitations)</li></ul>'
      },
      {
        id: 2,
        path: '#!/about/resume/ally/bubbles/2',
        text: 'Homepage<br>Login Access',
        size: 'small',
        description:'<h1 class="title is-5"><small>2015</small> &nbsp;Homepage Login Widget</h1> <ul> <li>Authored Vanilla JS application micro-framework (due to dependency limitations)</li><li>Custom validation</li><li>Custom component state</li><li>Rudimentary Promise aware component rendering</li></ul>'
      },
      {
        id: 4,
        path: '#!/about/resume/ally/bubbles/3',
        text: 'Authentication<br>Protocol Re-write',
        size: 'large',
        description: '<h1 class="title is-5"><small>2016</small> &nbsp;Authentication Protocol Re-write</h1> <ul> <li>Multi-factor flows (with dozens of edge cases)</li><li>Custom adapter, serializer (endpoints were too overloaded for ember-data)</li><li>Intelligent routing and redirects</li><li>Re-usable client micro-services to perform auth related tasks</li><li>Secure third-party post-authentication hand-off</li><li>Modularization (in progress)</li></ul>'
      },
      {
        id: 5,
        path: '#!/about/resume/ally/bubbles/4',
        text: 'Open Source<br>UI Component<br>Library',
        size: 'medium',
        description:'<h1 class="title is-5"><small>2016</small> &nbsp;Open Source UI Component Library</h1> <ul> <li>Composable components</li><li>Stateless and logic-less (dumb)</li><li><a href="http://open-tux.github.io/ember-bulma/" target="_blank">Ember-Bulma</a></li></ul>'
      },
      {
        id: 6,
        path: '#!/about/resume/ally/bubbles/5',
        text: 'Branded UI<br>Component Library',
        size: 'medium',
        description:'<h1 class="title is-5"><small>2016</small> &nbsp;Ally Branded UI Component Library</h1> <ul> <li>Extends open source version</li><li>State-less and State-full (smart) components</li><li>Implementation of living style guide</li></ul>'
      },
      {
        id: 7,
        path: '#!/about/resume/ally/bubbles/6',
        text: 'AOS Dashboard<br>Architecture',
        size: 'x-large',
        description:'<h1 class="title is-5"><small>2016</small> &nbsp;SSO Dashboard Architecture</h1> <ul> <li>Exponential scalability</li><li>Truly de-coupled micro-applications</li><li>Universal UI patterns</li><li>SSO for various lines of business</li><li>Third party services integration</li><li>Universal application metrics</li><li>Simultaneous Responsive and Adaptive designs</li><li>Legacy code integration</li><li>Upgrade and deprecation paths</li><li>Migration to Ember Data</li></ul>'
      },
      {
        id: 8,
        path: '#!/about/resume/ally/bubbles/7',
        text: 'Ember Engines<br>Architecture',
        size: 'medium',
        description:'<h1 class="title is-5"><small>2017</small> &nbspEmber Engines Architecture</h1> <ul> <li>Ember 2.13 compatibility strategy (glimmer rendering)</li><li>Shared dependency audit</li><li>Shared services audit</li></ul>'
      }
    ]
  },
  {
    id: 5,
    type: 'resume',
    employer: 'AM-to-PM Creative',
    tenure: '2008 - 2013',
    titles: ['Founder', '+ Full Stack Engineer', '+ Consultant'],
    technologies: [
      'JavaScript',
      'Node',
      'YUI',
      'ActionScript',
      'PHP',
      'MySQL',
      'AWS',
      'Microsoft SQL',
      'Oracle',
      'Apache',
      'Linux'
    ],
    overview: 'Engineering and consulting with a focus on data driven web applications, platform migrations, intranet/operations applications. Responsible for architectural and strategic consulting, API design/implementation, UX design/development.',
    company: 'Whether it is a start up or a business re-inventing itself, AM-to-PM delivers big agency quality without the bloat.',
    leadership: [
      'Technical Sales',
      'Resource Management',
      'Estimates and Budgeting',
      'Platform training and education'
    ],
    bubblesTitle: 'Projects of Note:',
    bubbles: [
      {
        id: 0,
        path: '#!/about/resume/ampm/bubbles/0',
        text: 'Order Tracking<br>Application',
        size: 'small',
        description:'<h1 class="title is-5"><small>2009</small> &nbsp;Order generation for large sales team</h1> <ul> <li>Automated order form generation</li><li>UI Design/Development</li></ul>'
      },
      {
        id: 1,
        path: '#!/about/resume/ampm/bubbles/1',
        text: 'Claims Management<br>Application',
        size: 'medium',
        description:'<h1 class="title is-5"><small>2010</small> &nbsp;Automation of claims for lost or stolen equipment</h1> <ul><li>Multi-tier Authentication</li><li>Email platform</li><li>Pre-populated claims forms</li><li>Automated inventory auditing</li><li>Automated reports</li></ul>'
      },
      {
        id: 2,
        path: '#!/about/resume/ampm/bubbles/2',
        text: 'Project Management<br>Web Application',
        size: 'large',
        description:'<h1 class="title is-5"><small>2011</small> &nbsp;Project Management Software</h1> <ul><li>Time tracking with stop-watch</li><li>Time sheets</li><li>Authentication</li><li>Gantt display</li><li>Email alerts</li><li>Semi-automated budget tracking</li><li>Internal messaging</li><li>Meeting scheduler</li><li>Automated reporting</li><li>Bug tracking</li></ul>'
      },
      {
        id: 3,
        path: '#!/about/resume/ampm/bubbles/3',
        text: 'Keppler Speakers<br>Search API',
        size: 'x-large',
        description: '<h1 class="title is-5"><small>2012</small> &nbsp;Search API re-write to support large-scale database and platform migration</h1><ul><li>Migration of platform from ASP to PHP</li><li>Aggregation middleware cross-referencing across Microsoft SQL Server and Oracle databases</li><li>Asynchrounous Results and Pagination</li><li>Mobile web implementation</li></li></ul>'
      },
      {
        id: 4,
        path: '#!/about/resume/ampm/bubbles/4',
        text: 'Ecommerce<br>Application',
        size: 'x-large',
        description: '<h1 class="title is-5"><small>2012</small> &nbsp;Etsy clone Ecommerce platform</h1><ul><li>Facebook Auth API</li><li>Custom page and content creation</li><li>Internal messaging</li><li>Search API</li><li>Payment Gateway Implementation</li><li>UX Design</li></ul>'
      }
    ]
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Dakota Group',
    tenure: '2007 - 2008',
    titles: ['Senior UI Developer'],
    overview: 'Lead Developer primarily focused on intranet portals, web-based applications, and kiosk applications.',
    company: 'The Dakota Group is a marketing communications firm, specializing in print and web communications.',
    technologies: [
      'JavaScript',
      'HTML',
      'CSS',
      'ActionScript',
      'PHP'
    ]
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Starwood Hotels',
    tenure: '2005 - 2007',
    titles: ['ActionScript Developer'],
    overview: 'Developed interactive data-driven Flash applications',
    company: 'Starwood Hotels & Resorts and Marriott International are now one company. Marriott International is the world’s leading global hospitality company, with more brands, more hotels and more opportunities for associates to grow and succeed.',
    technologies: [
      'ActionScript',
      'JavaScript',
      'XML'
    ]
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Worx Group',
    tenure: '2004 - 2005',
    titles: ['UI Designer'],
    overview: 'Website, e-commerce and intranet/portal design',
    company: 'The Worx Group is a nationally-recognized brand communications firm, named for a group of marketers who do what worx.',
    technologies: [
      'Photoshop',
      'Dreamweaver',
      'Fireworks',
      'Illustrator'
    ]
  }
];


export const content = [].concat(articles, resume);
