import React from 'react';

const Customer = () => {
  // Sample data (replace with API calls or props)
  const customer = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield',
    orders: [
      { id: 1, item: 'T-Shirt', date: '2025-05-20', status: 'Delivered' },
      { id: 2, item: 'Shoes', date: '2025-05-10', status: 'Shipped' },
      { id: 3, item: 'Hat', date: '2025-05-27', status: 'Processing' },
    ],
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Color code statuses
  const statusColors = {
    Delivered: 'bg-green-100 text-green-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Customer Profile</h1>

      <section className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="text-sm uppercase font-semibold text-gray-500 mb-1">Name</p>
            <p className="text-lg">{customer.name}</p>
          </div>
          <div>
            <p className="text-sm uppercase font-semibold text-gray-500 mb-1">Email</p>
            <p className="text-lg">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm uppercase font-semibold text-gray-500 mb-1">Address</p>
            <p className="text-lg">{customer.address}</p>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Order History</h2>
        {customer.orders.length === 0 ? (
          <p className="text-gray-500 italic">No orders found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {customer.orders.map((order) => (
              <li key={order.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-2 md:mb-0">
                  <p className="text-lg font-semibold text-gray-800">{order.item}</p>
                  <p className="text-sm text-gray-500">Order Date: {formatDate(order.date)}</p>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Customer;
