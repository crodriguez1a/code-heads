export const articles = [
  {
    id: 0,
    type: 'article',
    title: 'A Practical Approach',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    id: 1,
    type: 'article',
    title: 'Keep Learning Free',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    id: 2,
    type: 'article',
    title: 'Contributors & Curators',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    id: 3,
    type: 'article',
    title: 'Start Learning on Your Own',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
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
    bubblesTitle: 'Project lead on:',
    bubbles: [
      {
        text: 'Custom<br>Charts',
        size: 'small',
        description:'<h1 class="title is-5"><small>2013</small><br>Custom charts and graphs with real-time feedback</h1> <ul> <li>Two way binding with the burgeoning Ember 0.X</li><li>An island implementation of Ember (pre ember-islands)</li><li>Pure CSS bar charts</li><li>Vanilla JS line graphs (due to dependency limitations)</li></ul>'
      },
      {
        text: 'Single Page<br>Mobile Site',
        size: 'medium',
        description:'<h1 class="title is-5"><small>2014</small><br>Single page mobile website</h1> <ul> <li>Routing implemenation with Javascript and Apache</li><li>Leveraging/reusing existing desktop components</li><li>Google Maps API implemenation (ATM locator)</li><li>Framework free (due to dependency limitations)</li></ul>'
      },
      {
        text: 'Homepage<br>Login Widget',
        size: 'small',
        description:'<h1 class="title is-5"><small>2015</small><br>Homepage Login Widget</h1> <ul> <li>Authored Vanilla JS application micro-framework (due to dependency limitations)</li><li>Custom validation</li><li>Custom component state</li><li>Rudimentary Promise aware component rendering</li></ul>'
      },
      {
        text: 'Authentication<br>Protocol Re-write',
        size: 'large',
        description: '<h1 class="title is-5"><small>2016</small><br>Authentication Protocol Re-write</h1> <ul> <li>Multi-factor flows (with dozens of edge cases)</li><li>Custom adapter, serializer (endpoints were too overloaded for ember-data)</li><li>Intelligent routing and redirects</li><li>Re-usable client micro-services to perform auth related tasks</li><li>Secure third-party post-authentication hand-off</li><li>Modularization (in progress)</li></ul>'
      },
      {
        text: 'Open Source<br>UI Component Library',
        size: 'medium',
          description:'<h1 class="title is-5"><small>2016</small><br>Open Source UI Component Library</h1> <ul> <li>Composable components</li><li>Stateless and logic-less (dumb)</li><li><a href="http://open-tux.github.io/ember-bulma/" target="_blank">GitHub</a></li></ul>'
      },
      {
        text: 'Branded UI<br>Component Library',
        size: 'medium'
      },
      {
      text: 'Dashboard<br>Architecture',
      size: 'medium'
      },
      {
        text: 'Ember Engines<br>Architecture',
        size: 'large'
      }
    ]
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Am-to-Pm Creative',
    tenure: '2008 - 2013',
    titles: ['Full Stack Developer', 'Consultant']
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Dakota Group',
    tenure: '2007 - 2008',
    titles: ['Senior UI Developer']
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Starwood Hotels',
    tenure: '2005 - 2007',
    titles: ['Multimedia Developer']
  },
  {
    id: 5,
    type: 'resume',
    employer: 'Worx Group',
    tenure: '2004 - 2005',
    titles: ['UI Designer']
  }
];

export const content = [].concat(articles, resume);
