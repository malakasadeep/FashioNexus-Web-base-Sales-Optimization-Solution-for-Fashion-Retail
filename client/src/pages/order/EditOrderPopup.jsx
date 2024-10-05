import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css"; // Import SimpleBar styles

const EditOrderPopup = ({ order, onClose, onUpdate }) => {
  const [customer, setCustomer] = useState(order.customerInfo || {});
  const [delivery, setDelivery] = useState(order.deliveryInfo || {});
  const [items, setItems] = useState(order.items || []);

  const handleInputChange = (e, field, isCustomer = true) => {
    const { name, value } = e.target;
    if (isCustomer) {
      setCustomer({ ...customer, [name]: value });
    } else {
      setDelivery({ ...delivery, [name]: value });
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleUpdate = async () => {
    try {
      const updatedOrder = {
        ...order,
        customerInfo: customer,
        deliveryInfo: delivery,
        items: items,
      };

      const response = await axios.put(
        `/api/order/update/${order._id}`,
        updatedOrder
      );

      onUpdate(response.data);
      Swal.fire("Success", "Order updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="p-6 rounded-lg max-w-3xl w-full"
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <SimpleBar style={{ maxHeight: "80vh", width: "100%" }}>
          <div className="bg-PrimaryColor rounded-lg shadow-lg p-8 max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-darkColor">
              Edit Order
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2 text-darkColor">
                  Customer Information
                </h3>
                <input
                  type="text"
                  name="name"
                  value={customer.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  className="w-full p-3 border border-secondaryColor rounded mb-2"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={customer.email || ""}
                  onChange={(e) => handleInputChange(e, "email")}
                  className="w-full p-3 border border-secondaryColor rounded mb-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="mobile"
                  value={customer.mobile || ""}
                  onChange={(e) => handleInputChange(e, "mobile")}
                  className="w-full p-3 border border-secondaryColor rounded mb-2"
                  placeholder="Mobile"
                />
              </div>

              {delivery && delivery.address && (
                <div>
                  <h3 className="font-semibold mb-2 text-darkColor">
                    Delivery Information
                  </h3>
                  <input
                    type="text"
                    name="address"
                    value={delivery.address || ""}
                    onChange={(e) => handleInputChange(e, "address", false)}
                    className="w-full p-3 border border-secondaryColor rounded mb-2"
                    placeholder="Address"
                  />
                  <input
                    type="text"
                    name="city"
                    value={delivery.city || ""}
                    onChange={(e) => handleInputChange(e, "city", false)}
                    className="w-full p-3 border border-secondaryColor rounded mb-2"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={delivery.postalCode || ""}
                    onChange={(e) => handleInputChange(e, "postalCode", false)}
                    className="w-full p-3 border border-secondaryColor rounded mb-2"
                    placeholder="Postal Code"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-darkColor">Order Items</h3>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border border-secondaryColor p-4 mb-4 rounded-lg"
                >
                  <h4 className="font-semibold mb-2 text-darkColor">
                    Item Name: {item.title}
                  </h4>
                  <label>Size: </label>
                  <input
                    type="text"
                    value={item.size || ""}
                    onChange={(e) =>
                      handleItemChange(index, "size", e.target.value)
                    }
                    className="w-full p-3 border border-secondaryColor rounded mb-2"
                    placeholder="Size"
                  />
                  <label>Color: </label>
                  <input
                    type="color"
                    value={item.color || ""}
                    onChange={(e) =>
                      handleItemChange(index, "color", e.target.value)
                    }
                    className="w-6 h-6 border border-none rounded-3xl"
                    placeholder="Color"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-DarkColor hover:bg-ExtraDarkColor text-white px-6 py-3 rounded"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-SecondaryColor hover:bg-red-400 text-darkColor px-6 py-3 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </SimpleBar>
      </motion.div>
    </div>
  );
};

export default EditOrderPopup;
