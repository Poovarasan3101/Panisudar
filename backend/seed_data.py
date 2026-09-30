import os
import sys
import django
from datetime import date, timedelta

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
from apps.companies.models import Company
from apps.jobs.models import Job

print("Seeding database...")

# Ensure employer user exists
employer, _ = User.objects.get_or_create(
    email='priya@example.com',
    defaults={'full_name': 'Priya Nair', 'role': 'employer'}
)
if not employer.check_password('Password123'):
    employer.set_password('Password123')
    employer.save()

companies_data = [
    {
        "id": 1,
        "name": "Razorpay",
        "industry": "Financial Technology",
        "size": "501_1000",
        "location": "Bangalore, Karnataka",
        "website": "https://razorpay.com",
        "about": "Razorpay is India's first converged payments solution company allowing millions of businesses to accept, process and disburse payments effortlessly.",
        "benefits": ["Comprehensive Health Insurance", "Remote Work Flexibility", "Learning & Development Stipend", "Generous Stock Options", "Parental Leave Support"]
    },
    {
        "id": 2,
        "name": "Swiggy",
        "industry": "Food & Logistics",
        "size": "1001_plus",
        "location": "Bangalore, Karnataka",
        "website": "https://swiggy.com",
        "about": "Swiggy is India's leading on-demand convenience platform, delivering food, groceries, and essentials to millions daily.",
        "benefits": ["Wellness Programs", "Flexible Hours", "Meal Allowances", "Annual Tech Allowance", "Performance Bonuses"]
    },
    {
        "id": 3,
        "name": "Freshworks",
        "industry": "Enterprise Software",
        "size": "1001_plus",
        "location": "Chennai, Tamil Nadu",
        "website": "https://freshworks.com",
        "about": "Freshworks makes intuitive customer engagement software for businesses of all sizes, enabling teams to win customers for life.",
        "benefits": ["Global Mobility", "Comprehensive Medical Cover", "Mental Health Days", "Gym Reimbursement", "Skill Upgrading Grants"]
    },
    {
        "id": 4,
        "name": "Zoho",
        "industry": "Cloud Software",
        "size": "1001_plus",
        "location": "Chennai, Tamil Nadu",
        "website": "https://zoho.com",
        "about": "Zoho offers a comprehensive suite of business applications trusted by over 100 million users worldwide.",
        "benefits": ["Campus Life & Free Meals", "Zero Layoff Culture", "Housing Assistance", "Continuous Learning", "Work-Life Balance"]
    },
    {
        "id": 5,
        "name": "Flipkart",
        "industry": "E-Commerce",
        "size": "1001_plus",
        "location": "Bangalore, Karnataka",
        "website": "https://flipkart.com",
        "about": "Flipkart is India's leading e-commerce marketplace leading innovation across commerce, logistics, and fintech.",
        "benefits": ["ESOPs", "Health & Accident Cover", "Parental Care Leave", "Higher Education Support", "Discount Coupons"]
    },
    {
        "id": 6,
        "name": "Zomato",
        "industry": "Food Delivery & Tech",
        "size": "1001_plus",
        "location": "Gurgaon, Haryana",
        "website": "https://zomato.com",
        "about": "Zomato connects customers, delivery partners, and restaurant partners across cities with tech-enabled food solutions.",
        "benefits": ["Unlimited Paid Time Off", "Period Leave", "Medical Insurance", "Pet Friendly Offices", "Stock Incentives"]
    },
    {
        "id": 7,
        "name": "Paytm",
        "industry": "Fintech & Payments",
        "size": "1001_plus",
        "location": "Noida, Uttar Pradesh",
        "website": "https://paytm.com",
        "about": "Paytm is India's premier payments and financial services distribution company empowering millions of merchants.",
        "benefits": ["Medical & Life Cover", "Flexible Work Options", "Employee Recognition Rewards", "Tech Conferences Sponsorship"]
    },
    {
        "id": 8,
        "name": "Infosys",
        "industry": "IT Services & Consulting",
        "size": "1001_plus",
        "location": "Bangalore, Karnataka",
        "website": "https://infosys.com",
        "about": "Infosys is a global leader in next-generation digital services and consulting navigating client digital transformation.",
        "benefits": ["Global Client Exposure", "Health & Wellness Insurance", "Retirement Benefits", "Onsite Project Opportunities"]
    }
]

created_companies = {}
for c_data in companies_data:
    cid = c_data.pop("id")
    comp, created = Company.objects.update_or_create(id=cid, defaults=c_data)
    created_companies[comp.name] = comp

print(f"Companies seeded: {Company.objects.count()}")

deadline = date.today() + timedelta(days=45)

jobs_data = [
    {
        "title": "Senior Frontend Engineer (React/TypeScript)",
        "company": created_companies["Razorpay"],
        "category": "software_dev",
        "location": "Bangalore, Karnataka",
        "work_mode": "hybrid",
        "job_type": "full_time",
        "experience_level": "2_5",
        "salary_min": 1800000,
        "salary_max": 2800000,
        "description": "Join our core Checkout experience team building ultra-fast, accessible payment flows serving over 50 million consumers monthly.",
        "responsibilities": ["Design and maintain core checkout interfaces in React and TypeScript.", "Improve frontend performance, bundle sizing, and core web vitals.", "Collaborate closely with product designers and backend engineers."],
        "requirements": ["3+ years experience with React, TypeScript, and modern state management.", "Proven expertise in web performance optimization and responsive UX.", "Good understanding of browser APIs and client security."],
        "skills": ["React.js", "TypeScript", "Tailwind CSS", "Redux", "Webpack"],
        "qualifications": "B.Tech/B.E in Computer Science or equivalent practical experience.",
        "benefits": ["Health Insurance", "Remote Stipend", "Learning Budget"],
        "application_deadline": deadline,
        "is_featured": True
    },
    {
        "title": "Staff Backend Architect (Python/Django)",
        "company": created_companies["Swiggy"],
        "category": "software_dev",
        "location": "Bangalore, Karnataka",
        "work_mode": "remote",
        "job_type": "full_time",
        "experience_level": "5_plus",
        "salary_min": 3200000,
        "salary_max": 4800000,
        "description": "Architect high-throughput delivery and logistics dispatch services handling 100k+ concurrent orders during peak operational surges.",
        "responsibilities": ["Architect microservices in Python and Go.", "Optimize PostgreSQL query plans and distributed Redis caching.", "Lead technical mentorship and code quality standards."],
        "requirements": ["6+ years building distributed backend services at scale.", "Mastery of Python, Django/FastAPI, and relational database internals.", "Experience with message queues (Kafka/RabbitMQ) and Docker."],
        "skills": ["Python", "Django", "PostgreSQL", "Redis", "Kafka", "Docker"],
        "qualifications": "Bachelor's or Master's degree in Computer Science or related field.",
        "benefits": ["Stock Grants", "Flexible Work", "Health Cover"],
        "application_deadline": deadline,
        "is_featured": True
    },
    {
        "title": "Product Designer (UI/UX)",
        "company": created_companies["Freshworks"],
        "category": "ui_ux",
        "location": "Chennai, Tamil Nadu",
        "work_mode": "onsite",
        "job_type": "full_time",
        "experience_level": "2_5",
        "salary_min": 1200000,
        "salary_max": 2000000,
        "description": "Craft delightfully intuitive CRM and customer communication experiences for tens of thousands of global enterprise clients.",
        "responsibilities": ["Create user flows, wireframes, high-fidelity prototypes in Figma.", "Conduct usability interviews and translate insights into product roadmaps.", "Contribute to and maintain our enterprise design system."],
        "requirements": ["3+ years product design experience on B2B SaaS products.", "Exceptional visual craft, typography, and interactive prototyping skills.", "Strong communication and stakeholder management."],
        "skills": ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"],
        "qualifications": "Degree in Design, HCI, or equivalent portfolio demonstrated experience.",
        "benefits": ["Medical Insurance", "Wellness Allowance", "Gym Membership"],
        "application_deadline": deadline,
        "is_featured": True
    },
    {
        "title": "AI / Machine Learning Engineer",
        "company": created_companies["Zoho"],
        "category": "data_science",
        "location": "Chennai, Tamil Nadu",
        "work_mode": "hybrid",
        "job_type": "full_time",
        "experience_level": "1_2",
        "salary_min": 1400000,
        "salary_max": 2200000,
        "description": "Build fine-tuned LLM agents, automated summarization, and predictive analytics tools integrated directly into the Zoho suite.",
        "responsibilities": ["Train, fine-tune, and deploy transformer-based NLP models.", "Develop low-latency model inference pipelines.", "Collaborate with product teams to identify generative AI opportunities."],
        "requirements": ["Experience with PyTorch, HuggingFace transformers, and vector databases.", "Proficiency in Python and REST API development.", "Solid understanding of embeddings, RAG, and prompt engineering."],
        "skills": ["Python", "PyTorch", "HuggingFace", "RAG", "Vector DB", "FastAPI"],
        "qualifications": "Degree in Computer Science, Data Science, or related quantitative field.",
        "benefits": ["Campus Meals", "Housing Support", "Continuous Learning"],
        "application_deadline": deadline,
        "is_featured": True
    },
    {
        "title": "Growth Marketing Manager",
        "company": created_companies["Flipkart"],
        "category": "marketing",
        "location": "Bangalore, Karnataka",
        "work_mode": "onsite",
        "job_type": "full_time",
        "experience_level": "2_5",
        "salary_min": 1500000,
        "salary_max": 2400000,
        "description": "Drive user acquisition, retention, and GMV expansion campaigns across high-visibility category sales and seasonal events.",
        "responsibilities": ["Plan and execute multi-channel digital campaigns.", "Analyze conversion funnels and perform CAC/LTV optimizations.", "Coordinate with creative teams for high-converting creatives."],
        "requirements": ["3+ years growth marketing experience in consumer tech/e-commerce.", "Deep proficiency in Google Ads, Meta Ads, and product analytics (Mixpanel/GA4).", "Strong analytical and data-driven problem solving."],
        "skills": ["Growth Marketing", "Google Ads", "Analytics", "SEO", "A/B Testing"],
        "qualifications": "MBA or Bachelor's in Marketing, Business, or related discipline.",
        "benefits": ["ESOPs", "Health Insurance", "Discounts"],
        "application_deadline": deadline,
        "is_featured": False
    },
    {
        "title": "DevOps & Cloud Security Engineer",
        "company": created_companies["Zomato"],
        "category": "software_dev",
        "location": "Gurgaon, Haryana",
        "work_mode": "remote",
        "job_type": "full_time",
        "experience_level": "2_5",
        "salary_min": 2000000,
        "salary_max": 3000000,
        "description": "Scale and harden AWS Kubernetes infrastructure powering millions of real-time location and dispatch requests.",
        "responsibilities": ["Manage multi-region Kubernetes clusters on AWS EKS.", "Implement Terraform infrastructure as code and automated CI/CD pipelines.", "Conduct security audits, access management, and automated vulnerability scanning."],
        "requirements": ["3+ years hands-on cloud experience with AWS and Kubernetes.", "Strong understanding of Terraform, Helm, and GitLab CI/GitHub Actions.", "Linux systems troubleshooting and network security fundamentals."],
        "skills": ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Linux"],
        "qualifications": "B.Tech/B.E in Computer Science or equivalent field.",
        "benefits": ["Unlimited Leave", "Stock Incentives", "Medical Cover"],
        "application_deadline": deadline,
        "is_featured": True
    }
]

Job.objects.all().delete()
for j_data in jobs_data:
    Job.objects.create(posted_by=employer, **j_data)

print(f"Jobs seeded: {Job.objects.count()}")
print("Seeding completed successfully!")
