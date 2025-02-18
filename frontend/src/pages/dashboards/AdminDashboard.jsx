import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  ShoppingBag, 
  Activity,
  LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminServices';
import PurchaseList from '../../components/admin/PurchaseList';
import CustomerAnalysis from '../../components/admin/CustomerAnalysis';
import PurchasesAnalysis from '../../components/admin/PurchasesAnalysis';

const BentoCard = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col ${className}`}>
    <div className="flex items-center mb-4">
      <Icon className="mr-3 text-blue-600 w-6 h-6" />
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!dashboardData) return <div className="text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 w-full pt-10 pb-10">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-left flex-grow">
          Admin Dashboard
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-md"
        >
          <LogOut className="mr-2 w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 w-full">
        {/* Purchases Analysis */}
        <div className="col-span-12 md:col-span-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex items-center mb-4">
            <ShoppingBag className="mr-3 text-purple-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Purchases Analysis</h2>
          </div>
          <PurchasesAnalysis data={dashboardData.purchasesAnalysis} />
        </div>

        {/* Customer Analysis */}
        <div className="col-span-12 md:col-span-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex items-center mb-4">
            <Activity className="mr-3 text-green-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Customer Analysis</h2>
          </div>
          <CustomerAnalysis data={dashboardData.customerAnalysis} />
        </div>

        {/* Recent Purchases */}
        <div className="col-span-12 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="mr-3 text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Recent Purchases</h2>
          </div>
          <PurchaseList purchases={dashboardData.purchases} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;