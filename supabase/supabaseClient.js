/*REVISADO EL 22/04 17:00 PM*/
/*Se puede dejar de momento, pero la idea es cuando ya tengamos todo lo de supabase en el back quitarlo*/

import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://dkuwjfnqmworbdyoetbs.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdXdqZm5xbXdvcmJkeW9ldGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjU4ODgsImV4cCI6MjA1ODk0MTg4OH0.oUjDMgZ5VEddSURJ_Iw5_QIApwJ2XDlDB014NCcfhJA");

export default supabase;