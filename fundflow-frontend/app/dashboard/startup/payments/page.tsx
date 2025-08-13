"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DollarSign,
    CreditCard,
    Wallet,
    CheckCircle,
    AlertCircle,
    Clock,
    X,
    Search,
    Filter,
    Download,
    Eye,
    ArrowUpRight,
    TrendingUp,
    Users,
    Calendar,
    BarChart3,
    Banknote
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface Payment {
    id: string;
    investorName: string;
    campaignTitle: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    paymentMethod: 'bank_transfer' | 'credit_card' | 'crypto' | 'wire_transfer';
    date: string;
    transactionId: string;
    fees: number;
    netAmount: number;
    currency: string;
    description?: string;
}

const mockPayments: Payment[] = [
    {
        id: '1',
        investorName: 'John Doe',
        campaignTitle: 'AI Healthcare Platform',
        amount: 5000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        date: '2024-01-15T10:30:00Z',
        transactionId: 'TXN-001-2024',
        fees: 50,
        netAmount: 4950,
        currency: 'USD',
        description: 'Series A investment round'
    },
    {
        id: '2',
        investorName: 'Sarah Johnson',
        campaignTitle: 'Sustainable Energy Storage',
        amount: 10000,
        status: 'pending',
        paymentMethod: 'credit_card',
        date: '2024-01-14T16:45:00Z',
        transactionId: 'TXN-002-2024',
        fees: 100,
        netAmount: 9900,
        currency: 'USD',
        description: 'Seed funding contribution'
    },
    {
        id: '3',
        investorName: 'Michael Chen',
        campaignTitle: 'AI Healthcare Platform',
        amount: 7500,
        status: 'completed',
        paymentMethod: 'crypto',
        date: '2024-01-13T14:20:00Z',
        transactionId: 'TXN-003-2024',
        fees: 75,
        netAmount: 7425,
        currency: 'USD',
        description: 'Angel investment'
    },
    {
        id: '4',
        investorName: 'Emily Rodriguez',
        campaignTitle: 'EdTech Learning Platform',
        amount: 3000,
        status: 'failed',
        paymentMethod: 'credit_card',
        date: '2024-01-12T11:15:00Z',
        transactionId: 'TXN-004-2024',
        fees: 30,
        netAmount: 0,
        currency: 'USD',
        description: 'Early stage investment'
    },
    {
        id: '5',
        investorName: 'David Kim',
        campaignTitle: 'Sustainable Energy Storage',
        amount: 15000,
        status: 'completed',
        paymentMethod: 'wire_transfer',
        date: '2024-01-11T09:30:00Z',
        transactionId: 'TXN-005-2024',
        fees: 150,
        netAmount: 14850,
        currency: 'USD',
        description: 'Strategic investment'
    }
];

const PaymentsPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('payments');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const filteredPayments = mockPayments.filter(payment => {
        const matchesSearch = payment.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
        const matchesPaymentMethod = selectedPaymentMethod === 'all' || payment.paymentMethod === selectedPaymentMethod;

        return matchesSearch && matchesStatus && matchesPaymentMethod;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'refunded': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        const icons = {
            bank_transfer: <Banknote className="w-4 h-4" />,
            credit_card: <CreditCard className="w-4 h-4" />,
            crypto: <Wallet className="w-4 h-4" />,
            wire_transfer: <DollarSign className="w-4 h-4" />
        };
        return icons[method as keyof typeof icons];
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels = {
            bank_transfer: 'Bank Transfer',
            credit_card: 'Credit Card',
            crypto: 'Cryptocurrency',
            wire_transfer: 'Wire Transfer'
        };
        return labels[method as keyof typeof labels];
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalFees = filteredPayments.reduce((sum, payment) => sum + payment.fees, 0);
    const totalNetAmount = filteredPayments.reduce((sum, payment) => sum + payment.netAmount, 0);
    const completedPayments = filteredPayments.filter(payment => payment.status === 'completed').length;
    const pendingPayments = filteredPayments.filter(payment => payment.status === 'pending').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
            <DashboardNavbar />
            <StartupSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeItem={activeItem}
                onItemClick={handleItemClick}
                userName="Startup Founder"
                userRole="Startup Founder"
            />
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                {/* Main Content */}
                <main className="pt-10 p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Payments & Transactions
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Track all incoming investments and payment transactions for your campaigns.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Received
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalAmount)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    From all investors
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Net Amount
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalNetAmount)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    After fees
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Fees
                                </CardTitle>
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalFees)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Processing fees
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Completed
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {completedPayments}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Successful payments
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Pending
                                </CardTitle>
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {pendingPayments}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Awaiting confirmation
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search payments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Status Filter */}
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Payment Method Filter */}
                                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Methods" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Methods</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="credit_card">Credit Card</SelectItem>
                                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                                        <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <Button variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button variant="outline">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Reports
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payments List */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">
                                Payment Transactions
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Recent payment activities and their current status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredPayments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            {/* Payment Method Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                    {getPaymentMethodIcon(payment.paymentMethod)}
                                                </div>
                                            </div>

                                            {/* Payment Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        {payment.investorName}
                                                    </h3>
                                                    <Badge className={getStatusColor(payment.status)}>
                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {getPaymentMethodLabel(payment.paymentMethod)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                                    {payment.campaignTitle}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Transaction ID: {payment.transactionId}
                                                </p>
                                                {payment.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        {payment.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Amount and Actions */}
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(payment.amount)}
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    Net: {formatCurrency(payment.netAmount)}
                                                </div>
                                                <div className="text-xs text-slate-400 dark:text-slate-500">
                                                    Fees: {formatCurrency(payment.fees)}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-blue-600"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-green-600"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredPayments.length === 0 && (
                                    <div className="text-center py-12">
                                        <DollarSign className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            No payments found
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            {searchTerm || selectedStatus !== 'all' || selectedPaymentMethod !== 'all'
                                                ? 'Try adjusting your filters or search terms.'
                                                : 'No payment transactions have been recorded yet.'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default PaymentsPage;
