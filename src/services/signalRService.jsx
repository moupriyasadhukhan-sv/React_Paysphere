import * as signalR from "@microsoft/signalr";
import { showMerchantSuccess, showMerchantWarning, showMerchantError, showMerchantInfo } from "../utils/merchantToast";

let connection = null;

/**
 * Initialize SignalR Connection
 * Connects to the SignalR hub for real-time notifications
 */
export const initializeSignalR = async (merchantId) => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.on("PaymentReceived", (data) => {
      handlePaymentNotification(data);
    });

    connection.on("RefundRequested", (data) => {
      handleRefundNotification(data);
    });

    connection.on("SettlementProcessed", (data) => {
      handleSettlementNotification(data);
    });

    connection.onreconnected(() => {
      console.log("SignalR reconnected");
      showMerchantSuccess("Notification connection restored ✓", 2500);
    });

    connection.onreconnecting(() => {
      console.log("SignalR reconnecting...");
      showMerchantWarning("Reconnecting to notifications...", 2000);
    });

    connection.onclose(() => {
      console.log("SignalR disconnected");
      showMerchantError("Notification connection lost", 3000);
    });

    await connection.start();
    console.log("SignalR Connected");

    // Send merchant ID to server
    if (connection && merchantId) {
      await connection.invoke("SubscribeToMerchant", merchantId);
    }
  } catch (err) {
    console.error("SignalR Error:", err);
  }
};

/**
 * Handle Payment Received Notification
 * Shows when merchant receives money from a user
 */
const handlePaymentNotification = (data) => {
  const amount = data.amount?.toLocaleString ? data.amount.toLocaleString('en-IN') : data.amount;
  const customerName = data.customerName || "Customer";
  const transactionId = data.transactionId || "N/A";
  
  const message = `Payment of ₹${amount} received from ${customerName}`;
  
  showMerchantSuccess(message, 3500);
  
  // Also log the transaction ID
  console.log("Payment received - Transaction ID:", transactionId);
};

/**
 * Handle Refund Request Notification
 */
const handleRefundNotification = (data) => {
  const amount = data.amount?.toLocaleString ? data.amount.toLocaleString('en-IN') : data.amount;
  const customerName = data.customerName || "Customer";
  
  const message = `Refund request for ₹${amount} from ${customerName}`;
  showMerchantWarning(message, 4000);
};

/**
 * Handle Settlement Processed Notification
 */
const handleSettlementNotification = (data) => {
  const amount = data.amount?.toLocaleString ? data.amount.toLocaleString('en-IN') : data.amount;
  const period = data.period || "this period";
  
  const message = `Settlement of ₹${amount} for ${period} processed ✓`;
  showMerchantSuccess(message, 3500);
};

/**
 * Stop SignalR Connection
 */
export const stopSignalR = async () => {
  if (connection) {
    try {
      await connection.stop();
      console.log("SignalR Disconnected");
    } catch (err) {
      console.error("Error stopping SignalR:", err);
    }
  }
};

/**
 * Send custom notification
 */
export const sendNotification = async (message, type = "info") => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.invoke("SendNotification", message, type);
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  }
};

export default {
  initializeSignalR,
  stopSignalR,
  sendNotification,
};
