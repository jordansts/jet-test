export function logError(message: string, error: Error): void {
    const formattedError = `
        Error: ${message}
        Message: ${error.message}
        Stack: ${error.stack}
    `;
    console.error(formattedError);
}
