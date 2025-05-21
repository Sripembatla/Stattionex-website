import { useGetTransactionHistoryQuery } from "@/app/redux-tookit/services/authApi";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TransactionTable = () => {
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedAmountRange, setSelectedAmountRange] = useState(null);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const { data } = useGetTransactionHistoryQuery({ page: currentPage }, { skip: !accessToken });
  const { data: allData } = useGetTransactionHistoryQuery({ page: "all" }, { skip: !accessToken });

  useEffect(() => {
    if (allData) {
      setTransactions(allData.transactions);
    }
  }, [allData]);

  useEffect(() => {
    if (allData?.transactions) {
      let filteredTransactions = allData.transactions;

      if (selectedStatus) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.transactionType === selectedStatus
        );
      }

      if (selectedDateRange) {
        const now = new Date();
        const startDate = new Date();

        if (selectedDateRange === "This month") {
          startDate.setDate(1);
        } else if (selectedDateRange === "Last 60 days") {
          startDate.setDate(now.getDate() - 60);
        } else if (selectedDateRange === "Last 90 days") {
          startDate.setDate(now.getDate() - 90);
        }

        filteredTransactions = filteredTransactions.filter(
          (transaction) => new Date(transaction.createdAt) >= startDate
        );
      }

      if (selectedAmountRange) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
          const amount = transaction.amount;
          if (selectedAmountRange === "Up - ₹500") return amount <= 500;
          if (selectedAmountRange === "₹500 - ₹2000") return amount > 500 && amount <= 2000;
          if (selectedAmountRange === "Above ₹2000") return amount > 2000;
          return true;
        });
      }

      setTransactions(filteredTransactions);
    }
  }, [selectedStatus, selectedDateRange, selectedAmountRange, allData]);

  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedDateRange(null);
    setSelectedAmountRange(null);
  };

  return (
    <div className="p-4 rounded-lg mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <div className="relative">
          <button
            onClick={() => setIsOpenFilter(!isOpenFilter)}
            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <Icon icon="mage:filter" width={25} height={25} color="black" />
          </button>
          {isOpenFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md p-2">
              <p className="font-semibold text-gray-700">Status</p>
              <label className="block p-2">
                <input type="radio" name="status" checked={selectedStatus === "credit"} onChange={() => setSelectedStatus("credit")} /> Credit Transactions
              </label>
              <label className="block p-2">
                <input type="radio" name="status" checked={selectedStatus === "debit"} onChange={() => setSelectedStatus("debit")} /> Debit Transactions
              </label>
              <label className="block p-2">
                <input type="radio" name="status" checked={selectedStatus === null} onChange={() => setSelectedStatus(null)} /> All Transactions
              </label>
              <hr className="my-2" />
              <p className="font-semibold text-gray-700">Date</p>
              <label className="block p-2">
                <input type="radio" name="date" checked={selectedDateRange === "This month"} onChange={() => setSelectedDateRange("This month")} /> This Month
              </label>
              <label className="block p-2">
                <input type="radio" name="date" checked={selectedDateRange === "Last 60 days"} onChange={() => setSelectedDateRange("Last 60 days")} /> Last 60 Days
              </label>
              <label className="block p-2">
                <input type="radio" name="date" checked={selectedDateRange === "Last 90 days"} onChange={() => setSelectedDateRange("Last 90 days")} /> Last 90 Days
              </label>
              <hr className="my-2" />
              <p className="font-semibold text-gray-700">Amount</p>
              <label className="block p-2">
                <input type="radio" name="amount" checked={selectedAmountRange === "Up - ₹500"} onChange={() => setSelectedAmountRange("Up - ₹500")} /> Up - ₹500
              </label>
              <label className="block p-2">
                <input type="radio" name="amount" checked={selectedAmountRange === "₹500 - ₹2000"} onChange={() => setSelectedAmountRange("₹500 - ₹2000")} /> ₹500 - ₹2000
              </label>
              <label className="block p-2">
                <input type="radio" name="amount" checked={selectedAmountRange === "Above ₹2000"} onChange={() => setSelectedAmountRange("Above ₹2000")} /> Above ₹2000
              </label>
              <hr className="my-2" />
              <button onClick={clearFilters} className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      <div className="min-w-full bg-blue-50 rounded-md p-4 h-screen overflow-y-auto no-scrollbar">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-3 border border-gray-200">
              <div>
                <h4 className="font-bold text-gray-800">{transaction.description || "Testing"}</h4>
                <p className="text-gray-500 text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <span className={`font-bold ${transaction.transactionType === "credit" ? "text-green-500" : "text-red-500"}`}>
                {transaction.transactionType === "credit" ? "+" : "-"} {transaction.amount}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-xl">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
