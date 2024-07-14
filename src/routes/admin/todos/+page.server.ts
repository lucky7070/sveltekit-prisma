import { db } from '$lib/database'
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
    const todos = await db.todos.findMany({
        where: { userId: locals.user.id },
        select: { id: true, text: true, completed: true, createdAt: true }
    });
    return { todos }
}

const add_todos: Action = async ({ request, locals }) => {
    const formData = await request.formData()

    const todo = String(formData.get('todo'))
    if (!todo) return fail(400, { missing: true })

    await db.todos.create({
        data: {
            userId: locals.user.id,
            completed: false,
            text: todo
        },
    })

    return { success: true }
}

const delete_todos: Action = async ({ request, locals }) => {
    const formData = await request.formData()

    const id = formData.get('id');
    if (!id) return fail(400, { invalid: true })

    await db.todos.delete({ where: { id: Number(id), userId: locals.user.id } })
    return { success: true }

}

const clear_all: Action = async ({ request, locals }) => {
    await db.todos.deleteMany({ where: { userId: locals.user.id } })
    return { success: true }
}

export const actions: Actions = { add_todos, delete_todos, clear_all }