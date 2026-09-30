export const mockSeekerProfile = {
  id: '1',
  userId: '1',
  fullName: 'Arjun Sharma',
  email: 'arjun.sharma@email.com',
  phone: '+91 98765 43210',
  title: 'Full Stack Developer',
  location: 'Bangalore, Karnataka',
  about:
    'I am a passionate Full Stack Developer with 3+ years of experience building scalable web applications using React, Node.js, and cloud technologies. I love creating clean, intuitive user interfaces and robust backend services that solve real-world problems. I thrive in collaborative, agile environments and am always looking for opportunities to learn new technologies and best practices.',
  photo: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=4f46e5&color=fff&size=128',
  resume: {
    name: 'Arjun_Sharma_Resume.pdf',
    uploadedAt: '2026-09-01',
  },
  skills: [
    'React.js',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'AWS',
    'GraphQL',
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: 'National Institute of Technology, Surathkal',
      startYear: '2018',
      endYear: '2022',
      grade: '8.4 CGPA',
    },
    {
      degree: 'XII (CBSE – Science)',
      institution: 'Delhi Public School, R.K. Puram, New Delhi',
      startYear: '2016',
      endYear: '2018',
      grade: '94.4%',
    },
  ],
  experience: [
    {
      title: 'Software Development Engineer II',
      company: 'Freshworks Inc.',
      startDate: '2024-01',
      endDate: null,
      isCurrent: true,
      description:
        'Working on the Freshdesk product as part of the Ticket Management squad. Building high-performance React components for the agent workspace used by 50,000+ businesses. Contributed a real-time collaboration feature that improved agent response times by 18%. Also mentoring two junior engineers on the team.',
    },
    {
      title: 'Software Development Engineer I',
      company: 'Zoho Corporation',
      startDate: '2022-07',
      endDate: '2023-12',
      isCurrent: false,
      description:
        'Worked on Zoho CRM\'s frontend team, building modular UI components using Vue.js and integrating REST APIs. Delivered the bulk import feature that reduced data onboarding time for enterprise clients by 30%. Participated actively in agile sprints and contributed to technical design reviews.',
    },
  ],
  projects: [
    {
      name: 'DevConnect – Developer Networking Platform',
      description:
        'A full-stack social platform for developers to share projects, seek collaborators, and post technical articles. Features real-time chat, GitHub OAuth integration, and a personalized activity feed. Built using React, Node.js, Socket.io, and MongoDB. Deployed on AWS EC2 with a CI/CD pipeline via GitHub Actions.',
      technologies: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'AWS', 'Tailwind CSS'],
      githubUrl: 'https://github.com/arjunsharma/devconnect',
      liveUrl: 'https://devconnect.arjunsharma.dev',
    },
    {
      name: 'BudgetBuddy – Personal Finance Tracker',
      description:
        'A React Native app for tracking personal expenses, setting savings goals, and visualizing spending patterns with charts. Supports bank statement import (CSV), recurring expense reminders, and monthly summary reports. Backend powered by a GraphQL API on Node.js with PostgreSQL.',
      technologies: ['React Native', 'GraphQL', 'Node.js', 'PostgreSQL', 'TypeScript'],
      githubUrl: 'https://github.com/arjunsharma/budgetbuddy',
      liveUrl: null,
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2025-03',
      credentialUrl: 'https://www.credly.com/badges/example-aws-saa',
    },
    {
      name: 'Meta React Developer Professional Certificate',
      issuer: 'Meta (Coursera)',
      date: '2024-08',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/example',
    },
  ],
  preferredRole: 'Full Stack Developer',
  preferredLocation: 'Bangalore, Karnataka',
  expectedSalaryMin: 1500000,
  expectedSalaryMax: 2000000,
  preferredJobType: 'full_time',
  languages: ['English', 'Hindi', 'Kannada'],
  github: 'https://github.com/arjunsharma',
  linkedin: 'https://linkedin.com/in/arjunsharma',
  portfolio: 'https://arjunsharma.dev',
  careerObjective:
    'To secure a senior full-stack engineering role at a product-driven company where I can leverage my expertise in React and Node.js to build products that make a meaningful impact on users at scale. I am passionate about building robust, accessible, and highly performant web applications, and I aim to grow into a tech lead role within the next two years.',
  achievements: [
    'Winner – Smart India Hackathon 2021 (Ministry of Electronics & IT): Built a real-time logistics tracking platform for rural supply chains in a 36-hour hackathon.',
    'Published technical article on "Optimizing React Re-renders with useMemo and useCallback" on Medium with 25,000+ views and featured in JavaScript Weekly newsletter.',
  ],
  interests: ['Open Source', 'AI/ML', 'Tech Blogging'],
};

export const mockEmployerProfile = {
  id: '2',
  userId: '2',
  recruiterName: 'Priya Nair',
  email: 'priya.nair@razorpay.com',
  phone: '+91 87654 32109',
  companyId: '4',
  companyName: 'Razorpay',
  companyLogo: '/logos/razorpay.svg',
  industry: 'Financial Technology',
  companySize: '501_1000',
  location: 'Bangalore, Karnataka',
  website: 'https://razorpay.com',
  about:
    'Razorpay is India\'s leading full-stack financial solutions company, empowering businesses of all sizes with seamless payment infrastructure. Our platform processes billions of dollars in transactions annually, serving over 5 million merchants across India. We are a Series F funded company with a valuation of over $7.5 billion, and we are on a mission to revolutionise how businesses manage money in India.',
  benefits: [
    'Competitive salary with meaningful ESOPs',
    'Comprehensive health insurance covering spouse, children, and parents',
    'Flexible hybrid work policy with fully remote options for some roles',
    'Annual learning & development budget of ₹50,000 per employee',
    'Free catered lunch and dinner at Bengaluru HQ',
  ],
};
