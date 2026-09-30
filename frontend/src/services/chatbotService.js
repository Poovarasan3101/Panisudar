/**
 * Chatbot Service
 *
 * Provides AI-powered or intelligent rule-based answers for job portal queries.
 * Connectable to external AI endpoints via VITE_AI_CHAT_API_URL and VITE_AI_CHAT_API_KEY
 * without exposing secret keys in source code.
 */

// Common knowledge base for fallback answering
const KNOWLEDGE_BASE = [
  {
    keywords: ['find', 'search', 'look for', 'browse', 'opportunities', 'vacancy', 'openings'],
    response: `To find your next job on Panisudar:
1. Go to the **Find Jobs** page from the top navigation.
2. Filter by **Location**, **Job Type** (Full-time, Remote, Internship), and **Experience Level**.
3. Use the salary filter slider to match your pay requirements.
4. Click on any job card to read the full description and apply!`
  },
  {
    keywords: ['create', 'profile', 'edit profile', 'setup profile', 'account', 'update info'],
    response: `To create and build a compelling profile:
1. Log in to your Job Seeker account.
2. Click your avatar in the top-right and select **Profile** (or navigate to \`/job-seeker/profile\`).
3. Add your headline, bio, contact details, and current location.
4. Add your technical & soft skills, education, past experiences, and notable projects.
5. Aim for a 100% completion score to get noticed by recruiters faster!`
  },
  {
    keywords: ['apply', 'application', 'how to apply', 'submit resume', 'apply for a job'],
    response: `Applying for jobs is quick and simple:
1. Browse to any job detail page by clicking **View Details** or **Apply** on a job card.
2. Click the primary **Apply Now** button.
3. Review your auto-filled details, upload or select your resume, and optionally write a short cover letter.
4. Click **Submit Application**. You can track its live progress anytime under **Applications** in your dashboard.`
  },
  {
    keywords: ['resume', 'cv', 'improve resume', 'portfolio', 'better resume', 'tips for resume'],
    response: `Tips to make your resume stand out to employers:
- **Quantify your impact**: Use numbers (e.g., "Improved response speed by 35%" or "Managed 10+ client accounts").
- **Tailor for keywords**: Mirror tech skills and keywords mentioned directly in the job description.
- **Keep it concise**: 1 to 2 pages maximum, formatted clearly in PDF.
- **Showcase projects**: Include live URLs and GitHub repository links.`
  },
  {
    keywords: ['skills', 'learn', 'tech stack', 'what skills', 'technologies', 'upskill'],
    response: `In-demand skills currently hiring across top companies:
- **Frontend**: React.js, TypeScript, Next.js, Tailwind CSS.
- **Backend**: Node.js, Python (Django/FastAPI), Go, PostgreSQL, Redis.
- **DevOps & Cloud**: Docker, Kubernetes, AWS, Terraform, CI/CD pipelines.
- **Data & AI**: Python, SQL, Pandas, LLM integration, Machine Learning basics.`
  },
  {
    keywords: ['interview', 'prepare', 'interview prep', 'questions', 'coding interview', 'rounds'],
    response: `Key tips for acing interviews on Panisudar:
1. **Research the Company**: Review their active products, tech stack, and company culture on their company page.
2. **Review Core Concepts**: Practice Data Structures & Algorithms, System Design, and Behavioral (STAR method) questions.
3. **Check Dashboard Notifications**: Interview invites and meeting links appear directly in your notification center.`
  },
  {
    keywords: ['contact', 'employer', 'recruiter', 'message recruiter', 'reach out', 'talk to company'],
    response: `You can connect with employers through Panisudar:
- When you apply, hiring managers can directly send you messages and status updates.
- Check your **Notifications** inbox for recruiter inquiries.
- Company contact emails and official websites are also available on each company's profile card.`
  },
  {
    keywords: ['post job', 'hire', 'employer', 'recruiter', 'post a job', 'provider'],
    response: `Looking to hire great talent?
1. Register or switch to an **Employer / Recruiter** account.
2. Navigate to your Employer Dashboard.
3. Click **Post Job** to specify titles, salary bands, requirements, and tags.
4. Review incoming candidates in real-time, change application statuses, and shortlist applicants!`
  },
  {
    keywords: ['status', 'track', 'shortlisted', 'under review', 'rejected', 'selected'],
    response: `You can track every application in real-time under **Applications**:
- **Applied**: Sent successfully to the employer.
- **Under Review**: The recruiting team is screening your resume.
- **Shortlisted**: You passed preliminary screening!
- **Interview**: An interview slot is being scheduled or underway.
- **Selected**: Congratulations on receiving an offer!`
  }
];

export const chatbotService = {
  /**
   * Send a message to the chatbot
   * @param {string} userMessage - Message sent by the user
   * @param {Array} history - Previous conversation messages
   * @returns {Promise<{ reply: string, source: 'ai' | 'fallback' }>}
   */
  async sendMessage(userMessage, history = []) {
    const trimmed = (userMessage || '').trim();
    if (!trimmed) {
      return { reply: "I didn't catch that. How can I assist your job search or hiring today?", source: 'fallback' };
    }

    const apiUrl = import.meta.env.VITE_AI_CHAT_API_URL;
    const apiKey = import.meta.env.VITE_AI_CHAT_API_KEY;

    // If an external AI API is configured via environment variables
    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({
            message: trimmed,
            history: history.slice(-6).map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            systemPrompt:
              'You are the Panisudar AI Assistant. Provide helpful, concise, and professional guidance on job searching, resume tips, interview preparation, navigating Panisudar, and hiring.',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply =
            data.reply ||
            data.message ||
            data.choices?.[0]?.message?.content ||
            data.response;
          if (reply) {
            return { reply, source: 'ai' };
          }
        }
      } catch (err) {
        console.warn('AI Chat API unavailable, falling back to local assistant:', err);
      }
    }

    // Fallback response engine
    await new Promise((res) => setTimeout(res, 450)); // natural typing delay

    const lower = trimmed.toLowerCase();

    // Check knowledge base
    for (const item of KNOWLEDGE_BASE) {
      const match = item.keywords.some((kw) => lower.includes(kw));
      if (match) {
        return { reply: item.response, source: 'fallback' };
      }
    }

    // Default polite response
    return {
      reply: `I can help you with anything related to Panisudar! You can ask me:
- **"How can I find a job?"**
- **"How do I create my profile?"**
- **"How do I apply for a job?"**
- **"How can I improve my resume?"**
- **"What skills should I learn?"**
- **"How do I post a job as an employer?"**

Feel free to choose a suggested topic or ask any question!`,
      source: 'fallback',
    };
  },

  /**
   * Get the default suggested prompts
   */
  getSuggestedQuestions() {
    return [
      'How can I find a job?',
      'How do I create my profile?',
      'How do I apply for a job?',
      'How can I improve my resume?',
      'What skills should I learn?',
      'How do I contact an employer?',
    ];
  },
};

export default chatbotService;
