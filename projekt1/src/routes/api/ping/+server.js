import { json } from '@sveltejs/kit';
import { auth } from '#lib/server/auth.js';
import { db } from '#lib/server/db/index.js';
import { user } from '#lib/server/db/auth.schema.js';
import { eq, sql } from 'drizzle-orm';

export async function POST({ request }) {
	// Megnézzük, ki van bejelentkezve
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return json({ error: 'Nincs bejelentkezve' }, { status: 401 });
	}

	// Növeljük az eltöltött időt 10 másodperccel az adatbázisban
	await db
		.update(user)
		.set({
			totalSeconds: sql`${user.totalSeconds} + 10`
		})
		.where(eq(user.id, session.user.id));

	return json({ success: true });
}