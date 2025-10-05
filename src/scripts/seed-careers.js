'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Career = require('../models/Career');

const jobListings = [
	{
		title: 'Senior Test Engineer - Automotive',
		department: 'Engineering',
		location: 'Detroit, MI',
		type: 'Full-time',
		level: 'Senior Level',
		description:
			'Lead automotive testing projects for major OEMs. Experience with crash testing and vehicle safety systems required.',
		isActive: true,
	},
	{
		title: 'Medical Device Certification Specialist',
		department: 'Healthcare',
		location: 'San Diego, CA',
		type: 'Full-time',
		level: 'Mid Level',
		description:
			'Support medical device manufacturers through FDA and international certification processes.',
		isActive: true,
	},
	{
		title: 'Cybersecurity Consultant',
		department: 'Technology',
		location: 'Austin, TX',
		type: 'Full-time',
		level: 'Senior Level',
		description:
			'Provide cybersecurity assessments and consulting for enterprise clients across industries.',
		isActive: true,
	},
	{
		title: 'Quality Assurance Inspector',
		department: 'Manufacturing',
		location: 'Phoenix, AZ',
		type: 'Full-time',
		level: 'Entry Level',
		description:
			'Conduct quality inspections and audits for manufacturing facilities. Travel required.',
		isActive: true,
	},
	{
		title: 'Environmental Testing Technician',
		department: 'Environmental',
		location: 'Seattle, WA',
		type: 'Full-time',
		level: 'Mid Level',
		description:
			'Perform environmental testing and analysis for compliance with environmental regulations.',
		isActive: true,
	},
	{
		title: 'Business Development Manager',
		department: 'Sales',
		location: 'New York, NY',
		type: 'Full-time',
		level: 'Senior Level',
		description:
			'Drive new business growth in the Northeast region. Technical background preferred.',
		isActive: true,
	},
];

async function run() {
	if (!process.env.MONGODB_URI) {
		throw new Error('MONGODB_URI is not set');
	}

	await mongoose.connect(process.env.MONGODB_URI);

	// Wipe existing careers before seeding
	await Career.deleteMany({});

	const docs = await Career.insertMany(jobListings);
	console.log(`Seeded ${docs.length} careers.`);

	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});


