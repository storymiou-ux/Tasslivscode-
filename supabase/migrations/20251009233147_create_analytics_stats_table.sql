-- Create analytics stats table for monthly performance tracking
-- 
-- This table stores aggregated monthly statistics for business analytics

CREATE TABLE IF NOT EXISTS analytics_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month text NOT NULL,
  total_orders integer DEFAULT 0,
  conversion_rate decimal(5,2) DEFAULT 0.00,
  closing_improvement decimal(5,2) DEFAULT 0.00,
  revenue bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_user_month ON analytics_stats(user_id, month);

-- Enable RLS
ALTER TABLE analytics_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own analytics"
  ON analytics_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON analytics_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);