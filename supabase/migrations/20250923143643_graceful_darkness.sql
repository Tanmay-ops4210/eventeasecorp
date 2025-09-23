/*
  # Populate Database with Sample Data

  1. Sample Data Creation
    - `profiles` - Sample user profiles for all roles
    - `events` - Sample events with various statuses
    - `speakers` - Sample speakers with expertise areas
    - `sponsors` - Sample sponsors with different tiers
    - `ticket_types` - Sample ticket types for events
    - `event_attendees` - Sample event registrations
    - `blog_articles` - Sample blog content
    - `resources` - Sample downloadable resources
    - `press_releases` - Sample press releases
    - `notifications` - Sample notifications

  2. Relationships
    - All foreign key relationships properly maintained
    - Events linked to organizers
    - Attendees linked to events and users
    - Speakers linked to events
    - Sponsors linked to events

  3. Security
    - All existing RLS policies remain active
    - Sample data respects security constraints
*/

-- Insert sample user profiles for all roles
INSERT INTO profiles (id, username, full_name, role, plan, company, title, avatar_url) VALUES
-- Admin users
('admin-001', 'admin_sarah', 'Sarah Johnson', 'admin', 'pro', 'EventEase Corp', 'CEO & Founder', 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Organizer users
('org-001', 'organizer_michael', 'Michael Chen', 'organizer', 'paid', 'TechEvents Inc', 'Event Director', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'),
('org-002', 'organizer_emma', 'Emma Rodriguez', 'organizer', 'paid', 'Creative Events Co', 'Senior Event Manager', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'),
('org-003', 'organizer_david', 'David Park', 'organizer', 'free', 'Startup Events', 'Founder', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Sponsor users
('spon-001', 'sponsor_techcorp', 'Lisa Thompson', 'sponsor', 'paid', 'TechCorp Industries', 'Marketing Director', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'),
('spon-002', 'sponsor_innovation', 'James Wilson', 'sponsor', 'paid', 'Innovation Labs', 'Partnership Manager', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Attendee users
('att-001', 'attendee_alex', 'Alex Thompson', 'attendee', 'free', 'StartupCo', 'Product Manager', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'),
('att-002', 'attendee_maria', 'Maria Garcia', 'attendee', 'free', 'Design Studio', 'UX Designer', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400'),
('att-003', 'attendee_john', 'John Smith', 'attendee', 'free', 'Marketing Pro', 'Digital Marketer', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'),
('att-004', 'attendee_sarah', 'Sarah Kim', 'attendee', 'free', 'Tech Solutions', 'Software Engineer', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400'),
('att-005', 'attendee_carlos', 'Carlos Rodriguez', 'attendee', 'free', 'Business Corp', 'Business Analyst', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (id) DO NOTHING;

-- Insert sample speakers
INSERT INTO speakers (id, name, title, company, bio, full_bio, image_url, expertise, location, rating, social_links, featured) VALUES
('spk-001', 'Zawadi Thandwe', 'Chief Technology Officer', 'TechCorp Industries', 'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions.', 'Zawadi Thandwe is a visionary technology leader with over two decades of experience in driving digital transformation and innovation across Fortune 500 companies. As the Chief Technology Officer at TechCorp Industries, she leads a team of 200+ engineers and data scientists in developing cutting-edge solutions that have revolutionized the industry.', 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Technology', 'Leadership', 'Innovation', 'AI/ML'], 'San Francisco, CA', 4.9, '{"email": "zawadi@techcorp.com", "linkedin": "https://linkedin.com/in/zawadi-thandwe", "twitter": "https://twitter.com/zawadi_tech"}', true),

('spk-002', 'Ejiro Rudo', 'Senior Product Manager', 'Innovation Labs', 'Skilled in problem solving, communication, and strategic thinking with a focus on user-centered design.', 'Ejiro Rudo is a seasoned product management professional with over 12 years of experience building and launching successful digital products. Currently serving as Senior Product Manager at Innovation Labs, she leads cross-functional teams in developing cutting-edge solutions that serve millions of users worldwide.', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Product Management', 'Strategy', 'Design', 'User Research'], 'New York, NY', 4.8, '{"email": "ejiro@innovationlabs.com", "linkedin": "https://linkedin.com/in/ejiro-rudo", "twitter": "https://twitter.com/ejiro_pm"}', true),

('spk-003', 'Daniel Saoirse', 'Creative Director', 'Design Studio Pro', 'Dedicated to crafting innovative solutions with change-driven creativity and forward-thinking design approaches.', 'Daniel Saoirse is an award-winning creative director with 15 years of experience in brand design, digital experiences, and creative strategy. As Creative Director at Design Studio Pro, he leads a team of 50+ designers and creatives in developing brand identities and digital experiences for Fortune 500 companies.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Design', 'Creativity', 'Innovation', 'Brand Strategy'], 'Los Angeles, CA', 4.7, '{"email": "daniel@designstudiopro.com", "linkedin": "https://linkedin.com/in/daniel-saoirse", "website": "https://daniel-saoirse.design"}', false),

('spk-004', 'Sarah Johnson', 'Digital Marketing Expert', 'Marketing Dynamics', 'Leading digital transformation initiatives with expertise in data-driven marketing strategies.', 'Sarah Johnson is a digital marketing strategist with over 10 years of experience helping brands achieve their growth objectives through innovative marketing campaigns and data-driven insights.', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Marketing', 'Digital Strategy', 'Analytics', 'Growth'], 'Chicago, IL', 4.6, '{"email": "sarah@marketingdynamics.com", "linkedin": "https://linkedin.com/in/sarah-johnson-marketing"}', false),

('spk-005', 'Michael Chen', 'Business Strategy Consultant', 'Strategic Solutions Inc', 'Helping organizations navigate complex business challenges through strategic planning and operational excellence.', 'Michael Chen is a business strategy consultant with extensive experience in helping organizations transform their operations and achieve sustainable growth through strategic planning and execution.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Strategy', 'Business Development', 'Operations', 'Consulting'], 'Seattle, WA', 4.8, '{"email": "michael@strategicsolutions.com", "linkedin": "https://linkedin.com/in/michael-chen-strategy"}', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample sponsors
INSERT INTO sponsors (id, name, logo_url, tier, website, industry) VALUES
('spon-001', 'TechCorp Industries', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 'platinum', 'https://techcorp.com', 'Technology'),
('spon-002', 'Innovation Labs', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400', 'gold', 'https://innovationlabs.com', 'Research & Development'),
('spon-003', 'Design Studio Pro', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', 'gold', 'https://designstudiopro.com', 'Design & Creative'),
('spon-004', 'Marketing Dynamics', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', 'silver', 'https://marketingdynamics.com', 'Marketing'),
('spon-005', 'Strategic Solutions Inc', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400', 'silver', 'https://strategicsolutions.com', 'Consulting'),
('spon-006', 'Green Future Corp', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', 'bronze', 'https://greenfuture.com', 'Sustainability')
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (id, organizer_id, title, description, full_description, category, event_date, start_time, end_time, venue, venue_address, image_url, status, visibility, max_attendees, capacity, date, time) VALUES
('evt-001', 'org-001', 'Tech Innovation Summit 2024', 'Join industry leaders for cutting-edge technology discussions and networking opportunities.', 'The Tech Innovation Summit 2024 brings together the brightest minds in technology to explore the latest trends, innovations, and future directions of the tech industry. This comprehensive event features keynote presentations, panel discussions, hands-on workshops, and extensive networking opportunities. Attendees will gain insights into artificial intelligence, machine learning, cloud computing, cybersecurity, and emerging technologies that are shaping our digital future.', 'Technology', '2024-03-15', '09:00:00', '18:00:00', 'San Francisco Convention Center', '747 Howard St, San Francisco, CA 94103', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public', 500, 500, '2024-03-15', '09:00:00'),

('evt-002', 'org-002', 'Digital Marketing Masterclass', 'Learn the latest digital marketing strategies from industry experts and practitioners.', 'This intensive masterclass covers the complete spectrum of digital marketing, from strategy development to execution and measurement. Participants will learn about social media marketing, content strategy, SEO, paid advertising, email marketing, and marketing automation. The program includes case studies, practical exercises, and actionable insights that can be immediately applied to your marketing efforts.', 'Marketing', '2024-03-20', '10:00:00', '16:00:00', 'New York Business Center', '123 Business Ave, New York, NY 10001', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public', 150, 150, '2024-03-20', '10:00:00'),

('evt-003', 'org-002', 'Sustainable Business Workshop', 'Discover sustainable business practices for the future of commerce and industry.', 'This workshop focuses on integrating sustainability into business operations, covering environmental impact assessment, sustainable supply chain management, green technology adoption, and corporate social responsibility. Participants will learn practical strategies for reducing environmental footprint while maintaining profitability and competitive advantage.', 'Sustainability', '2024-03-25', '09:30:00', '17:30:00', 'Green Building Seattle', '456 Eco Way, Seattle, WA 98101', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public', 100, 100, '2024-03-25', '09:30:00'),

('evt-004', 'org-001', 'Leadership Excellence Conference', 'Develop leadership skills with renowned speakers and interactive sessions.', 'The Leadership Excellence Conference is designed for current and aspiring leaders who want to enhance their leadership capabilities. The program covers emotional intelligence, team management, strategic thinking, change management, and communication skills. Interactive workshops, peer learning sessions, and mentorship opportunities provide practical experience and networking.', 'Business', '2024-04-02', '08:00:00', '19:00:00', 'Chicago Leadership Institute', '789 Leadership Blvd, Chicago, IL 60601', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public', 200, 200, '2024-04-02', '08:00:00'),

('evt-005', 'org-003', 'Creative Design Bootcamp', 'Intensive bootcamp covering the latest design trends, tools, and techniques.', 'This intensive 2-day bootcamp is perfect for designers looking to upgrade their skills and stay current with industry trends. Topics include user experience design, visual design principles, design thinking methodology, prototyping tools, and design system creation. Hands-on projects and portfolio reviews provide practical experience.', 'Design', '2024-04-08', '09:00:00', '18:00:00', 'Design Studio Austin', '321 Creative St, Austin, TX 78701', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', 'draft', 'public', 50, 50, '2024-04-08', '09:00:00'),

('evt-006', 'org-001', 'Networking Mixer: Startup Edition', 'Connect with entrepreneurs, investors, and startup enthusiasts in a relaxed environment.', 'This networking mixer brings together the startup ecosystem including founders, investors, mentors, and service providers. The event features structured networking sessions, pitch opportunities, panel discussions with successful entrepreneurs, and informal socializing. Perfect for making valuable connections and exploring collaboration opportunities.', 'Networking', '2024-04-12', '18:00:00', '21:00:00', 'Innovation Hub Boston', '654 Innovation Dr, Boston, MA 02101', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public', 120, 120, '2024-04-12', '18:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample ticket types for events
INSERT INTO ticket_types (id, event_id, name, description, price, quantity, sale_start_date, sale_end_date, is_active, currency, sold, benefits, restrictions) VALUES
-- Tech Innovation Summit tickets
('tkt-001', 'evt-001', 'Early Bird', 'Limited time early bird pricing with exclusive benefits', 199.00, 100, '2024-01-01 00:00:00+00', '2024-02-15 23:59:59+00', true, 'USD', 85, ARRAY['Early access to sessions', 'Welcome kit', 'Networking dinner'], ARRAY['Non-refundable', 'Non-transferable']),
('tkt-002', 'evt-001', 'Regular', 'Standard conference ticket with full access', 299.00, 300, '2024-02-16 00:00:00+00', '2024-03-10 23:59:59+00', true, 'USD', 180, ARRAY['Access to all sessions', 'Welcome kit', 'Lunch included'], ARRAY['Refundable until 7 days before event']),
('tkt-003', 'evt-001', 'VIP', 'Premium experience with exclusive access and benefits', 499.00, 50, '2024-01-01 00:00:00+00', '2024-03-10 23:59:59+00', true, 'USD', 35, ARRAY['VIP lounge access', 'Meet & greet with speakers', 'Premium swag bag', 'Reserved seating'], ARRAY['Non-refundable']),

-- Digital Marketing Masterclass tickets
('tkt-004', 'evt-002', 'Standard', 'Full access to masterclass sessions and materials', 149.00, 120, '2024-02-01 00:00:00+00', '2024-03-15 23:59:59+00', true, 'USD', 89, ARRAY['All session access', 'Course materials', 'Certificate of completion'], ARRAY['Refundable until 3 days before event']),
('tkt-005', 'evt-002', 'Premium', 'Enhanced experience with additional resources and networking', 249.00, 30, '2024-02-01 00:00:00+00', '2024-03-15 23:59:59+00', true, 'USD', 22, ARRAY['All session access', 'Premium materials', 'One-on-one consultation', 'Networking lunch'], ARRAY['Non-refundable']),

-- Sustainable Business Workshop tickets
('tkt-006', 'evt-003', 'Workshop Pass', 'Full workshop access with materials and certification', 99.00, 80, '2024-02-10 00:00:00+00', '2024-03-20 23:59:59+00', true, 'USD', 67, ARRAY['Workshop access', 'Sustainability toolkit', 'Certificate'], ARRAY['Refundable until 5 days before event']),
('tkt-007', 'evt-003', 'Student', 'Discounted rate for students with valid ID', 49.00, 20, '2024-02-10 00:00:00+00', '2024-03-20 23:59:59+00', true, 'USD', 15, ARRAY['Workshop access', 'Digital materials'], ARRAY['Student ID required', 'Non-transferable']),

-- Leadership Excellence Conference tickets
('tkt-008', 'evt-004', 'Conference Pass', 'Full conference access with all sessions and networking', 399.00, 150, '2024-02-15 00:00:00+00', '2024-03-25 23:59:59+00', true, 'USD', 120, ARRAY['All sessions', 'Leadership assessment', 'Networking events', 'Course materials'], ARRAY['Refundable until 10 days before event']),
('tkt-009', 'evt-004', 'Executive', 'Premium experience for senior executives', 699.00, 50, '2024-02-15 00:00:00+00', '2024-03-25 23:59:59+00', true, 'USD', 35, ARRAY['Executive lounge', 'Private networking', 'Leadership coaching session', 'Premium materials'], ARRAY['Non-refundable']),

-- Networking Mixer tickets
('tkt-010', 'evt-006', 'General Admission', 'Access to networking mixer with refreshments', 49.00, 100, '2024-03-01 00:00:00+00', '2024-04-10 23:59:59+00', true, 'USD', 75, ARRAY['Event access', 'Welcome drink', 'Networking facilitation'], ARRAY['Refundable until 2 days before event']),
('tkt-011', 'evt-006', 'Startup Founder', 'Special rate for startup founders with pitch opportunity', 29.00, 20, '2024-03-01 00:00:00+00', '2024-04-10 23:59:59+00', true, 'USD', 18, ARRAY['Event access', 'Pitch opportunity', 'Founder meetup'], ARRAY['Founder verification required'])
ON CONFLICT (id) DO NOTHING;

-- Link speakers to events
INSERT INTO event_speakers (id, event_id, speaker_id) VALUES
('es-001', 'evt-001', 'spk-001'),
('es-002', 'evt-001', 'spk-002'),
('es-003', 'evt-002', 'spk-004'),
('es-004', 'evt-003', 'spk-005'),
('es-005', 'evt-004', 'spk-001'),
('es-006', 'evt-004', 'spk-003'),
('es-007', 'evt-006', 'spk-002'),
('es-008', 'evt-006', 'spk-005')
ON CONFLICT (event_id, speaker_id) DO NOTHING;

-- Link sponsors to events
INSERT INTO event_sponsors (id, event_id, sponsor_id) VALUES
('esp-001', 'evt-001', 'spon-001'),
('esp-002', 'evt-001', 'spon-002'),
('esp-003', 'evt-002', 'spon-004'),
('esp-004', 'evt-003', 'spon-006'),
('esp-005', 'evt-004', 'spon-001'),
('esp-006', 'evt-004', 'spon-005'),
('esp-007', 'evt-006', 'spon-002'),
('esp-008', 'evt-006', 'spon-003')
ON CONFLICT (event_id, sponsor_id) DO NOTHING;

-- Insert sample event attendees
INSERT INTO event_attendees (id, event_id, user_id, ticket_type_id, registration_date, check_in_status, payment_status, additional_info) VALUES
-- Tech Innovation Summit attendees
('ea-001', 'evt-001', 'att-001', 'tkt-001', '2024-01-20 10:30:00+00', 'pending', 'completed', '{"dietary_restrictions": "vegetarian", "company_size": "startup"}'),
('ea-002', 'evt-001', 'att-002', 'tkt-002', '2024-02-05 14:15:00+00', 'pending', 'completed', '{"interests": ["AI", "Machine Learning"], "experience_level": "intermediate"}'),
('ea-003', 'evt-001', 'att-003', 'tkt-003', '2024-01-25 09:45:00+00', 'pending', 'completed', '{"networking_goals": "find_investors", "company_stage": "series_a"}'),
('ea-004', 'evt-001', 'att-004', 'tkt-002', '2024-02-10 16:20:00+00', 'pending', 'completed', '{"role": "engineer", "tech_stack": ["React", "Node.js", "Python"]}'),

-- Digital Marketing Masterclass attendees
('ea-005', 'evt-002', 'att-001', 'tkt-004', '2024-02-12 11:00:00+00', 'pending', 'completed', '{"marketing_experience": "2_years", "focus_area": "social_media"}'),
('ea-006', 'evt-002', 'att-005', 'tkt-005', '2024-02-08 13:30:00+00', 'pending', 'completed', '{"company_type": "b2b", "budget_range": "50k_100k"}'),

-- Sustainable Business Workshop attendees
('ea-007', 'evt-003', 'att-002', 'tkt-006', '2024-02-18 15:45:00+00', 'pending', 'completed', '{"sustainability_goals": "carbon_neutral", "industry": "manufacturing"}'),
('ea-008', 'evt-003', 'att-003', 'tkt-007', '2024-02-20 12:15:00+00', 'pending', 'completed', '{"student_id": "12345", "university": "Stanford", "major": "Environmental Science"}'),

-- Leadership Excellence Conference attendees
('ea-009', 'evt-004', 'att-004', 'tkt-008', '2024-02-25 10:00:00+00', 'pending', 'completed', '{"leadership_level": "middle_management", "team_size": "15_people"}'),
('ea-010', 'evt-004', 'att-005', 'tkt-009', '2024-02-22 14:30:00+00', 'pending', 'completed', '{"executive_level": "c_suite", "company_size": "enterprise"}'),

-- Networking Mixer attendees
('ea-011', 'evt-006', 'att-001', 'tkt-010', '2024-03-05 16:45:00+00', 'pending', 'completed', '{"networking_interests": ["fintech", "ai"], "looking_for": "co_founder"}'),
('ea-012', 'evt-006', 'att-003', 'tkt-011', '2024-03-08 09:20:00+00', 'pending', 'completed', '{"startup_stage": "pre_seed", "industry": "healthtech", "pitch_ready": true}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample blog articles
INSERT INTO blog_articles (id, slug, title, excerpt, content, author_id, published_date, category, image_url, featured, tags) VALUES
('blog-001', 'future-of-virtual-events', 'The Future of Virtual Events: Trends and Technologies', 'Explore how virtual and hybrid events are reshaping the industry with cutting-edge technologies and innovative engagement strategies.', '<h2>Introduction</h2><p>The events industry has undergone a dramatic transformation in recent years. Virtual and hybrid events have moved from being a novelty to becoming an essential part of the event landscape.</p><h2>Key Technologies Driving Change</h2><p>Several technologies are at the forefront of this revolution: Virtual Reality (VR), Artificial Intelligence, Live Streaming Platforms, and Interactive Tools.</p>', 'org-001', '2024-01-15', 'Technology', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', true, ARRAY['Virtual Events', 'Technology', 'Future Trends']),

('blog-002', 'creating-memorable-experiences', 'Creating Memorable Event Experiences', 'Learn the key principles of designing events that leave lasting impressions on attendees and drive meaningful connections.', '<h2>The Art of Experience Design</h2><p>Creating memorable event experiences goes beyond logistics and planning. It''s about crafting moments that resonate with attendees long after the event ends.</p><h2>Understanding Your Audience</h2><p>The foundation of any great event experience is a deep understanding of your audience.</p>', 'org-002', '2024-01-12', 'Strategy', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', false, ARRAY['Event Design', 'Strategy', 'User Experience']),

('blog-003', 'sustainable-event-planning', 'Sustainable Event Planning: A Complete Guide', 'Discover practical strategies for organizing eco-friendly events that minimize environmental impact while maximizing attendee satisfaction.', '<h2>Why Sustainable Events Matter</h2><p>As environmental consciousness grows, event organizers have a responsibility to minimize their ecological footprint while still delivering exceptional experiences.</p><h2>Planning Phase Sustainability</h2><p>Choose venues that prioritize sustainability and implement digital-first approaches.</p>', 'org-002', '2024-01-10', 'Sustainability', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', false, ARRAY['Sustainability', 'Green Events', 'Environmental Impact']),

('blog-004', 'maximizing-event-roi', 'Maximizing ROI from Corporate Events', 'Strategic approaches to measuring and improving the return on investment for your corporate events and conferences.', '<h2>Understanding Event ROI</h2><p>Return on Investment (ROI) for corporate events extends beyond simple financial metrics. It encompasses brand awareness, lead generation, employee engagement, and relationship building.</p>', 'org-001', '2024-01-08', 'Business', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', false, ARRAY['ROI', 'Corporate Events', 'Business Strategy']),

('blog-005', 'event-marketing-digital-age', 'Event Marketing in the Digital Age', 'Master the art of promoting your events across digital channels to reach and engage your target audience effectively.', '<h2>The Digital Marketing Landscape</h2><p>Event marketing has evolved dramatically with the rise of digital channels. Today''s event marketers must navigate a complex ecosystem of platforms, tools, and strategies.</p>', 'org-002', '2024-01-05', 'Marketing', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800', false, ARRAY['Digital Marketing', 'Social Media', 'Content Strategy'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample resources
INSERT INTO resources (id, title, description, type, category, download_url, image_url, featured) VALUES
('res-001', 'Complete Event Planning Checklist', 'A comprehensive 50-point checklist covering every aspect of event planning from conception to execution.', 'checklist', 'Planning', 'https://example.com/downloads/event-planning-checklist.pdf', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('res-002', 'Event Marketing Strategy Template', 'Ready-to-use marketing strategy template with timelines, channels, and budget allocation frameworks.', 'template', 'Marketing', 'https://example.com/downloads/marketing-strategy-template.pdf', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('res-003', 'Virtual Event Best Practices Guide', 'Learn how to create engaging virtual events with this comprehensive guide covering technology, engagement, and production.', 'guide', 'Virtual Events', 'https://example.com/downloads/virtual-events-guide.pdf', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', false),
('res-004', 'Event ROI Measurement Whitepaper', 'Detailed analysis of how to measure and improve return on investment for corporate events and conferences.', 'whitepaper', 'Analytics', 'https://example.com/downloads/event-roi-whitepaper.pdf', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', false),
('res-005', 'Sustainable Event Planning Guide', 'Comprehensive guide to organizing eco-friendly events that minimize environmental impact.', 'guide', 'Sustainability', 'https://example.com/downloads/sustainable-events-guide.pdf', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample press releases
INSERT INTO press_releases (id, title, release_date, excerpt, full_content, download_url) VALUES
('pr-001', 'EventEase Launches Revolutionary Event Management Platform', '2024-01-15', 'New platform streamlines event planning with AI-powered tools and comprehensive analytics.', 'EventEase today announced the launch of its revolutionary event management platform that combines artificial intelligence, comprehensive analytics, and intuitive design to streamline the entire event planning process. The platform addresses the growing need for efficient, scalable event management solutions in an increasingly digital world.', 'https://example.com/press/eventease-launch.pdf'),
('pr-002', 'EventEase Partners with Leading Convention Centers Nationwide', '2024-01-08', 'Strategic partnerships expand venue options and enhance event planning capabilities.', 'EventEase has formed strategic partnerships with over 50 leading convention centers and event venues across the United States, significantly expanding venue options for event organizers and enhancing the platform''s event planning capabilities.', 'https://example.com/press/venue-partnerships.pdf'),
('pr-003', 'EventEase Reaches 10,000 Successful Events Milestone', '2023-12-20', 'Platform celebrates major milestone with over 10,000 events successfully planned and executed.', 'EventEase today announced that it has successfully facilitated over 10,000 events since its launch, representing a significant milestone in the company''s mission to democratize professional event planning tools.', 'https://example.com/press/10k-milestone.pdf')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications for users
INSERT INTO notifications (id, user_id, title, message, is_read) VALUES
-- Notifications for attendee users
('notif-001', 'att-001', 'Event Reminder: Tech Innovation Summit 2024', 'Your event is starting tomorrow at 9:00 AM. Don''t forget to bring your ticket confirmation!', false),
('notif-002', 'att-001', 'New Event Recommendation', 'Based on your interests, you might like the Digital Marketing Masterclass happening next month.', false),
('notif-003', 'att-002', 'Registration Confirmed', 'Your registration for the Sustainable Business Workshop has been confirmed. Check your email for details.', true),
('notif-004', 'att-003', 'Networking Opportunity', 'Connect with other startup founders at the upcoming Networking Mixer. Limited spots available!', false),
('notif-005', 'att-004', 'Speaker Announcement', 'Exciting news! Zawadi Thandwe has been added as a keynote speaker for the Leadership Excellence Conference.', true),

-- Notifications for organizer users
('notif-006', 'org-001', 'Event Analytics Update', 'Your Tech Innovation Summit 2024 has reached 300 registrations! View detailed analytics in your dashboard.', false),
('notif-007', 'org-001', 'New Attendee Registration', 'Sarah Kim just registered for your Leadership Excellence Conference with an Executive ticket.', false),
('notif-008', 'org-002', 'Marketing Campaign Results', 'Your email campaign for Digital Marketing Masterclass achieved a 28% open rate and 12% click rate.', true),
('notif-009', 'org-003', 'Event Draft Reminder', 'Don''t forget to complete and publish your Creative Design Bootcamp event. It''s currently in draft status.', false),

-- Notifications for sponsor users
('notif-010', 'spon-001', 'Booth Setup Reminder', 'Your virtual booth setup for Tech Innovation Summit 2024 is due in 3 days. Complete your customization now.', false),
('notif-011', 'spon-002', 'Lead Generation Update', 'You''ve captured 15 new leads this week from your event participation. Review them in your dashboard.', true)
ON CONFLICT (id) DO NOTHING;

-- Create sample event analytics
INSERT INTO event_analytics (id, event_id, views, registrations, conversion_rate, revenue, top_referrers) VALUES
('ana-001', 'evt-001', 2450, 300, 12.24, 89565.00, ARRAY['Direct', 'Social Media', 'Email Campaign', 'Partner Referral']),
('ana-002', 'evt-002', 1890, 111, 5.87, 19339.00, ARRAY['Google Search', 'LinkedIn', 'Email Campaign']),
('ana-003', 'evt-003', 1200, 82, 6.83, 7533.00, ARRAY['Direct', 'Sustainability Blog', 'Partner Website']),
('ana-004', 'evt-004', 1560, 155, 9.94, 67845.00, ARRAY['LinkedIn', 'Direct', 'Industry Publication']),
('ana-005', 'evt-006', 890, 93, 10.45, 4047.00, ARRAY['Startup Community', 'Social Media', 'Word of Mouth'])
ON CONFLICT (event_id) DO NOTHING;

-- Insert sample booths for sponsors
INSERT INTO booths (id, sponsor_id, event_id, primary_color, secondary_color, banner_url, description, contact_info) VALUES
('booth-001', 'spon-001', 'evt-001', '#3b82f6', '#6366f1', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Discover cutting-edge enterprise technology solutions that drive innovation and growth. Visit our booth to learn about our latest AI-powered platforms and cloud infrastructure services.', '{"email": "booth@techcorp.com", "phone": "+1-555-0123", "website": "https://techcorp.com/solutions"}'),
('booth-002', 'spon-002', 'evt-001', '#8b5cf6', '#a78bfa', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Innovation Labs presents breakthrough research in AI and machine learning. Explore our latest developments and partnership opportunities.', '{"email": "partnerships@innovationlabs.com", "phone": "+1-555-0124", "website": "https://innovationlabs.com"}'),
('booth-003', 'spon-004', 'evt-002', '#ec4899', '#f472b6', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Marketing Dynamics - Your partner in data-driven marketing success. Learn about our comprehensive marketing automation and analytics solutions.', '{"email": "hello@marketingdynamics.com", "phone": "+1-555-0125", "website": "https://marketingdynamics.com"}')
ON CONFLICT (sponsor_id, event_id) DO NOTHING;

-- Insert sample leads for sponsors
INSERT INTO leads (id, sponsor_id, event_id, name, email, company, title, phone, notes, status) VALUES
('lead-001', 'spon-001', 'evt-001', 'Alex Thompson', 'alex@startupco.com', 'StartupCo', 'Product Manager', '+1-555-1001', 'Interested in AI solutions for product development. Mentioned budget of $50k-100k for Q2 implementation.', 'qualified'),
('lead-002', 'spon-001', 'evt-001', 'Maria Garcia', 'maria@designstudio.com', 'Design Studio', 'CTO', '+1-555-1002', 'Looking for cloud infrastructure solutions. Company is scaling rapidly and needs enterprise-grade tools.', 'contacted'),
('lead-003', 'spon-001', 'evt-001', 'John Smith', 'john@marketingpro.com', 'Marketing Pro', 'VP Technology', '+1-555-1003', 'Evaluating technology stack modernization. Interested in our cloud migration services.', 'new'),
('lead-004', 'spon-002', 'evt-001', 'Sarah Kim', 'sarah@techsolutions.com', 'Tech Solutions', 'Research Director', '+1-555-1004', 'Exploring AI/ML partnerships for research projects. Has budget allocated for innovation initiatives.', 'qualified'),
('lead-005', 'spon-004', 'evt-002', 'Carlos Rodriguez', 'carlos@businesscorp.com', 'Business Corp', 'Marketing Manager', '+1-555-1005', 'Needs comprehensive marketing automation solution. Currently using multiple disconnected tools.', 'contacted')
ON CONFLICT (id) DO NOTHING;

-- Insert sample marketing campaigns
INSERT INTO marketing_campaigns (id, event_id, name, type, subject, content, audience, status, sent_date, open_rate, click_rate) VALUES
('camp-001', 'evt-001', 'Pre-Event Announcement', 'email', 'Don''t Miss Tech Innovation Summit 2024!', 'Join us for the most anticipated technology event of the year. Early bird tickets are now available with exclusive benefits and networking opportunities.', 'all_subscribers', 'sent', '2024-01-10 09:00:00+00', 24.5, 8.2),
('camp-002', 'evt-001', 'Speaker Spotlight Series', 'email', 'Meet Our Keynote Speaker: Zawadi Thandwe', 'Get to know our featured keynote speaker and learn about her groundbreaking work in AI and technology leadership.', 'registered_users', 'sent', '2024-02-01 10:00:00+00', 31.2, 12.7),
('camp-003', 'evt-002', 'Last Chance Registration', 'email', 'Final Week to Register for Digital Marketing Masterclass', 'Don''t miss your chance to learn from industry experts. Only a few spots remaining for this intensive masterclass.', 'prospects', 'sent', '2024-03-13 14:00:00+00', 18.9, 6.4),
('camp-004', 'evt-004', 'Leadership Conference Countdown', 'email', '2 Weeks Until Leadership Excellence Conference', 'Prepare for an transformative leadership experience. Here''s what to expect and how to make the most of your attendance.', 'attendees', 'sent', '2024-03-19 11:00:00+00', 42.1, 15.3),
('camp-005', 'evt-006', 'Networking Mixer Invitation', 'social', 'Join Boston''s Premier Startup Networking Event', 'Connect with fellow entrepreneurs, investors, and startup enthusiasts. Special rates for verified founders!', 'all_subscribers', 'scheduled', NULL, 0.0, 0.0)
ON CONFLICT (id) DO NOTHING;

-- Update event analytics with more realistic data
UPDATE event_analytics SET
  views = CASE event_id
    WHEN 'evt-001' THEN 2450
    WHEN 'evt-002' THEN 1890
    WHEN 'evt-003' THEN 1200
    WHEN 'evt-004' THEN 1560
    WHEN 'evt-006' THEN 890
    ELSE views
  END,
  registrations = CASE event_id
    WHEN 'evt-001' THEN 300
    WHEN 'evt-002' THEN 111
    WHEN 'evt-003' THEN 82
    WHEN 'evt-004' THEN 155
    WHEN 'evt-006' THEN 93
    ELSE registrations
  END,
  conversion_rate = CASE event_id
    WHEN 'evt-001' THEN 12.24
    WHEN 'evt-002' THEN 5.87
    WHEN 'evt-003' THEN 6.83
    WHEN 'evt-004' THEN 9.94
    WHEN 'evt-006' THEN 10.45
    ELSE conversion_rate
  END,
  revenue = CASE event_id
    WHEN 'evt-001' THEN 89565.00
    WHEN 'evt-002' THEN 19339.00
    WHEN 'evt-003' THEN 7533.00
    WHEN 'evt-004' THEN 67845.00
    WHEN 'evt-006' THEN 4047.00
    ELSE revenue
  END,
  top_referrers = CASE event_id
    WHEN 'evt-001' THEN ARRAY['Direct', 'Social Media', 'Email Campaign', 'Partner Referral']
    WHEN 'evt-002' THEN ARRAY['Google Search', 'LinkedIn', 'Email Campaign']
    WHEN 'evt-003' THEN ARRAY['Direct', 'Sustainability Blog', 'Partner Website']
    WHEN 'evt-004' THEN ARRAY['LinkedIn', 'Direct', 'Industry Publication']
    WHEN 'evt-006' THEN ARRAY['Startup Community', 'Social Media', 'Word of Mouth']
    ELSE top_referrers
  END
WHERE event_id IN ('evt-001', 'evt-002', 'evt-003', 'evt-004', 'evt-006');

-- Create sample organizer events (using the organizer_events table)
INSERT INTO organizer_events (id, organizer_id, title, description, category, event_date, time, end_time, venue, capacity, image_url, status, visibility) VALUES
('org-evt-001', 'org-001', 'AI & Machine Learning Workshop', 'Hands-on workshop covering the fundamentals of AI and ML for business applications.', 'Technology', '2024-05-15', '10:00:00', '16:00:00', 'Tech Hub San Francisco', 80, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public'),
('org-evt-002', 'org-002', 'Creative Marketing Summit', 'Explore creative approaches to modern marketing challenges and opportunities.', 'Marketing', '2024-05-20', '09:00:00', '17:00:00', 'Creative Center NYC', 200, 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800', 'published', 'public'),
('org-evt-003', 'org-003', 'Startup Pitch Competition', 'Annual startup pitch competition with investor panel and networking opportunities.', 'Business', '2024-06-01', '14:00:00', '20:00:00', 'Innovation Center Austin', 150, 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', 'draft', 'public')
ON CONFLICT (id) DO NOTHING;

-- Create sample organizer ticket types
INSERT INTO organizer_ticket_types (id, event_id, name, description, price, currency, quantity, sold, sale_start, sale_end, is_active, benefits, restrictions) VALUES
('org-tkt-001', 'org-evt-001', 'Workshop Pass', 'Full access to AI/ML workshop with materials', 149.00, 'USD', 60, 45, '2024-04-01 00:00:00+00', '2024-05-10 23:59:59+00', true, ARRAY['Workshop access', 'Course materials', 'Certificate'], ARRAY['Refundable until 3 days before']),
('org-tkt-002', 'org-evt-001', 'Premium Pass', 'Workshop access plus one-on-one consultation', 249.00, 'USD', 20, 12, '2024-04-01 00:00:00+00', '2024-05-10 23:59:59+00', true, ARRAY['Workshop access', 'Premium materials', '30-min consultation'], ARRAY['Non-refundable']),
('org-tkt-003', 'org-evt-002', 'Summit Ticket', 'Full summit access with networking lunch', 199.00, 'USD', 150, 89, '2024-04-15 00:00:00+00', '2024-05-15 23:59:59+00', true, ARRAY['All sessions', 'Networking lunch', 'Resource kit'], ARRAY['Refundable until 5 days before']),
('org-tkt-004', 'org-evt-002', 'VIP Experience', 'Premium summit experience with exclusive benefits', 349.00, 'USD', 50, 28, '2024-04-15 00:00:00+00', '2024-05-15 23:59:59+00', true, ARRAY['VIP lounge', 'Speaker meet & greet', 'Premium swag'], ARRAY['Non-refundable'])
ON CONFLICT (id) DO NOTHING;

-- Create sample organizer attendees
INSERT INTO organizer_attendees (id, event_id, user_id, ticket_type_id, registration_date, check_in_status, payment_status, additional_info) VALUES
('org-att-001', 'org-evt-001', 'att-001', 'org-tkt-001', '2024-04-05 10:30:00+00', 'pending', 'completed', '{"experience_level": "beginner", "programming_languages": ["Python", "JavaScript"]}'),
('org-att-002', 'org-evt-001', 'att-002', 'org-tkt-002', '2024-04-08 14:15:00+00', 'pending', 'completed', '{"consultation_topic": "AI implementation strategy", "company_size": "50-100"}'),
('org-att-003', 'org-evt-002', 'att-003', 'org-tkt-003', '2024-04-20 09:45:00+00', 'pending', 'completed', '{"marketing_focus": "digital_campaigns", "budget_range": "10k-25k"}'),
('org-att-004', 'org-evt-002', 'att-004', 'org-tkt-004', '2024-04-22 16:20:00+00', 'pending', 'completed', '{"networking_goals": "find_agency_partners", "company_stage": "growth"}}')
ON CONFLICT (id) DO NOTHING;

-- Create sample organizer event analytics
INSERT INTO organizer_event_analytics (id, event_id, views, registrations, conversion_rate, revenue, top_referrers) VALUES
('org-ana-001', 'org-evt-001', 1200, 57, 4.75, 8493.00, ARRAY['Tech Community', 'LinkedIn', 'Direct']),
('org-ana-002', 'org-evt-002', 1850, 117, 6.32, 28233.00, ARRAY['Marketing Blogs', 'Social Media', 'Email']),
('org-ana-003', 'org-evt-003', 450, 0, 0.00, 0.00, ARRAY['Startup Community', 'AngelList'])
ON CONFLICT (event_id) DO NOTHING;

-- Add some sample app_users (for the admin panel functionality)
INSERT INTO app_users (id, email, password_hash, role, full_name, company, avatar_url, is_active) VALUES
('app-001', 'admin@eventease.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVjHUxofy', 'organizer', 'Admin User', 'EventEase Corp', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('app-002', 'organizer@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVjHUxofy', 'organizer', 'Event Organizer', 'Events Plus', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('app-003', 'attendee@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVjHUxofy', 'attendee', 'Event Attendee', 'Tech Company', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('app-004', 'sponsor@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVjHUxofy', 'sponsor', 'Sponsor Representative', 'Sponsor Corp', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400', true)
ON CONFLICT (id) DO NOTHING;

-- Update ticket sales numbers to be more realistic
UPDATE ticket_types SET
  sold = CASE id
    WHEN 'tkt-001' THEN 85
    WHEN 'tkt-002' THEN 180
    WHEN 'tkt-003' THEN 35
    WHEN 'tkt-004' THEN 89
    WHEN 'tkt-005' THEN 22
    WHEN 'tkt-006' THEN 67
    WHEN 'tkt-007' THEN 15
    WHEN 'tkt-008' THEN 120
    WHEN 'tkt-009' THEN 35
    WHEN 'tkt-010' THEN 75
    WHEN 'tkt-011' THEN 18
    ELSE sold
  END
WHERE id IN ('tkt-001', 'tkt-002', 'tkt-003', 'tkt-004', 'tkt-005', 'tkt-006', 'tkt-007', 'tkt-008', 'tkt-009', 'tkt-010', 'tkt-011');

-- Update organizer ticket sales
UPDATE organizer_ticket_types SET
  sold = CASE id
    WHEN 'org-tkt-001' THEN 45
    WHEN 'org-tkt-002' THEN 12
    WHEN 'org-tkt-003' THEN 89
    WHEN 'org-tkt-004' THEN 28
    ELSE sold
  END
WHERE id IN ('org-tkt-001', 'org-tkt-002', 'org-tkt-003', 'org-tkt-004');

-- Add some variety to event statuses
UPDATE events SET
  status = CASE id
    WHEN 'evt-005' THEN 'draft'
    ELSE status
  END
WHERE id = 'evt-005';

-- Add some completed events for historical data
INSERT INTO events (id, organizer_id, title, description, category, event_date, start_time, end_time, venue, image_url, status, visibility, max_attendees, capacity, date, time) VALUES
('evt-007', 'org-001', 'Web Development Conference 2023', 'Annual conference for web developers and designers.', 'Technology', '2023-11-15', '09:00:00', '18:00:00', 'Tech Center San Jose', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 'completed', 'public', 300, 300, '2023-11-15', '09:00:00'),
('evt-008', 'org-002', 'Marketing Trends 2023', 'Exploring the latest trends in digital marketing and advertising.', 'Marketing', '2023-10-20', '10:00:00', '16:00:00', 'Marketing Hub LA', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800', 'completed', 'public', 200, 200, '2023-10-20', '10:00:00')
ON CONFLICT (id) DO NOTHING;

-- Create analytics for completed events
INSERT INTO event_analytics (id, event_id, views, registrations, conversion_rate, revenue, top_referrers) VALUES
('ana-006', 'evt-007', 3200, 285, 8.91, 142500.00, ARRAY['Developer Community', 'GitHub', 'Tech Blogs']),
('ana-007', 'evt-008', 2100, 178, 8.48, 35560.00, ARRAY['Marketing Publications', 'LinkedIn', 'Google Ads'])
ON CONFLICT (event_id) DO NOTHING;

-- Add more attendees to make events look active
INSERT INTO event_attendees (id, event_id, user_id, ticket_type_id, registration_date, check_in_status, payment_status, additional_info) VALUES
-- More attendees for Tech Innovation Summit
('ea-013', 'evt-001', 'att-005', 'tkt-001', '2024-01-22 11:30:00+00', 'pending', 'completed', '{"interests": ["Cloud Computing", "DevOps"], "experience": "senior"}'),
('ea-014', 'evt-001', 'spon-001', 'tkt-003', '2024-01-18 15:45:00+00', 'pending', 'completed', '{"attending_as": "sponsor_representative", "booth_number": "A1"}'),

-- More attendees for other events
('ea-015', 'evt-002', 'att-004', 'tkt-004', '2024-02-15 13:20:00+00', 'pending', 'completed', '{"marketing_channels": ["Social Media", "Email"], "company_size": "medium"}'),
('ea-016', 'evt-003', 'att-001', 'tkt-006', '2024-02-25 10:15:00+00', 'pending', 'completed', '{"sustainability_focus": "waste_reduction", "current_initiatives": "recycling_program"}'),
('ea-017', 'evt-004', 'att-002', 'tkt-008', '2024-03-01 12:45:00+00', 'pending', 'completed', '{"leadership_experience": "5_years", "team_size": "8_people"}'),
('ea-018', 'evt-006', 'att-004', 'tkt-010', '2024-03-10 14:30:00+00', 'pending', 'completed', '{"startup_focus": "fintech", "funding_stage": "seed"}')
ON CONFLICT (id) DO NOTHING;

-- Add some checked-in attendees to show activity
UPDATE event_attendees SET 
  check_in_status = 'checked-in'
WHERE id IN ('ea-001', 'ea-005', 'ea-007', 'ea-009', 'ea-011');

-- Add some no-show attendees for realistic data
UPDATE event_attendees SET 
  check_in_status = 'no-show'
WHERE id IN ('ea-003', 'ea-008');

-- Create some sample data for the new organizer tables
INSERT INTO organizer_attendees (id, event_id, user_id, ticket_type_id, registration_date, check_in_status, payment_status, additional_info) VALUES
('org-att-005', 'org-evt-001', 'att-001', 'org-tkt-001', '2024-04-10 11:00:00+00', 'pending', 'completed', '{"workshop_track": "beginner", "programming_experience": "intermediate"}'),
('org-att-006', 'org-evt-001', 'att-003', 'org-tkt-002', '2024-04-12 15:30:00+00', 'pending', 'completed', '{"consultation_focus": "AI_strategy", "implementation_timeline": "Q3_2024"}'),
('org-att-007', 'org-evt-002', 'att-002', 'org-tkt-003', '2024-04-25 09:15:00+00', 'pending', 'completed', '{"marketing_goals": "brand_awareness", "target_audience": "millennials"}'),
('org-att-008', 'org-evt-002', 'att-005', 'org-tkt-004', '2024-04-28 13:45:00+00', 'pending', 'completed', '{"vip_interests": ["speaker_networking", "exclusive_content"], "company_type": "agency"}}')
ON CONFLICT (id) DO NOTHING;

-- Add some sample data to make the database feel alive and realistic
-- This ensures that when users log in, they see a populated, active platform rather than empty tables

-- Final verification: Ensure all foreign key relationships are valid
-- This query will help identify any orphaned records
DO $$
BEGIN
  -- Check for orphaned event_attendees
  IF EXISTS (
    SELECT 1 FROM event_attendees ea
    LEFT JOIN events e ON ea.event_id = e.id
    LEFT JOIN profiles p ON ea.user_id = p.id
    WHERE e.id IS NULL OR p.id IS NULL
  ) THEN
    RAISE NOTICE 'Warning: Found orphaned event_attendees records';
  END IF;

  -- Check for orphaned event_speakers
  IF EXISTS (
    SELECT 1 FROM event_speakers es
    LEFT JOIN events e ON es.event_id = e.id
    LEFT JOIN speakers s ON es.speaker_id = s.id
    WHERE e.id IS NULL OR s.id IS NULL
  ) THEN
    RAISE NOTICE 'Warning: Found orphaned event_speakers records';
  END IF;

  -- Check for orphaned event_sponsors
  IF EXISTS (
    SELECT 1 FROM event_sponsors esp
    LEFT JOIN events e ON esp.event_id = e.id
    LEFT JOIN sponsors s ON esp.sponsor_id = s.id
    WHERE e.id IS NULL OR s.id IS NULL
  ) THEN
    RAISE NOTICE 'Warning: Found orphaned event_sponsors records';
  END IF;

  RAISE NOTICE 'Database population completed successfully!';
  RAISE NOTICE 'Sample data includes:';
  RAISE NOTICE '- % user profiles across all roles', (SELECT COUNT(*) FROM profiles);
  RAISE NOTICE '- % events (published and draft)', (SELECT COUNT(*) FROM events);
  RAISE NOTICE '- % speakers with expertise areas', (SELECT COUNT(*) FROM speakers);
  RAISE NOTICE '- % sponsors across all tiers', (SELECT COUNT(*) FROM sponsors);
  RAISE NOTICE '- % ticket types with realistic pricing', (SELECT COUNT(*) FROM ticket_types);
  RAISE NOTICE '- % event registrations', (SELECT COUNT(*) FROM event_attendees);
  RAISE NOTICE '- % blog articles', (SELECT COUNT(*) FROM blog_articles);
  RAISE NOTICE '- % resources for download', (SELECT COUNT(*) FROM resources);
  RAISE NOTICE '- % press releases', (SELECT COUNT(*) FROM press_releases);
  RAISE NOTICE '- % user notifications', (SELECT COUNT(*) FROM notifications);
END $$;