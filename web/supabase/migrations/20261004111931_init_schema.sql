-- Create patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  file_no TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policy so doctors can only see their own patients
CREATE POLICY "Doctors can view their own patients" ON patients
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert their own patients" ON patients
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own patients" ON patients
  FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own patients" ON patients
  FOR DELETE USING (auth.uid() = doctor_id);

-- Create documents table (for saved prescriptions and invoices)
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('rx', 'invoice')),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy so doctors can only see their own documents
CREATE POLICY "Doctors can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = doctor_id);
