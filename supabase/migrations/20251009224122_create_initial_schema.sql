/*
  # Schéma initial pour la plateforme de livraison

  1. Nouvelles Tables
    
    ## Profils Utilisateurs (`profiles`)
    - `id` (uuid, clé primaire, référence auth.users)
    - `email` (text, unique, non null)
    - `full_name` (text)
    - `phone` (text)
    - `business_name` (text)
    - `subscription_plan` (text) - simple, pro, complete
    - `subscription_status` (text) - active, inactive, trial
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
    ## Clients (`customers`)
    - `id` (uuid, clé primaire)
    - `user_id` (uuid, référence profiles)
    - `full_name` (text, non null)
    - `phone` (text, non null)
    - `address` (text)
    - `zone` (text)
    - `notes` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
    ## Commandes (`orders`)
    - `id` (uuid, clé primaire)
    - `user_id` (uuid, référence profiles)
    - `customer_id` (uuid, référence customers)
    - `order_number` (text, unique)
    - `product_name` (text, non null)
    - `product_description` (text)
    - `amount` (numeric, non null)
    - `delivery_zone` (text, non null)
    - `delivery_address` (text, non null)
    - `status` (text) - processing, in_transit, delivered, cancelled
    - `requires_closing` (boolean, default false)
    - `closing_status` (text) - pending, confirmed, rejected, null
    - `closing_notes` (text)
    - `closing_called_at` (timestamptz)
    - `delivery_fee` (numeric, non null)
    - `tracking_number` (text)
    - `delivered_at` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
    ## Notes de Closing (`closing_requests`)
    - `id` (uuid, clé primaire)
    - `order_id` (uuid, référence orders)
    - `user_id` (uuid, référence profiles)
    - `status` (text) - pending, in_progress, completed, rejected
    - `assigned_to` (text)
    - `call_attempts` (integer, default 0)
    - `last_call_at` (timestamptz)
    - `result_notes` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour que les utilisateurs ne voient que leurs propres données
    - Politiques de lecture/écriture pour chaque table

  3. Index
    - Index sur user_id pour toutes les tables
    - Index sur order_number pour les commandes
    - Index sur status pour filtrage rapide
    - Index sur created_at pour tri chronologique
*/

-- Créer la table des profils
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  business_name text,
  subscription_plan text DEFAULT 'simple' CHECK (subscription_plan IN ('simple', 'pro', 'complete')),
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('active', 'inactive', 'trial')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des clients
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  address text,
  zone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  product_name text NOT NULL,
  product_description text,
  amount numeric NOT NULL CHECK (amount >= 0),
  delivery_zone text NOT NULL,
  delivery_address text NOT NULL,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'in_transit', 'delivered', 'cancelled')),
  requires_closing boolean DEFAULT false,
  closing_status text CHECK (closing_status IN ('pending', 'confirmed', 'rejected') OR closing_status IS NULL),
  closing_notes text,
  closing_called_at timestamptz,
  delivery_fee numeric NOT NULL CHECK (delivery_fee >= 0),
  tracking_number text,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer la table des demandes de closing
CREATE TABLE IF NOT EXISTS closing_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  assigned_to text,
  call_attempts integer DEFAULT 0,
  last_call_at timestamptz,
  result_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_closing_requests_order_id ON closing_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_closing_requests_user_id ON closing_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_closing_requests_status ON closing_requests(status);

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE closing_requests ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politiques RLS pour customers
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders"
  ON orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques RLS pour closing_requests
CREATE POLICY "Users can view own closing requests"
  ON closing_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own closing requests"
  ON closing_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own closing requests"
  ON closing_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own closing requests"
  ON closing_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_closing_requests_updated_at
  BEFORE UPDATE ON closing_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();