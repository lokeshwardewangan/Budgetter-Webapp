type navListType = {
  route: string;
  name: string;
  isAi?: boolean;
};

export const navListArray: navListType[] = [
  {
    route: '#features_section',
    name: 'Features',
  },
  {
    route: '#ai_showcase_section',
    name: 'AI Agent',
    isAi: true,
  },
  {
    route: '#insightspreview_section',
    name: 'Insights',
  },
  {
    route: '#testimonials_section',
    name: 'Reviews',
  },
  {
    route: '#getintouch_section',
    name: 'Contact',
  },
];
