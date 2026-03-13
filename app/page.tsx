'use client';

import { useState } from 'react';
import { Menu, User, Home, Package, ClipboardList, DollarSign } from 'lucide-react';

export default function NandaTentHouse() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [itemsModalOpen, setItemsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const closeItemsModal = () => {
    setItemsModalOpen(false);
    setActiveTab('home');
  };

  // Dummy items data
  const dummyItems = [
    {
      id: '1',
      name: 'Wedding Tent (20x30)',
      category: 'Tents',
      available: 5,
      total: 8,
      price: '₹2500/day',
      description: 'Large wedding tent with full setup',
      status: 'Available'
    },
    {
      id: '2',
      name: 'Party Tent (10x15)',
      category: 'Tents',
      available: 8,
      total: 10,
      price: '₹1500/day',
      description: 'Medium party tent for gatherings',
      status: 'Available'
    },
    {
      id: '3',
      name: 'Stage Backdrop',
      category: 'Decor',
      available: 3,
      total: 5,
      price: '₹800/day',
      description: 'Elegant backdrop for events',
      status: 'Low Stock'
    },
    {
      id: '4',
      name: 'Chair Set (50)',
      category: 'Furniture',
      available: 4,
      total: 6,
      price: '₹300/day',
      description: 'Comfortable chairs for seating',
      status: 'Available'
    },
    {
      id: '5',
      name: 'Table (6ft)',
      category: 'Furniture',
      available: 6,
      total: 8,
      price: '₹200/day',
      description: 'Round table for dining/events',
      status: 'Available'
    },
    {
      id: '6',
      name: 'Sound System',
      category: 'Equipment',
      available: 2,
      total: 3,
      price: '₹1000/day',
      description: 'Professional audio setup',
      status: 'Low Stock'
    }
  ];

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full max-w-md mx-auto relative">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-3 flex items-center justify-between max-w-md mx-auto w-full">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-green-700 rounded"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">NANDA TENT HOUSE</h1>
        <button className="p-2 hover:bg-green-700 rounded" aria-label="Profile">
          <User size={24} />
        </button>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <button
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <Package size={20} />
            <span className="font-medium">Tent Items</span>
          </button>
          <button
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <ClipboardList size={20} />
            <span className="font-medium">Orders</span>
          </button>
          <button
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <DollarSign size={20} />
            <span className="font-medium">Billing</span>
          </button>
          <button
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <User size={20} />
            <span className="font-medium">Customers</span>
          </button>
          <button
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <Menu size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Home Tab Content */}
      {activeTab === 'home' && (
        <main className="flex-1 overflow-y-auto pt-16 px-2">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Items</p>
              <p className="text-3xl font-bold text-green-600">256</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Today's Orders</p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Customers</p>
              <p className="text-3xl font-bold text-green-600">48</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹35K</p>
            </div>
          </div>
          <div className="mt-8 mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {[
                { name: 'Wedding Event', price: '₹3500' },
                { name: 'Birthday Party', price: '₹1500' },
                { name: 'Stage Decoration', price: '₹5000' },
                { name: 'Corporate Event', price: '₹2800' },
                { name: 'Engagement Party', price: '₹4200' },
              ].map((order, index, array) => (
                <div
                  key={index}
                  className={`flex justify-between items-center px-4 py-4 ${
                    index !== array.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <span className="text-gray-700 font-medium">{order.name}</span>
                  <span className="text-green-600 font-semibold">{order.price}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Items Tab Content */}
      {activeTab === 'items' && (
        <main className="flex-1 overflow-y-auto pt-16 px-2">
          <div className="mt-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tent Items</h2>
            <div className="space-y-4">
              {dummyItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{item.category}</span>
                    <span className="font-semibold text-green-600">{item.price}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Available: {item.available}/{item.total}</span>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <main className="flex-1 overflow-y-auto pt-16 px-2">
          <div className="mt-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Orders</h2>
            <div className="space-y-4">
              {[
                { id: 'ORD001', name: 'Wedding Event', status: 'Completed', price: '₹3500' },
                { id: 'ORD002', name: 'Birthday Party', status: 'Pending', price: '₹1500' },
                { id: 'ORD003', name: 'Corporate Event', status: 'Confirmed', price: '₹2800' },
                { id: 'ORD004', name: 'Engagement Party', status: 'Pending', price: '₹4200' },
              ].map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.name}</h3>
                      <p className="text-gray-500 text-sm">{order.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Amount</span>
                    <span className="font-semibold text-green-600">{order.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Billing Tab Content */}
      {activeTab === 'billing' && (
        <main className="flex-1 overflow-y-auto pt-16 px-2">
          <div className="mt-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Billing</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-gray-600 text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold text-green-600">₹45K</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-gray-600 text-sm mb-1">This Year</p>
                <p className="text-2xl font-bold text-green-600">₹5.2L</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <h3 className="font-semibold text-gray-900 p-4 border-b">Recent Transactions</h3>
              {[
                { date: '13 Mar 2026', amount: '₹3500', type: 'Payment Received' },
                { date: '12 Mar 2026', amount: '₹2800', type: 'Payment Received' },
                { date: '11 Mar 2026', amount: '₹4200', type: 'Payment Received' },
                { date: '10 Mar 2026', amount: '₹1500', type: 'Payment Received' },
              ].map((transaction, index, array) => (
                <div
                  key={index}
                  className={`flex justify-between items-center px-4 py-3 ${
                    index !== array.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div>
                    <p className="text-gray-700 font-medium">{transaction.type}</p>
                    <p className="text-gray-500 text-sm">{transaction.date}</p>
                  </div>
                  <span className="text-green-600 font-semibold">{transaction.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 max-w-md mx-auto w-full">
        <button
          onClick={() => changeTab('home')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition flex-1 ${
            activeTab === 'home' ? 'text-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>
        <button
          onClick={() => changeTab('items')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition flex-1 ${
            activeTab === 'items' ? 'text-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Package size={24} />
          <span className="text-xs mt-1 font-medium">Items</span>
        </button>
        <button
          onClick={() => changeTab('orders')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition flex-1 ${
            activeTab === 'orders' ? 'text-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ClipboardList size={24} />
          <span className="text-xs mt-1 font-medium">Orders</span>
        </button>
        <button
          onClick={() => changeTab('billing')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition flex-1 ${
            activeTab === 'billing' ? 'text-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <DollarSign size={24} />
          <span className="text-xs mt-1 font-medium">Billing</span>
        </button>
      </nav>
    </div>
  );
}
