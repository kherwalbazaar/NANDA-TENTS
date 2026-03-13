'use client';

import { useState, useEffect } from 'react';
import { Menu, User, Home, Package, ClipboardList, DollarSign, Plus, ChevronRight } from 'lucide-react';

export default function NandaTentHouse() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tents');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dummyItems, setDummyItems] = useState([
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
  ]);

  const [dummyOrders, setDummyOrders] = useState([
    { name: 'Wedding Event', price: '₹3500' },
    { name: 'Birthday Party', price: '₹1500' },
    { name: 'Stage Decoration', price: '₹5000' },
    { name: 'Corporate Event', price: '₹2800' },
    { name: 'Engagement Party', price: '₹4200' },
  ]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert('To install this app, please use your browser\'s "Add to Home Screen" feature.');
    }
  };

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

  const addNewItem = () => {
    const newItem = {
      id: (dummyItems.length + 1).toString(),
      name: 'New Item',
      category: 'General',
      available: 1,
      total: 1,
      price: '₹500/day',
      description: 'Newly added item',
      status: 'Available'
    };
    setDummyItems([...dummyItems, newItem]);
  };

  const addOrder = () => {
    const newOrder = {
      name: 'New Order',
      price: '₹1000',
    };
    setDummyOrders([...dummyOrders, newOrder]);
  };

  const openItemModal = () => {
    setItemModalOpen(true);
  };

  const closeItemModal = () => {
    setItemModalOpen(false);
    setNewItemName('');
    setNewItemCategory('Tents');
    setNewItemPrice('');
    setNewItemQuantity('');
  };

  const submitNewItem = () => {
    if (newItemName && newItemPrice && newItemQuantity) {
      const newItem = {
        id: (dummyItems.length + 1).toString(),
        name: newItemName,
        category: newItemCategory,
        available: parseInt(newItemQuantity),
        total: parseInt(newItemQuantity),
        price: `₹${newItemPrice}/day`,
        description: `${newItemName} - ${newItemCategory}`,
        status: 'Available'
      };
      setDummyItems([...dummyItems, newItem]);
      closeItemModal();
    }
  };

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
        <h1 className="text-lg font-bold text-center flex-1">{activeTab === 'items' ? 'TENT ITEMS' : 'NANDA TENT HOUSE'}</h1>
        <button
          onClick={openItemModal}
          className="p-2 hover:bg-green-700 rounded flex items-center space-x-1 bg-gray-50 text-green-600"
          aria-label="Add Items"
        >
          <Plus size={20} />
          <span className="text-sm font-medium">Add Items</span>
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
          <button
            onClick={() => {
              closeSidebar();
              handleInstallClick();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition w-full text-left"
          >
            <Package size={20} />
            <span className="font-medium">Download APK</span>
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
        <main className="flex-1 overflow-y-auto pt-16 px-0 bg-green-100">
          <div className="">
            <div className="bg-white shadow-sm overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ଦ୍ରବ୍ୟର ନାମ</th>
                    <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ଦୈନିକ ମୂଲ୍ୟ</th>
                    <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ପରିମାଣ</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-green-200 p-2 text-center font-semibold text-gray-900 text-sm">{item.name}</td>
                      <td className="border border-green-200 p-2 text-center text-gray-600 text-sm">
                        <span className="text-base font-bold">{item.price.replace('₹', '').replace('/day', '')}</span><span className="text-xs">/day</span>
                      </td>
                      <td className="border border-green-200 p-2 text-center text-green-600 font-semibold">
                        <span className="text-lg font-bold">{item.available}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <main className="flex-1 overflow-y-auto pt-16 px-0 bg-green-100">
          <div className="">
            <div className="bg-white shadow-sm overflow-hidden">
              {dummyOrders.map((order, index) => (
                <div key={index} className={`flex justify-between items-center px-4 py-4 cursor-pointer hover:bg-green-50 transition ${
                  index % 2 === 0 ? 'bg-white' : 'bg-green-50'
                }`}>
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">{order.name}</span>
                    <span className="text-gray-500 text-sm ml-2">- 13 Mar 2026</span>
                    <span className="text-gray-600 ml-2">- {order.price}</span>
                  </div>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full ml-2">
                    <ChevronRight size={16} className="text-gray-600" />
                  </span>
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

      {/* Item Add Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ନୂଆ ଦ୍ରବ୍ୟ ଯୋଗ କରନ୍ତୁ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ଦ୍ରବ୍ୟର ନାମ</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ଦ୍ରବ୍ୟର ନାମ ଲେଖନ୍ତୁ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ଦୈନିକ ମୂଲ୍ୟ (₹)</label>
                <input
                  type="number"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ମୂଲ୍ୟ ଲେଖନ୍ତୁ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ପରିମାଣ</label>
                <input
                  type="number"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ପରିମାଣ ଲେଖନ୍ତୁ"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeItemModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ବାତିଲ୍
              </button>
              <button
                onClick={submitNewItem}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={!newItemName || !newItemPrice || !newItemQuantity}
              >
                ଯୋଗ କରନ୍ତୁ
              </button>
            </div>
          </div>
        </div>
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
