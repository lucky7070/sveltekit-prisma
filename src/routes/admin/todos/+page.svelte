<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let loading = false;
	let loading_delete = false;
</script>

<ul>
	{#each data.todos as todo}
		<li class={todo.completed ? `done` : `pending`}>
			<form action="?/toggle_complete" method="POST" use:enhance>
				<input type="hidden" name="id" value={todo.id} />
				<button type="submit" class="mb-0"> Done </button>
			</form>
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
		<button type="submit" aria-busy={loading} class:danger={loading}> + Add Todo </button>
	</form>
	<form
		action="?/clear_all"
		method="post"
		use:enhance={() => {
			loading_delete = true;
			return async ({ update }) => {
				loading_delete = false;
				await update();
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

	.mb-0 {
		margin-bottom: 0;
	}
</style>
