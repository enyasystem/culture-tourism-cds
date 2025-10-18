-- Create an admin user (you'll need to update this with a real email)
-- First, the user needs to sign up normally through the auth system
-- Then run this script to promote them to admin

-- Update user role to admin (replace 'admin@example.com' with actual admin email)
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@example.com'
);

-- If no profile exists yet, create one
INSERT INTO user_profiles (user_id, full_name, role, state_of_deployment, local_government, place_of_primary_assignment)
SELECT
  id,
  'Admin User',
  'admin',
  'PL',
  'Jos North',
  'Platform Administration'
FROM auth.users
WHERE email = 'admin@example.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_id = auth.users.id
);
