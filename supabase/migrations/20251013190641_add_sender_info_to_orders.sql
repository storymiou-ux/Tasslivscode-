/*
  # Add sender information to orders table

  1. Changes
    - Add `sender_name` column to store the sender's full name
    - Add `sender_phone` column to store the sender's phone number
    - Add `sender_address` column to store the sender's pickup address
    - Add `sender_business_name` column to store the sender's business name (optional)
    
  2. Notes
    - These fields will store the information entered in the booking form
    - This allows tracking the actual sender details at the time of order creation
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'sender_name'
  ) THEN
    ALTER TABLE orders ADD COLUMN sender_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'sender_phone'
  ) THEN
    ALTER TABLE orders ADD COLUMN sender_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'sender_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN sender_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'sender_business_name'
  ) THEN
    ALTER TABLE orders ADD COLUMN sender_business_name text;
  END IF;
END $$;