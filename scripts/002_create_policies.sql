-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cultural sites policies
CREATE POLICY "Anyone can view active cultural sites" ON public.cultural_sites
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create cultural sites" ON public.cultural_sites
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own cultural sites" ON public.cultural_sites
  FOR UPDATE USING (auth.uid() = created_by);

-- Events policies
CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = created_by);

-- Stories policies
CREATE POLICY "Anyone can view published stories" ON public.stories
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = author_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);
