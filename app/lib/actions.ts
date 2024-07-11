"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: "customerId should be a string", required_error: "customerId is required" }),
    amount: z.coerce.number({ required_error: "amount is required" }).gt(0, { message: "amount should be greater than 0" }),
    status: z.enum(['paid', 'pending'],
        { invalid_type_error: "status should be either 'paid' or 'pending'", required_error: "status is required" }),
    date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(previousState: State, formData: FormData) {
    const validateFields = CreateInvoice.safeParse(Object.fromEntries(formData.entries()));
    if (!validateFields.success) {
        return { errors: validateFields.error.flatten().fieldErrors, message: "Invalid input" };
    }
    const { customerId, status, amount } = validateFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
            `;
    } catch (error) {
        return { message: "database error : Failed to create invoice" };
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });


export async function updateInvoice(id: string, previousState: State, formData: FormData) {
    const validateFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    if (!validateFields.success) {
        return { errors: validateFields.error.flatten().fieldErrors, message: "Invalid input" };
    }
    const { customerId, amount, status } = validateFields.data

    const amountInCents = amount * 100;

    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
    } catch (error) {
        return { message: "database error : Failed to update invoice" };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        return { error: "database error : Failed to delete invoice" };
    }
    revalidatePath('/dashboard/invoices');
}