// auth-actions.tsx
'use server'

export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let errors: { email?: string, password?: string } = {};

    if (!email.includes('@')) {
        errors.email = 'Please enter a valid email address';
    }

    if (password.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    // Continue with the signup logic (e.g., call your backend API)
}
