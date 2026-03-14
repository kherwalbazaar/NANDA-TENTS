'use client';

import { useState, useEffect } from 'react';
import { Menu, User, Home, Package, ClipboardList, DollarSign, Plus, ChevronRight, Phone, Share2 } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  name: string;
  price: string;
  date: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  items: OrderItem[];
  totalAmount: string;
  advance: string;
  balance: string;
  notes: string;
}

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
  const [showInstallPopup, setShowInstallPopup] = useState(false);
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

  const [dummyOrders, setDummyOrders] = useState<Order[]>([
    { 
      id: 1,
      name: 'Wedding Event', 
      price: '₹3500',
      date: '13 Mar 2026',
      customer: 'Rajesh Kumar',
      phone: '+91 9876543210',
      email: 'rajesh@example.com',
      address: '123 Main Street, Bhubaneswar',
      status: 'Confirmed',
      items: [
        { name: 'Wedding Tent (20x30)', quantity: 2, price: '₹2500/day' },
        { name: 'Chair Set (50)', quantity: 3, price: '₹300/day' },
        { name: 'Sound System', quantity: 1, price: '₹1000/day' }
      ],
      totalAmount: '₹3500',
      advance: '₹1000',
      balance: '₹2500',
      notes: 'Full setup required with decoration'
    },
    { 
      id: 2,
      name: 'Birthday Party', 
      price: '₹1500',
      date: '14 Mar 2026',
      customer: 'Priya Sharma',
      phone: '+91 8765432109',
      email: 'priya@example.com',
      address: '456 Park Avenue, Cuttack',
      status: 'Pending',
      items: [
        { name: 'Party Tent (10x15)', quantity: 1, price: '₹1500/day' },
        { name: 'Table (6ft)', quantity: 2, price: '₹200/day' }
      ],
      totalAmount: '₹1500',
      advance: '₹500',
      balance: '₹1000',
      notes: 'Birthday decorations needed'
    },
    { 
      id: 3,
      name: 'Stage Decoration', 
      price: '₹5000',
      date: '15 Mar 2026',
      customer: 'Amit Singh',
      phone: '+91 7654321098',
      email: 'amit@example.com',
      address: '789 Theater Road, Puri',
      status: 'In Progress',
      items: [
        { name: 'Stage Backdrop', quantity: 1, price: '₹800/day' },
        { name: 'Sound System', quantity: 1, price: '₹1000/day' },
        { name: 'Party Tent (10x15)', quantity: 3, price: '₹1500/day' }
      ],
      totalAmount: '₹5000',
      advance: '₹2000',
      balance: '₹3000',
      notes: 'Professional stage setup required'
    },
    { 
      id: 4,
      name: 'Corporate Event', 
      price: '₹2800',
      date: '16 Mar 2026',
      customer: 'Sunita Patel',
      phone: '+91 6543210987',
      email: 'sunita@example.com',
      address: '321 Business Center, Bhubaneswar',
      status: 'Confirmed',
      items: [
        { name: 'Wedding Tent (20x30)', quantity: 1, price: '₹2500/day' },
        { name: 'Chair Set (50)', quantity: 1, price: '₹300/day' }
      ],
      totalAmount: '₹2800',
      advance: '₹800',
      balance: '₹2000',
      notes: 'Corporate meeting setup'
    },
    { 
      id: 5,
      name: 'Engagement Party', 
      price: '₹4200',
      date: '17 Mar 2026',
      customer: 'Vikram Rao',
      phone: '+91 5432109876',
      email: 'vikram@example.com',
      address: '654 Celebration Hall, Cuttack',
      status: 'Confirmed',
      items: [
        { name: 'Party Tent (10x15)', quantity: 2, price: '₹1500/day' },
        { name: 'Chair Set (50)', quantity: 2, price: '₹300/day' },
        { name: 'Sound System', quantity: 1, price: '₹1000/day' }
      ],
      totalAmount: '₹4200',
      advance: '₹1500',
      balance: '₹2700',
      notes: 'Traditional engagement ceremony setup'
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Add Order Modal States
  const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderAddress, setNewOrderAddress] = useState('');
  const [newOrderEmail, setNewOrderEmail] = useState('');
  const [newOrderDate, setNewOrderDate] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<Array<{id: string, name: string, quantity: number, price: string}>>([]);
  const [newOrderAdvance, setNewOrderAdvance] = useState('');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install popup for Chrome browser
      if (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg')) {
        setShowInstallPopup(true);
      }
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

  const handleShareWhatsApp = () => {
    const appUrl = window.location.origin;
    const message = `*NANDA TENT* 🏕️\n\nProfessional Tent Rental Services\n\n📱 Download our app: ${appUrl}\n\n📞 Call us for bookings\n🏆 Best quality tents at affordable prices\n🎯 Perfect for weddings, parties, and events\n\n#NandaTent #TentRental`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
    const newOrder: Order = {
      id: dummyOrders.length + 1,
      name: 'New Order',
      price: '₹1000',
      date: new Date().toLocaleDateString('en-IN'),
      customer: 'New Customer',
      phone: '+91 0000000000',
      email: 'customer@example.com',
      address: 'Address not provided',
      status: 'Pending',
      items: [],
      totalAmount: '₹1000',
      advance: '₹0',
      balance: '₹1000',
      notes: 'New order created'
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

  const submitNewOrder = () => {
    if (newOrderCustomer && newOrderPhone && newOrderDate && newOrderItems.length > 0) {
      // Calculate total amount
      const totalAmount = newOrderItems.reduce((total, item) => {
        const price = parseInt(item.price.replace('₹', '').replace('/day', ''));
        return total + (price * item.quantity);
      }, 0);

      const advanceAmount = parseInt(newOrderAdvance) || 0;
      const balanceAmount = totalAmount - advanceAmount;

      const newOrder: Order = {
        id: dummyOrders.length + 1,
        name: `Order for ${newOrderCustomer}`,
        price: `₹${totalAmount}`,
        date: newOrderDate,
        customer: newOrderCustomer,
        phone: newOrderPhone,
        email: newOrderEmail,
        address: newOrderAddress,
        status: 'Pending',
        items: newOrderItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: `₹${totalAmount}`,
        advance: `₹${advanceAmount}`,
        balance: `₹${balanceAmount}`,
        notes: newOrderNotes
      };

      setDummyOrders([...dummyOrders, newOrder]);
      closeAddOrderModal();
    }
  };

  const addItemToOrder = (itemId: string) => {
    const item = dummyItems.find(i => i.id === itemId);
    if (item) {
      const existingItemIndex = newOrderItems.findIndex(i => i.id === itemId);
      if (existingItemIndex >= 0) {
        // Update quantity
        const updatedItems = [...newOrderItems];
        updatedItems[existingItemIndex].quantity += 1;
        setNewOrderItems(updatedItems);
      } else {
        // Add new item
        setNewOrderItems([...newOrderItems, {
          id: item.id,
          name: item.name,
          quantity: 1,
          price: item.price
        }]);
      }
    }
    // Close the dropdown menu after adding item
    setItemDropdownOpen(false);
  };

  const removeItemFromOrder = (itemId: string) => {
    setNewOrderItems(newOrderItems.filter(item => item.id !== itemId));
  };

  const subtractItemQuantity = (itemId: string) => {
    setNewOrderItems(newOrderItems.map(item =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(itemId);
      return;
    }
    const updatedItems = newOrderItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setNewOrderItems(updatedItems);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const openAddOrderModal = () => {
    setAddOrderModalOpen(true);
  };

  const closeAddOrderModal = () => {
    setAddOrderModalOpen(false);
    // Reset form
    setNewOrderCustomer('');
    setNewOrderPhone('');
    setNewOrderAddress('');
    setNewOrderEmail('');
    setNewOrderDate('');
    setNewOrderItems([]);
    setNewOrderAdvance('');
    setNewOrderNotes('');
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
        <h1 className="text-lg font-bold text-center flex-1">
          {activeTab === 'items' ? 'TENT ITEMS' : activeTab === 'orders' ? 'MY ALL ORDER' : 'NANDA TENT HOUSE'}
        </h1>
        {(activeTab === 'home' || activeTab === 'items' || activeTab === 'orders') && (
          <button
            onClick={activeTab === 'items' ? openItemModal : openAddOrderModal}
            className="p-2 hover:bg-green-700 rounded flex items-center space-x-1 bg-gray-50 text-green-600"
            aria-label={activeTab === 'items' ? "Add Items" : "Add Order"}
          >
            <Plus size={20} />
            <span className="text-sm font-medium">{activeTab === 'items' ? 'Add Items' : 'Add Order'}</span>
          </button>
        )}
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
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-green-600" />
            <span className="font-medium">Share on WhatsApp</span>
          </button>
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-green-600" />
            <span className="font-medium">Download APK</span>
          </button>
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
                <div key={index} className={`flex justify-between items-center px-4 py-4 cursor-pointer hover:bg-green-50 transition border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-green-50'
                }`}>
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">{order.name}</span>
                    <span className="text-gray-500 text-sm ml-2">- {order.date}</span>
                    <span className="text-gray-600 ml-2">- {order.price}</span>
                  </div>
                  <span 
                    className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full ml-2 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => openOrderDetails(order)}
                  >
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

      {/* Add Order Modal */}
      {addOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg -m-6 mb-4 relative flex justify-center items-center">
              <h2 className="text-xl font-bold text-center">Add New Order</h2>
              <button
                onClick={closeAddOrderModal}
                className="absolute right-4 top-4 text-white hover:text-gray-200 p-2 hover:bg-green-700 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={newOrderCustomer}
                      onChange={(e) => setNewOrderCustomer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newOrderPhone}
                      onChange={(e) => setNewOrderPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={newOrderAddress}
                      onChange={(e) => setNewOrderAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="date"
                  value={newOrderDate}
                  onChange={(e) => setNewOrderDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Items Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Select Items</h3>
                  <button
                    onClick={() => setItemDropdownOpen(!itemDropdownOpen)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    {itemDropdownOpen ? 'Close' : 'Add Items'}
                  </button>
                </div>

                {/* Items Dropdown */}
                {itemDropdownOpen && (
                  <div className="mb-4 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
                        <span>Name</span>
                        <span>Stock</span>
                        <span>Price/Day</span>
                        <span>Action</span>
                      </div>
                    </div>
                    {dummyItems.map((item) => (
                      <div key={item.id} className="px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
                        <div className="grid grid-cols-4 gap-2 items-center text-sm">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-gray-600">{item.available}</span>
                          <span className="text-green-600 font-medium">{item.price}</span>
                          <button
                            onClick={() => addItemToOrder(item.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Items Table */}
                <div className="bg-white shadow-sm overflow-hidden border border-gray-200 rounded-md">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-l border-r border-green-200 px-1 py-2 text-center font-bold text-white bg-pink-500 text-xs">ଦ୍ରବ୍ୟର ନାମ</th>
                        <th className="border-l border-r border-green-200 px-1 py-2 text-center font-bold text-white bg-pink-500 text-xs">ମୂଲ୍ୟ</th>
                        <th className="border-l border-r border-green-200 px-1 py-2 text-center font-bold text-white bg-pink-500 text-xs">ପରିମାଣ</th>
                        <th className="border-l border-r border-green-200 px-1 py-2 text-center font-bold text-white bg-pink-500 text-xs">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newOrderItems.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                          <td className="border border-green-200 p-2 text-center font-semibold text-gray-900 text-sm">{item.name}</td>
                          <td className="border border-green-200 p-2 text-center text-gray-600 text-sm">
                            <span className="text-base font-bold">{item.price.replace('₹', '').replace('/day', '')}</span><span className="text-xs">/day</span>
                          </td>
                          <td className="border border-green-200 p-2 text-center text-green-600 font-semibold">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => subtractItemQuantity(item.id)}
                                disabled={item.quantity <= 1}
                                className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold ${
                                  item.quantity <= 1
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600'
                                }`}
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                              <button
                                onClick={() => addItemToOrder(item.id)}
                                className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="border border-green-200 p-2 text-center">
                            <button
                              onClick={() => removeItemFromOrder(item.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Total Amount</h4>
                <p className="text-2xl font-bold text-green-600">
                  ₹{newOrderItems.reduce((total, item) => {
                    const price = parseInt(item.price.replace('₹', '').replace('/day', ''));
                    return total + (price * item.quantity);
                  }, 0).toLocaleString()}
                </p>
              </div>

              {/* Advance Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Payment (₹)</label>
                <input
                  type="number"
                  value={newOrderAdvance}
                  onChange={(e) => setNewOrderAdvance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter advance amount"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeAddOrderModal}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitNewOrder}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={!newOrderCustomer || !newOrderPhone || !newOrderDate || newOrderItems.length === 0}
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Item Add Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md border border-gray-300">
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg py-6 px-0 w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg -m-6 mb-4 relative flex justify-center items-center">
              <h2 className="text-xl font-bold text-center">Order Details</h2>
              <button
                onClick={closeOrderDetails}
                className="absolute right-4 top-4 text-white hover:text-gray-200 p-2 hover:bg-green-700 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              {/* Order Header */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedOrder.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Date:</span>
                    <p className="text-gray-800">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <p className={`font-medium ${
                      selectedOrder.status === 'Confirmed' ? 'text-green-600' :
                      selectedOrder.status === 'Pending' ? 'text-yellow-600' :
                      selectedOrder.status === 'In Progress' ? 'text-blue-600' : 'text-gray-600'
                    }`}>{selectedOrder.status}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 bg-gray-100 p-2 rounded">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-800">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-800">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Address:</span>
                    <p className="text-gray-800">{selectedOrder.address}</p>
                    <button
                      onClick={() => window.open(`tel:${selectedOrder.phone}`)}
                      className="mt-2 w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition"
                    >
                      <Phone size={18} />
                      <span className="font-medium text-sm">Call Customer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <h4 className="font-semibold text-gray-800 mb-3 bg-gray-100 p-2 rounded">Items Ordered</h4>
              <div className="bg-white shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ଦ୍ରବ୍ୟର ନାମ</th>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ପରିମାଣ</th>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ମୋଟ</th>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ସମୁଦାୟ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                        <td className="border border-green-200 p-2 text-center font-semibold text-gray-900 text-sm">{item.name}</td>
                        <td className="border border-green-200 p-2 text-center text-gray-600 text-sm">
                          <span className="text-base font-bold">{item.price.replace('₹', '').replace('/day', '')}</span><span className="text-xs">/day</span>
                        </td>
                        <td className="border border-green-200 p-2 text-center text-green-600 font-semibold">
                          <span className="text-lg font-bold">{item.quantity}</span>
                        </td>
                        <td className="border border-green-200 p-2 text-center text-green-600 font-semibold">
                          ₹{(parseInt(item.price.replace('₹', '').replace('/day', '')) * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Payment Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <span className="font-medium text-gray-600 block">Total</span>
                    <p className="text-lg font-bold text-green-600">{selectedOrder.totalAmount}</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-gray-600 block">Advance</span>
                    <p className="text-lg font-bold text-blue-600">{selectedOrder.advance}</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-gray-600 block">Balance</span>
                    <p className="text-lg font-bold text-red-600">{selectedOrder.balance}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeOrderDetails}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
