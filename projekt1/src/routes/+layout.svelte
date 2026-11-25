<script>
	import DemoLinks from './demo/DemoLinks.svelte';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
<DemoLinks />
