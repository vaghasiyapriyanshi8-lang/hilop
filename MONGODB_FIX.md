# MongoDB E11000 Index Error Fix

## Problem
The order collection has a duplicate key error on the `orderNumber` field with null values.

## Solutions

### Option 1: Drop and Recreate the Database (Easiest)

1. **Stop the backend server** (Ctrl+C in the terminal)
2. **Clear MongoDB data:**
   ```powershell
   # Open MongoDB connection (if mongo CLI is installed)
   mongo
   
   # In MongoDB shell:
   use hilop
   db.orders.deleteMany({})
   db.orders.dropIndex("orderNumber_1")
   exit
   ```

3. **Restart the backend:**
   ```powershell
   cd backend
   npm run dev
   ```

### Option 2: Drop Just the Orders Collection

```powershell
# In MongoDB shell:
use hilop
db.orders.drop()
```

This will remove all orders but preserve other data.

### Option 3: Drop the Specific Index

```powershell
# In MongoDB shell:
use hilop
db.orders.dropIndex("orderNumber_1")
```

## What Changed

- ✅ Added `orderNumber` field to Order model
- ✅ Auto-generates unique order numbers: `ORD-{timestamp}-{random}`
- ✅ Added sparse index to allow null values
- ✅ Added retry logic for duplicate key errors

## After Fix

1. Backend will automatically generate unique order numbers for each new order
2. The `orderNumber` will be visible in the orders page
3. No more duplicate key errors

## Testing

1. Clear the orders data using one of the options above
2. Start the backend: `npm run dev`
3. Go to frontend and place a new order
4. It should now work without errors
