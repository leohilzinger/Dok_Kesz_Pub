<script>
	import { authClient } from '#lib/auth-client.js';
	import { goto } from '$app/navigation';

	let isRegister = $state(false);
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let errorMsg = $state('');
	let loading = $state(false);

	/** @param {SubmitEvent} e */
	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		errorMsg = '';

		try {
			if (isRegister) {
				const { error } = await authClient.signUp.email({
					email,
					password,
					name
				});
				if (error) {
					errorMsg = error.message || 'Hiba a regisztráció során';
				} else {
					goto('/');
				}
			} else {
				const { error } = await authClient.signIn.email({
					email,
					password
				});
				if (error) {
					errorMsg = error.message || 'Hibás e-mail vagy jelszó';
				} else {
					goto('/');
				}
			}
		} catch (err) {
			errorMsg = 'Szerver hiba: ' + (err instanceof Error ? err.message : String(err));
		} finally {
			loading = false;
		}
	}
</script>

<div style="max-width: 400px; margin: 4rem auto; font-family: sans-serif;">
	<h2>{isRegister ? 'Regisztráció' : 'Bejelentkezés'}</h2>

	{#if errorMsg}
		<p style="color: red; background: #fee; padding: 0.5rem; border-radius: 4px;">{errorMsg}</p>
	{/if}

	<form onsubmit={handleSubmit} style="display: flex; flex-direction: column; gap: 1rem;">
		{#if isRegister}
			<input type="text" bind:value={name} placeholder="Név (ez jelenik meg a diagramon)" required style="padding: 0.6rem;" />
		{/if}
		<input type="email" bind:value={email} placeholder="E-mail cím" required style="padding: 0.6rem;" />
		<input type="password" bind:value={password} placeholder="Jelszó (min. 8 karakter)" required style="padding: 0.6rem;" />
		
		<button type="submit" disabled={loading} style="padding: 0.7rem; cursor: pointer; background: #2563eb; color: white; border: none; border-radius: 4px;">
			{loading ? 'Folyamatban...' : (isRegister ? 'Regisztráció' : 'Belépés')}
		</button>
	</form>

	<p style="margin-top: 1rem;">
		{isRegister ? 'Van már fiókod?' : 'Még nincs fiókod?'}
		<button type="button" onclick={() => (isRegister = !isRegister)} style="background: none; border: none; color: #2563eb; text-decoration: underline; cursor: pointer;">
			{isRegister ? 'Jelentkezz be!' : 'Regisztrálj!'}
		</button>
	</p>
</div>