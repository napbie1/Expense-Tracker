import Transactions from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("User is unauthorized.");
        }

        const userId = await context.getUser()._id;

        const transactions = await Transactions.find({ userId });
        return transactions;
      } catch (error) {
        console.log("Error in transactions", error);
        throw new Error(error.message || "Error getting transactions");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transactions.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log("Error in transaction", error);
        throw new Error(error.message || "Error getting a transaction");
      }
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transactions({
          ...input,
          userId: context.getUser()._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.log("Error in createTransaction", error);
        throw new Error("Error creating a new transaction");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transactions.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.log("Error in updateTransaction", error);
        throw new Error("Error updating transaction");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transactions.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.log("Error in deleteTransaction", error);
        throw new Error("Error deleting transaction");
      }
    },
  },
};

export default transactionResolver;
