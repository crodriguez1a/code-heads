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
    title: 'Mentorships',
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
    id: 1,
    type: 'resume',
    employer: 'Big Sky Technologies (ServiceChannel)',
    tenure: '2017 - Present',
    titles: ['Full Stack Engineer'],
    technologies: [
      'Python \
      <ul> \
      <li>Django \
      <ul> \
      <li>Django Rest Framework</li> \
      <li>Django ORM (Postgres)</li> \
      <li>Django Stripe Primitives</li> \
      </ul> \
      </li> \
      <li>Celery</li> \
      <li>Boto3</li> \
      <li>Redis Interface</li> \
      </ul>',

      'JavaScript ES5/6/7',
      'Node',

      'Ember <ul> \
      <li>Ember-Simple-Auth</li> \
      <li>Ember-Changeset</li> \
      <li>Ember-Concurrency</li> \
      <li>Corber</li> \
      <li>Ember-QUnit</li> \
      <li>Ember-Page-Object</li> \
      <li>Ember-Native-Dom-Helpers</li> \
      </ul>',

      'AWS <ul> \
      <li>SQS</li> \
      <li>S3</li> \
      </ul>',

      'Sass/Bootstrap',
      'Github Enterprise',
      'Jenkins',
      'Logentries'
    ],
    company: 'Big Sky provides retail management software used by Facilities, Operations, Loss Prevention and IT to better support stores and manage contractors.',
    overview: 'At Big Sky, I was charged with architecting solutions that would solve a unique set of problems including ensuring that the software platform could support notification driven ETL, maintaining data integrity across multiple databases, designing and building first party APIs, integration with various third party APIs, and ORM design.',
    leadership: [
      'Solutions Architecture',
      'API Design',
      'ORM Design',
      'Project Leadership',
      'Project and Timeline Management',
      'Code Pairing',
      'Code Reviews',
      'Mentoring',
    ],
    bubblesTitle: 'Core contributor on:',
    bubbles: [
      {
        id: 0,
        path: '#!/about/resume/ally/bubbles/0',
        text: 'API Proxy<br>Design',
        size: 'medium',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
          <h1 class="title is-5"><small>2017</small> &nbsp;${title}</h1>
          <p>
            One of the challenges of working on a piece software with multiple
            data layers, is the question of API proxying. Our client application
            faces a Django web API for performing CRUD actions on many of its models,
            but in some cases the application would need to transact with other APIs.
          </p>

          <p>
            I was charged with designing solution that would allow a Django view to bypass
            its typical serialization and model validation, and instead borrow those responsibilities
            from a separate web API, as well as proxy a response from the remote view.

            At a high level, the solution was as follows:
          </p>

          <ul>
            <li>
              Decorate the Django View with an API adapter. This decorator would inform
              the view of the following:
              <ul>
                <li>
                  Outgoing:
                  <ul>
                    <li>Authorization for remote requests</li>
                    <li>Serialization</li>
                  </ul>
                </li>

                <li>
                  Incoming:
                  <ul>
                    <li>Proxying of validation errors</li>
                    <li>Proxying of success response</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          `;
        }
      },
      {
        id: 1,
        path: '#!/about/resume/ally/bubbles/1',
        text: 'ETL<sup>*</sup> Design',
        size: 'large',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
            <h1 class="title is-5"><small>2017</small> &nbsp;${title}</h1>
            <p>
              Very early on in the life cyle of the software (pre-dating my joining the team),
              a decisions was made to re-shape source data into a more flexible
              schema customized for this application's target customer.

              That decision presented various challenges. One of which
              was ensuring data integrity between the two databases. Another
              was managing data consistency in as close to real time as possible.

              Without the benefit of time to explore the viability of products like
              Amazon Glue, the Senior Engineering team architected a solution that would
              address the aforementioned challenges.
            </p>
            <p>
              At a high level we designed and implemented the following:
            </p>
            <ul>
              <li>Subscription to change events via Amazon SQS Queue</li>
              <li>When an event occurred, workers executed asynchronous synchronization tasks</li>
              <li>
                Transformation adapters for each model type facilitated the most
                efficient and prioritized synchronization strategy.
              </li>
            </ul>
            <small>
              * ETL is the extraction, transformation, and loading of data between
              one database and another.
            </small>
          `;
        }
      },
      {
        id: 2,
        path: '#!/about/resume/ally/bubbles/2',
        text: 'Stripe API<br>Adapter',
        size: 'small',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
          <h1 class="title is-5"><small>2017</small> &nbsp;${title}</h1>
          <p>
            To facilitate simple subscription management for our customers,
            I paired with a junior developer to implement an elegant
            Stripe API adapter for our Django API.
            <ul>
              <li>Exhaustive exception handling behind a decorator</li>
              <li>Logical abstractions of the Stripe Primitives related to the subscription flow</li>
            </ul>
          </p>
          `;
        }
      },
      {
        id: 2,
        path: '#!/about/resume/ally/bubbles/2',
        text: 'Authentication<br>rewrite',
        size: 'large',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
            <h1 class="title is-5"><small>2017</small> &nbsp;${title}</h1>
            <p>
              As a prerequisite to a packaging our app for native devices (Corber),
              I was handed the task of decomissioning our Django templated login flows
              and replacing them with Ember routes supported by Ember Simple Auth
              <ul>
                <li>Custom authenticator to support JWT Bearer Token Flow</li>
                <li>Integration with Ember Concurrency</li>
                <li>Integration with Ember Changeset</li>
              </ul>
            </p>
            `;
        }
      },
      {
        id: 4,
        path: '#!/about/resume/ally/bubbles/4',
        text: 'Automation<br>Scheduler',
        size: 'large',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
          <p>
            Many of our customers who have regularly scheduled maintenance
            at multiple retail locations, had to manually and repeatedly
            process work orders on a monthly or weekly basis.

            Using some templated data, I was able to alleviate our customers
            of that process by automating the following chores.
            <ul>
              <li>
                Determine which and how many work orders should be processed on a particular day
              </li>
              <li>
                Calculate and schedule when work orders should be processed
                the next time around. (e.g. in 30 days and on a particular day of the week)
              </li>
              <li>
                Automate the extrapolation of work order processing across multiple locations
              </li>
            </ul>
          </p>
          `;
        }
      },
      {
        id: 5,
        path: '#!/about/resume/ally/bubbles/5',
        text: 'Django<br>Admin<br>Dashboard',
        size: 'medium',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
          <h1 class="title is-5"><small>2017</small> &nbsp;${title}</h1>
          <p>
            As a precaution for any potential desynchronization or data infedelity,
            I wired up a Django AdminSite giving administrators a simple way to
            invoke management commands, and subsequent synchronization tasks on demand.
          </p>
          `;
        }
      },
      {
        id: 6,
        path: '#!/about/resume/ally/bubbles/7',
        text: 'Routable<br>Modal',
        size: 'small',
        get description() {
          const title = (this.text).replace(/<br>/g, ' ');
          return `
          <p>
            This criteria for this task was to accomplish a multi-step UX
            from within a modal, and that state could be shared across users
            (via deeplink), or survive a refresh. Also, for maintainability, we
            did not want introduce any additional modal add-ons to accomplish this.

            In the end, I combined ember-modal-dialog's routable usage
            with dynamic segments so that state (a customer's selections)
            could easily be re-built from the url path.
          </p>
          `;
        }
      }
    ]
  },
  {
    id: 2,
    type: 'resume',
    employer: 'Ally Financial',
    tenure: '2013 - 2017',
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
    overview: 'Architecting and engineering software infrastructure for various enterprise web applications that make up Ally Online Services. Project Lead responsible for oversight and code-review of first party, third party, and offshore engineers and developers. Teaching repeatable patterns, intelligent abstractions, and best practices. Responsibilities for overall applications stability, maintainability, and scalability.',
    leadership: [
      'Project leadership',
      'Architecting and Solutioning',
      'Project and Timeline Management',
      'Live coding reviews with offshore teams, and staff augmentation teams',
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
        text: 'Authentication<br>Protocol rewrite',
        size: 'large',
        description: '<h1 class="title is-5"><small>2016</small> &nbsp;Authentication Protocol rewrite</h1> <ul> <li>Multi-factor flows (with dozens of edge cases)</li><li>Custom adapter, serializer (endpoints were too overloaded for ember-data)</li><li>Intelligent routing and redirects</li><li>Re-usable client micro-services to perform auth related tasks</li><li>Secure third-party post-authentication hand-off</li><li>Modularization (in progress)</li></ul>'
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
    id: 3,
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
    company: 'Whether it is a startup or a business re-inventing itself, AM-to-PM delivers big agency quality without the bloat.',
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
        description: '<h1 class="title is-5"><small>2012</small> &nbsp;Search API rewrite to support large-scale database and platform migration</h1><ul><li>Migration of platform from ASP to PHP</li><li>Aggregation middleware cross-referencing across Microsoft SQL Server and Oracle databases</li><li>Asynchrounous Results and Pagination</li><li>Mobile web implementation</li></li></ul>'
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
    id: 4,
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
    id: 6,
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
