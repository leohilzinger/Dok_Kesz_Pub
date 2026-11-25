import { redirect } from '@sveltejs/kit';
import { auth } from '#lib/server/auth.js';
import { db } from '#lib/server/db/index.js';
import { user } from '#lib/server/db/auth.schema.js';
/** @type {import('./$types').PageServerLoad} */
export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		throw redirect(302, '/login');
	}

	const allUsers = await db
		.select({
			name: user.name,
			totalSeconds: user.totalSeconds
		})
		.from(user);

	return {
		currentUser: session.user,
		users: allUsers
	};
}