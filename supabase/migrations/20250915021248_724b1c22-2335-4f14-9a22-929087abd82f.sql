-- Harden functions without dropping
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists for auth.users -> profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Create enum type app_role if missing
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'premium', 'user');
  END IF;
END $$;

-- user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'premium' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1
$$;

-- RLS policies for user_roles (create if missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can view their own roles' AND tablename='user_roles'
  ) THEN
    CREATE POLICY "Users can view their own roles" 
    ON public.user_roles 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can view all roles' AND tablename='user_roles'
  ) THEN
    CREATE POLICY "Admins can view all roles" 
    ON public.user_roles 
    FOR SELECT 
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can insert roles' AND tablename='user_roles'
  ) THEN
    CREATE POLICY "Admins can insert roles" 
    ON public.user_roles 
    FOR INSERT 
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can update roles' AND tablename='user_roles'
  ) THEN
    CREATE POLICY "Admins can update roles" 
    ON public.user_roles 
    FOR UPDATE 
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    plan TEXT NOT NULL CHECK (plan IN ('basic', 'premium', 'professional')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS for subscriptions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can view their own subscription' AND tablename='subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscription" 
    ON public.subscriptions 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can insert their own subscription' AND tablename='subscriptions'
  ) THEN
    CREATE POLICY "Users can insert their own subscription" 
    ON public.subscriptions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can update their own subscription' AND tablename='subscriptions'
  ) THEN
    CREATE POLICY "Users can update their own subscription" 
    ON public.subscriptions 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger for subscriptions updated_at (create if missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Destinations columns
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vr_scene_url TEXT;

-- has_premium_access function
CREATE OR REPLACE FUNCTION public.has_premium_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT true FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'premium') LIMIT 1),
    (SELECT true FROM public.subscriptions WHERE user_id = _user_id AND status = 'active' AND plan != 'basic' LIMIT 1),
    false
  )
$$;

-- Replace open destinations policy with premium-gated policies
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Anyone can view destinations' AND tablename='destinations'
  ) THEN
    DROP POLICY "Anyone can view destinations" ON public.destinations;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Premium users can view available destinations' AND tablename='destinations'
  ) THEN
    CREATE POLICY "Premium users can view available destinations" 
    ON public.destinations 
    FOR SELECT 
    USING (
      CASE 
        WHEN available = true THEN public.has_premium_access(auth.uid())
        ELSE false
      END
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can view all destinations' AND tablename='destinations'
  ) THEN
    CREATE POLICY "Admins can view all destinations" 
    ON public.destinations 
    FOR SELECT 
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can manage destinations' AND tablename='destinations'
  ) THEN
    CREATE POLICY "Admins can manage destinations" 
    ON public.destinations 
    FOR ALL 
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Mark 10 earliest destinations available
UPDATE public.destinations 
SET available = true 
WHERE id IN (
  SELECT id FROM public.destinations ORDER BY created_at ASC LIMIT 10
);
