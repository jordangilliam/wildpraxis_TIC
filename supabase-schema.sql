-- Supabase Database Schema for TIC App
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'parent', 'admin')),
  full_name TEXT,
  school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Classrooms table
CREATE TABLE classrooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  school TEXT NOT NULL,
  grade_level TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their classrooms" ON classrooms
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create classrooms" ON classrooms
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their classrooms" ON classrooms
  FOR UPDATE USING (auth.uid() = teacher_id);

-- Students table
CREATE TABLE students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their students" ON students
  FOR SELECT USING (
    classroom_id IN (
      SELECT id FROM classrooms WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage their students" ON students
  FOR ALL USING (
    classroom_id IN (
      SELECT id FROM classrooms WHERE teacher_id = auth.uid()
    )
  );

-- Student progress table
CREATE TABLE student_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lessons_completed TEXT[] DEFAULT '{}',
  badges_earned TEXT[] DEFAULT '{}',
  macros_identified INTEGER DEFAULT 0,
  field_observations INTEGER DEFAULT 0,
  game_scores JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view student progress" ON student_progress
  FOR SELECT USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN classrooms c ON s.classroom_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update student progress" ON student_progress
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN classrooms c ON s.classroom_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- Parent-student relationships
CREATE TABLE parent_students (
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (parent_id, student_id)
);

ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their connections" ON parent_students
  FOR SELECT USING (auth.uid() = parent_id);

-- Classroom updates table
CREATE TABLE classroom_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('announcement', 'photo', 'video', 'milestone')),
  media_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE classroom_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view classroom updates" ON classroom_updates
  FOR SELECT USING (
    -- Teachers can see their own updates
    auth.uid() = teacher_id
    OR
    -- Parents can see updates from classrooms their students are in
    classroom_id IN (
      SELECT s.classroom_id FROM students s
      JOIN parent_students ps ON s.id = ps.student_id
      WHERE ps.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create updates" ON classroom_updates
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid())
  );

-- Events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  volunteers_needed INTEGER DEFAULT 0,
  volunteers_signed_up UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view events" ON events
  FOR SELECT USING (
    -- Teachers can see their classroom events
    classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid())
    OR
    -- Parents can see events from their students' classrooms
    classroom_id IN (
      SELECT s.classroom_id FROM students s
      JOIN parent_students ps ON s.id = ps.student_id
      WHERE ps.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage events" ON events
  FOR ALL USING (
    classroom_id IN (SELECT id FROM classrooms WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Parents can sign up for events" ON events
  FOR UPDATE USING (
    classroom_id IN (
      SELECT s.classroom_id FROM students s
      JOIN parent_students ps ON s.id = ps.student_id
      WHERE ps.parent_id = auth.uid()
    )
  );

-- Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_students_classroom ON students(classroom_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON parent_students(student_id);
CREATE INDEX idx_classroom_updates_classroom ON classroom_updates(classroom_id);
CREATE INDEX idx_events_classroom ON events(classroom_id);
CREATE INDEX idx_events_date ON events(date);

