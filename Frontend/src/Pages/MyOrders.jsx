import { motion } from "framer-motion";

const MyOrders = () => {
    return (
        <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            <p className="text-gray-600">Your previous orders will appear here.</p>
        </motion.div>
    );
};

export default MyOrders;
