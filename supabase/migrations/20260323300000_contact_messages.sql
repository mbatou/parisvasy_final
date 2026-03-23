-- Contact form messages table
create table if not exists "ContactMessage" (
  id uuid default gen_random_uuid() primary key,
  "firstName" text not null,
  "lastName" text not null,
  email text not null,
  subject text not null,
  "bookingReference" text,
  message text not null,
  read boolean default false,
  "createdAt" timestamptz default now()
);

-- Allow service role full access
alter table "ContactMessage" enable row level security;

create policy "Service role full access on ContactMessage"
  on "ContactMessage"
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Index for listing/filtering
create index idx_contact_message_created on "ContactMessage" ("createdAt" desc);
create index idx_contact_message_read on "ContactMessage" (read);
