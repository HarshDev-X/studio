'use client';

import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { transactionCategories } from '@/lib/types';
import { useMemo } from 'react';

interface OverviewChartsProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#f59e0b',
  '#10b981',
];


export default function OverviewCharts({ transactions }: OverviewChartsProps) {
    const expenses = transactions.filter(t => t.type === 'expense');

    const monthlyOverview = useMemo(() => {
        const data: { [key: string]: { income: number; expense: number } } = {};
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!data[month]) {
                data[month] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                data[month].income += t.amount;
            } else {
                data[month].expense += t.amount;
            }
        });

        return Object.entries(data).map(([name, values]) => ({ name, ...values })).reverse();
    }, [transactions]);
    
    const categoryExpenses = useMemo(() => {
        const data: { [key: string]: number } = {};
        transactionCategories.forEach(cat => data[cat] = 0);

        expenses.forEach(t => {
            if (data[t.category] !== undefined) {
                data[t.category] += t.amount;
            }
        });

        return Object.entries(data).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    }, [expenses]);


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">Monthly Overview</CardTitle>
                <CardDescription>A bar chart showing your income and expenses over the last few months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyOverview}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip
                            cursor={{fill: 'hsla(var(--muted))'}}
                            contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                         />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="hsl(142.1 76.2% 36.3%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Expense" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Expense by Category</CardTitle>
                <CardDescription>A pie chart showing the breakdown of your expenses.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                         <Tooltip 
                            contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                         />
                        <Pie data={categoryExpenses} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x  = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy  + radius * Math.sin(-midAngle * (Math.PI / 180));
                            return (percent > 0.05) ? <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>{`${(percent * 100).toFixed(0)}%`}</text> : null;
                        }}>
                        {
                            categoryExpenses.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        }
                        </Pie>
                        <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
