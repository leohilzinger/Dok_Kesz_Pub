<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { authClient } from '#lib/auth-client.js';
	import { goto, invalidateAll } from '$app/navigation';

	/** @type {{ data: { currentUser: { name: string }, users: Array<{ name: string, totalSeconds: number }> } }} */
	let { data } = $props();

	/** @type {HTMLCanvasElement | undefined} */
	let chartCanvas = $state();

	/** @type {Chart | undefined} */
	let chartInstance;

	$effect(() => {
		if (chartInstance && data.users) {
			chartInstance.data.labels = data.users.map((u) => u.name);
			chartInstance.data.datasets[0].data = data.users.map((u) => u.totalSeconds);
			chartInstance.update();
		}
	});

	onMount(() => {
		if (!chartCanvas) return;

		chartInstance = new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels: data.users.map((u) => u.name),
				datasets: [
					{
						label: 'Eltöltött idő (másodperc)',
						data: data.users.map((u) => u.totalSeconds),
						backgroundColor: 'rgba(37, 99, 235, 0.7)',
						borderColor: 'rgb(37, 99, 235)',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					y: { beginAtZero: true }
				}
			}
		});

		const interval = setInterval(async () => {
			if (!document.hidden) {
				const res = await fetch('/api/ping', { method: 'POST' });
				if (res.ok) {
					await invalidateAll();
				}
			}
		}, 10000);

		return () => {
			clearInterval(interval);
			chartInstance?.destroy();
		};
	});

	async function handleLogout() {
		await authClient.signOut();
		goto('/login');
	}
</script>

<main style="max-width: 800px; margin: 2rem auto; padding: 1rem; font-family: sans-serif;">
	<header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 1rem;">
		<div>
			<h1 style="margin: 0;">Felhasználói statisztika</h1>
			<p style="margin: 0.3rem 0 0; color: #555;">Bejelentkezve mint: <strong>{data.currentUser.name}</strong></p>
		</div>
		<button onclick={handleLogout} style="padding: 0.5rem 1rem; cursor: pointer; background: #ef4444; color: white; border: none; border-radius: 4px;">
			Kijelentkezés
		</button>
	</header>

	<section style="margin-top: 2rem;">
		<p>Az oldal 10 másodpercenként méri az aktivitást és élőben frissíti a diagramot:</p>
		<div style="margin-top: 1.5rem; background: #fff; padding: 1rem; border: 1px solid #eee; border-radius: 8px;">
			<canvas bind:this={chartCanvas}></canvas>
		</div>
	</section>
</main>