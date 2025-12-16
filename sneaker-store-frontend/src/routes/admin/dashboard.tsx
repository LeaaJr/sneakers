// src/routes/admin/dashboard.tsx

import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { TrendingUp, Package, Tag, ShoppingBag } from 'lucide-react';

// Define la ruta en /admin/dashboard
export const Route = createFileRoute('/admin/dashboard')({
    component: AdminDashboardPage,
});

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-amber-500 bg-amber-100 p-3 rounded-full">
            {icon}
        </div>
    </div>
);

function AdminDashboardPage() {
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value="$45,231.89" 
                    icon={<TrendingUp className="h-5 w-5" />}
                />
                <StatCard 
                    title="New Orders" 
                    value="124" 
                    icon={<Package className="h-5 w-5" />}
                />
                <StatCard 
                    title="Products" 
                    value="350" 
                    icon={<ShoppingBag className="h-5 w-5" />}
                />
                <StatCard 
                    title="Brands" 
                    value="15" 
                    icon={<Tag className="h-5 w-5" />}
                />
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <p className="text-gray-600">Placeholder for recent orders or user actions...</p>
            </div>
        </>
    );
}