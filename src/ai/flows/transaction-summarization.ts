'use server';

/**
 * @fileOverview A transaction summarization AI agent.
 *
 * - summarizeTransactions - A function that handles the transaction summarization process.
 * - TransactionSummarizationInput - The input type for the summarizeTransactions function.
 * - TransactionSummarizationOutput - The return type for the summarizeTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().describe('Amount in INR'),
  category: z.enum(['Food', 'Travel', 'Rent', 'Hostel', 'Shopping', 'Bills', 'Others']),
  date: z.string().describe('Date of the transaction (YYYY-MM-DD)'),
  description: z.string().optional().describe('Optional description of the transaction'),
});

const TransactionSummarizationInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array of transactions to analyze.'),
});
export type TransactionSummarizationInput = z.infer<typeof TransactionSummarizationInputSchema>;

const TransactionSummarizationOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s spending habits and potential saving areas.'),
});
export type TransactionSummarizationOutput = z.infer<typeof TransactionSummarizationOutputSchema>;

export async function summarizeTransactions(input: TransactionSummarizationInput): Promise<TransactionSummarizationOutput> {
  return transactionSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transactionSummarizationPrompt',
  input: {schema: TransactionSummarizationInputSchema},
  output: {schema: TransactionSummarizationOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the following transaction history and provide a summary of the user's spending habits, highlighting potential areas where they can save money. Be mindful that the user is Indian and the currency is in Indian Rupees (₹ INR).

Transactions:
{{#each transactions}}
  - Type: {{this.type}}, Amount: ₹{{this.amount}}, Category: {{this.category}}, Date: {{this.date}}{{#if this.description}}, Description: {{this.description}}{{/if}}
{{/each}}
`,
});

const transactionSummarizationFlow = ai.defineFlow(
  {
    name: 'transactionSummarizationFlow',
    inputSchema: TransactionSummarizationInputSchema,
    outputSchema: TransactionSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
