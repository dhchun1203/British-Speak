import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("visits").insert({});
    if (error) {
      console.error("Visit record error:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("Visit record error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
