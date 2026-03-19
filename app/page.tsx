'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, Home, Package, ClipboardList, DollarSign, Plus, ChevronRight, Phone, Share2, Download, LogOut, Edit, X, Save } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  available: number;
  total: number;
  status: string;
  createdAt?: any;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  eventDate: string;
  items: OrderItem[];
  totalAmount: number;
  advancePayment: number;
  balanceAmount: number;
  status: string;
  notes?: string;
  createdAt?: any;
}

export default function NandaTentHouse() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tents');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Piece');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallToast, setShowInstallToast] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Home page metrics
  const [totalItems, setTotalItems] = useState(0);
  const [todaysOrders, setTodaysOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Add Order Modal States
  const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderAddress, setNewOrderAddress] = useState('');
  const [newOrderEmail, setNewOrderEmail] = useState('');
  const [newOrderDate, setNewOrderDate] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<Array<{id: string, name: string, quantity: number, price: string}>>([]);
  const [newOrderAdvance, setNewOrderAdvance] = useState('');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);

  // Admin section states
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState<Partial<Item> | null>(null);

  // Calculate home page metrics
  const calculateMetrics = () => {
    // Total Items
    setTotalItems(items.length);

    // Today's Orders - count orders where eventDate is today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const todaysOrderCount = orders.filter(order => {
      const orderDate = new Date(order.eventDate).toISOString().split('T')[0];
      return orderDate === today;
    }).length;
    setTodaysOrders(todaysOrderCount);

    // Total Customers - unique customer names
    const uniqueCustomers = new Set(orders.map(order => order.customerName));
    setTotalCustomers(uniqueCustomers.size);

    // Total Revenue - sum of all order totalAmount
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalRevenue(revenue);

    // Total Investment - sum of (item price * available quantity) for all items
    const investment = items.reduce((sum, item) => sum + (item.price * item.available), 0);
    setTotalInvestment(investment);

    // Recent Orders - latest 5 orders sorted by createdAt
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    setRecentOrders(sortedOrders.slice(0, 5));
  };

  // Safe localStorage wrapper
  const safeLocalStorage = {
    getItem: (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Ignore failures in environments where localStorage is unavailable
      }
    },
  };

  // Cache management functions
  const loadFromCache = () => {
    try {
      const cachedItems = safeLocalStorage.getItem('nandaTent_items');
      const cachedOrders = safeLocalStorage.getItem('nandaTent_orders');
      if (cachedItems) {
        const itemsList = JSON.parse(cachedItems) as Item[];
        setItems(itemsList);
      }
      if (cachedOrders) {
        const ordersList = JSON.parse(cachedOrders) as Order[];
        setOrders(ordersList);
      }
      return cachedItems || cachedOrders; // Return true if any cache was loaded
    } catch (error) {
      console.error('Error loading from cache:', error);
      return false;
    }
  };

  const saveToCache = (items: Item[], orders: Order[]) => {
    try {
      safeLocalStorage.setItem('nandaTent_items', JSON.stringify(items));
      safeLocalStorage.setItem('nandaTent_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Load data from cache first, then fetch fresh in background
  useEffect(() => {
    const loadData = async () => {
      try {
        // First, load from cache and show immediately
        const hasCache = loadFromCache();
        if (hasCache) {
          calculateMetrics();
          setDataLoading(false); // Show cached data instantly
        } else {
          setDataLoading(true); // No cache, show loading
        }

        // Then fetch fresh data in background
        const itemsCollection = collection(db, 'items');
        const itemsSnapshot = await getDocs(itemsCollection);
        const itemsList = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Item[];

        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        // Update state with fresh data
        setItems(itemsList);
        setOrders(ordersList);
        saveToCache(itemsList, ordersList);
        calculateMetrics();

        // If no cache was loaded, now hide loading
        if (!hasCache) {
          setDataLoading(false);
        }

      } catch (error) {
        console.error('Error loading data:', error);
        if (!loadFromCache()) { // If no cache and error, show error
          alert('Error loading data from database');
          setDataLoading(false);
        }
      }
    };

    loadData();
  }, []);

  // Recalculate metrics when data changes
  useEffect(() => {
    if (!dataLoading && (items.length > 0 || orders.length > 0)) {
      calculateMetrics();
    }
  }, [items, orders, dataLoading]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }) => {
      // Only show for Chrome browsers (exclude Edge/Opera)
      if (!navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg') || navigator.userAgent.includes('OPR')) {
        return;
      }

      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallToast(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setShowInstallToast(false);
    setDeferredPrompt(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleNativeShare = async () => {
    const appUrl = window.location.origin;
    const shareData = {
      title: 'NANDA TENT',
      text: 'Professional Tent Rental Services for weddings, parties, and events!',
      url: appUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(appUrl);
      alert('NANDA TENT link copied to clipboard!');
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
    // This function is no longer needed as we add items through the modal
  };

  const openItemModal = () => {
    setItemModalOpen(true);
  };

  const closeItemModal = () => {
    setItemModalOpen(false);
    setNewItemName('');
    setNewItemCategory('Tents');
    setNewItemPrice('');
    setNewItemUnit('Piece');
    setNewItemDescription('');
    setNewItemQuantity('');
  };

  // Edit item functions
  const openEditItem = (item: Item) => {
    setEditingItemId(item.id);
    setEditItemData({ ...item });
  };

  const closeEditItem = () => {
    setEditingItemId(null);
    setEditItemData(null);
  };

  const saveEditedItem = async () => {
    if (!editingItemId || !editItemData) return;

    try {
      Utils.showLoading(true);
      await updateDoc(doc(db, 'items', editingItemId), {
        name: editItemData.name,
        price: editItemData.price,
        available: editItemData.available,
        unit: editItemData.unit,
        description: editItemData.description,
        updated_at: new Date()
      });
      
      // Update local state
      setItems(items.map(item => 
        item.id === editingItemId ? { ...item, ...editItemData } as Item : item
      ));
      
      Utils.showToast('Item updated successfully', 'success');
      closeEditItem();
      setIsEditingItems(false);
    } catch (error) {
      console.error('Error updating item:', error);
      Utils.showToast('Failed to update item', 'error');
    } finally {
      Utils.showLoading(false);
    }
  };

  const submitNewItem = async () => {
    if (!newItemName || !newItemPrice || !newItemQuantity) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const newItem: Item = {
        id: Date.now().toString(),
        name: newItemName,
        category: newItemCategory,
        price: parseInt(newItemPrice),
        unit: newItemUnit,
        description: newItemDescription || '',
        available: parseInt(newItemQuantity),
        total: parseInt(newItemQuantity),
        status: 'Available',
        createdAt: new Date()
      };

      // Add to Firestore
      await addDoc(collection(db, 'items'), newItem);

      // Update local state
      setItems([...items, newItem]);

      // Reset form
      setNewItemName('');
      setNewItemCategory('Tents');
      setNewItemPrice('');
      setNewItemUnit('Piece');
      setNewItemDescription('');
      setNewItemQuantity('');
      setItemModalOpen(false);

      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
    }
  };

  const submitNewOrder = async () => {
    if (newOrderCustomer && newOrderPhone && newOrderDate && newOrderItems.length > 0) {
      // Calculate total amount
      const totalAmount = newOrderItems.reduce((total, item) => {
        const price = parseInt(item.price.replace('₹', '').replace('/day', ''));
        return total + (price * item.quantity);
      }, 0);

      try {
        const newOrder = {
          id: Date.now().toString(),
          customerName: newOrderCustomer,
          phone: newOrderPhone,
          address: newOrderAddress,
          eventDate: newOrderDate,
          items: newOrderItems,
          advancePayment: parseInt(newOrderAdvance) || 0,
          totalAmount: totalAmount,
          balanceAmount: totalAmount - (parseInt(newOrderAdvance) || 0),
          status: 'Pending',
          createdAt: new Date()
        };

        // Add to Firestore
        await addDoc(collection(db, 'orders'), newOrder);

        // Update local state
        setOrders([...orders, newOrder]);
        closeAddOrderModal();

        alert('Order added successfully!');
      } catch (error) {
        console.error('Error adding order:', error);
        alert('Error adding order. Please try again.');
      }
    }
  };

  const updateOrder = async () => {
    if (!editingOrderId || !newOrderCustomer || !newOrderPhone || !newOrderDate || newOrderItems.length === 0) {
      return;
    }

    // Calculate total amount
    const totalAmount = newOrderItems.reduce((total, item) => {
      const price = parseInt(item.price.replace('₹', '').replace('/day', ''));
      return total + (price * item.quantity);
    }, 0);

    try {
      const updatedOrder = {
        customerName: newOrderCustomer,
        phone: newOrderPhone,
        address: newOrderAddress,
        eventDate: newOrderDate,
        items: newOrderItems,
        advancePayment: parseInt(newOrderAdvance) || 0,
        totalAmount: totalAmount,
        balanceAmount: totalAmount - (parseInt(newOrderAdvance) || 0),
        // Keep existing status and createdAt
      };

      // Update in Firestore
      const orderRef = doc(db, 'orders', editingOrderId);
      await updateDoc(orderRef, updatedOrder);

      // Update local state
      setOrders(orders.map(order =>
        order.id === editingOrderId
          ? { ...order, ...updatedOrder }
          : order
      ));

      closeAddOrderModal();

      alert('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    }
  };

  const addItemToOrder = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
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
          price: `₹${item.price}/${item.unit.toLowerCase()}`
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

  const editOrder = (order: Order) => {
    // Set editing mode
    setIsEditingOrder(true);
    setEditingOrderId(order.id);

    // Pre-populate form with existing order data
    setNewOrderCustomer(order.customerName);
    setNewOrderPhone(order.phone);
    setNewOrderAddress(order.address || '');
    setNewOrderDate(order.eventDate);
    setNewOrderItems(order.items);
    setNewOrderAdvance(order.advancePayment?.toString() || '');

    // Close order details modal and open add order modal
    setSelectedOrder(null);
    setAddOrderModalOpen(true);
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
    // Reset editing state
    setIsEditingOrder(false);
    setEditingOrderId(null);
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
        <div className="flex items-center space-x-2">
          {activeTab === 'billing' && (
            <button
              onClick={() => setIsEditingItems(!isEditingItems)}
              className={`p-2 rounded ${isEditingItems ? 'bg-white text-green-600' : 'hover:bg-green-700 text-white'}`}
              aria-label="Edit items"
              title={isEditingItems ? "Done editing" : "Edit all items"}
            >
              {isEditingItems ? <Save size={20} /> : <Edit size={20} />}
            </button>
          )}
          {!isEditingItems && (
            <button
              onClick={handleNativeShare}
              className="p-2 hover:bg-green-700 rounded"
              aria-label="Share app"
              title="Share NANDA TENT"
            >
              <Share2 size={20} />
            </button>
          )}
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
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Install prompt toast (Chrome only) */}
      {showInstallToast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-white border border-gray-200 shadow-lg p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            <div className="text-sm font-medium text-gray-800">Install NANDA TENT for faster access</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="text-sm font-semibold text-green-600"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallToast(false)}
              className="text-sm text-gray-500"
            >
              Dismiss
            </button>
          </div>
        </div>
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
            <span className="font-medium">Admin</span>
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
              handleLogout();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Home Tab Content */}
      {activeTab === 'home' && (
        <main className="flex-1 overflow-y-auto pt-16 px-2 relative">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Items</p>
              <p className="text-3xl font-bold text-green-600">{totalItems}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Today's Orders</p>
              <p className="text-3xl font-bold text-green-600">{todaysOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Customers</p>
              <p className="text-3xl font-bold text-green-600">{totalCustomers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-8 mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-600">No orders found.</div>
              ) : (
                recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className={`flex justify-between items-center px-4 py-4 ${
                      index !== recentOrders.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <span className="text-gray-700 font-medium">{order.customerName}</span>
                    <span className="text-green-600 font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {/* Items Tab Content */}
      {activeTab === 'items' && (
        <main className="flex-1 overflow-y-auto pt-16 px-0 bg-green-100">
          <div className="">
            <div className="bg-white shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-600">Loading items...</div>
              ) : items.length === 0 ? (
                <div className="p-6 text-center text-gray-600">No items found. Add items to get started.</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ଦ୍ରବ୍ୟର ନାମ</th>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ଦୈନିକ ମୂଲ୍ୟ</th>
                      <th className="border-l border-r border-green-200 p-2 text-center font-bold text-white bg-pink-500">ପରିମାଣ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-green-200 p-2 text-center font-semibold text-gray-900 text-sm">{item.name}</td>
                        <td className="border border-green-200 p-2 text-center text-gray-600 text-sm">
                          <span className="text-base font-bold">₹{item.price}</span><span className="text-xs">/{item.unit.toLowerCase()}</span>
                        </td>
                        <td className="border border-green-200 p-2 text-center text-green-600 font-semibold">
                          <span className="text-lg font-bold">{item.available}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <main className="flex-1 overflow-y-auto pt-16 px-0 bg-green-100">
          <div className="">
            <div className="bg-white shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-600">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-6 text-center text-gray-600">No orders yet. Create one to get started.</div>
              ) : (
                orders.map((order, index) => (
                  <div key={order.id} className={`flex justify-between items-center px-4 py-4 cursor-pointer hover:bg-green-50 transition border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-green-50'
                  }`}>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">{order.customerName}</span>
                      <span className="text-gray-500 text-sm ml-2">- {new Date(order.eventDate).toLocaleDateString('en-IN')}</span>
                      <span className="text-gray-600 ml-2">- ₹{order.totalAmount}</span>
                    </div>
                    <span 
                      className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full ml-2 cursor-pointer hover:bg-gray-200 transition"
                      onClick={() => openOrderDetails(order)}
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {/* Admin Tab Content */}
      {activeTab === 'billing' && (
        <main className="flex-1 overflow-y-auto pt-16 px-2">
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-gray-600 text-sm mb-1">Total Earning</p>
                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-gray-600 text-sm mb-1">Total Invest</p>
                <p className="text-2xl font-bold text-green-600">₹{totalInvestment.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <h3 className="font-semibold text-gray-900 p-4 border-b flex justify-between items-center">
                <span>All Items</span>
                {isEditingItems && (
                  <span className="text-sm text-green-600 font-medium">Tap an item to edit</span>
                )}
              </h3>
              {items.map((item, index, array) => (
                <div
                  key={index}
                  className={`flex justify-between items-center px-4 py-3 ${
                    index !== array.length - 1 ? 'border-b border-gray-200' : ''
                  } ${isEditingItems ? 'cursor-pointer hover:bg-green-50' : ''}`}
                  onClick={() => isEditingItems && openEditItem(item)}
                >
                  <div>
                    <p className="text-gray-700 font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">Cost: ₹{item.price} | Stock: {item.available} {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">₹{item.price * item.available}</span>
                    {isEditingItems && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditItem(item);
                        }}
                        className="p-1 hover:bg-green-100 rounded"
                      >
                        <Edit size={16} className="text-green-600" />
                      </button>
                    )}
                  </div>
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
              <h2 className="text-xl font-bold text-center">{isEditingOrder ? 'Update Order' : 'Add New Order'}</h2>
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
                    {items.map((item) => (
                      <div key={item.id} className="px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
                        <div className="grid grid-cols-4 gap-2 items-center text-sm">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-gray-600">{item.available}</span>
                          <span className="text-green-600 font-medium">₹{item.price}/{item.unit.toLowerCase()}</span>
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
                  onClick={isEditingOrder ? updateOrder : submitNewOrder}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={!newOrderCustomer || !newOrderPhone || !newOrderDate || newOrderItems.length === 0}
                >
                  {isEditingOrder ? 'Update Order' : 'Create Order'}
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedOrder.customerName}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Event Date:</span>
                    <p className="text-gray-800">{new Date(selectedOrder.eventDate).toLocaleDateString('en-IN')}</p>
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
                    <p className="text-gray-800">{selectedOrder.customerName}</p>
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
                    <p className="text-lg font-bold text-green-600">₹{selectedOrder.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-gray-600 block">Advance</span>
                    <p className="text-lg font-bold text-blue-600">₹{selectedOrder.advancePayment?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-gray-600 block">Balance</span>
                    <p className="text-lg font-bold text-red-600">₹{selectedOrder.balanceAmount?.toLocaleString()}</p>
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
                  onClick={() => editOrder(selectedOrder)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItemId && editItemData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg -m-6 mb-4 relative flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Item</h3>
              <button
                onClick={closeEditItem}
                className="text-white hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={editItemData.name || ''}
                  onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter item name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editItemData.price || ''}
                    onChange={(e) => setEditItemData({ ...editItemData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    value={editItemData.available || ''}
                    onChange={(e) => setEditItemData({ ...editItemData, available: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  value={editItemData.unit || 'Piece'}
                  onChange={(e) => setEditItemData({ ...editItemData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Piece">Piece</option>
                  <option value="Set">Set</option>
                  <option value="Kg">Kg</option>
                  <option value="Meter">Meter</option>
                  <option value="Liter">Liter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editItemData.description || ''}
                  onChange={(e) => setEditItemData({ ...editItemData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Item description"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4 mt-4 border-t">
              <button
                onClick={closeEditItem}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedItem}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
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
          <span className="text-xs mt-1 font-medium">Admin</span>
        </button>
      </nav>
    </div>
  );
}
