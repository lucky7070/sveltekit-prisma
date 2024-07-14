<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	export let data;
	export let form;

	let loading = false;
	let loading_delete = false;
</script>

<ul>
	{#each data.todos as todo}
		<li class={todo.completed ? `done` : `pending`}>
			<span>{todo.text}</span>
			<form action="?/delete_todos" method="POST" use:enhance>
				<input type="hidden" name="id" value={todo.id} />
				<button class="delete" type="submit">❌</button>
			</form>
		</li>
	{/each}
</ul>

<div>
	<form
		action="?/add_todos"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
	>
		<input type="text" name="todo" />

		{#if form?.missing}<p class="error">This field is required</p>{/if}

		<button type="submit" aria-busy={loading} class:danger={loading}>+ Add Todo</button>
	</form>
	<form
		action="?/clear_all"
		method="post"
		use:enhance={() => {
			loading_delete = true;
			return () => {
				loading_delete = false;
			};
		}}
	>
		<button type="submit" aria-busy={loading_delete} class:danger={loading_delete}>Clear All</button
		>
	</form>
</div>

<style>
	ul {
		padding: 0;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	span {
		text-transform: capitalize;
	}

	.delete {
		margin: 0;
		background: none;
		border: none;
	}

	.done {
		border: 2px solid green;
		padding: 10px 20px;
		border-radius: 15px;
	}

	.pending {
		border: 2px solid tomato;
		padding: 10px 20px;
		border-radius: 15px;
	}

	.error {
		color: tomato;
		text-align: center;
	}
</style>
